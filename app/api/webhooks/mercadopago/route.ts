import { MercadoPagoConfig, Payment } from "mercadopago";
import { NextRequest, NextResponse } from "next/server";

import { PaymentStatus } from "@/app/generated/prisma/enums";

import { UpdateRaffleUseCase } from "@/backend/context/raffle/application/use-case";
import { PrismaRaffleRepository } from "@/backend/context/raffle/infrastructure/database/raffle.prisma-repository";

import { UpsertPaymentUseCase } from "@/backend/context/payment/application/use-case";
import { PrismaPaymentRepository } from "@/backend/context/payment/infrastructure/database/payment.prisma-repository";

import { CustomError } from "@/backend/shared/errors";

const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN!,
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (body.type !== "payment") {
      return NextResponse.json({ received: true });
    }

    const paymentId = body.data.id;

    const payment = new Payment(client);
    const paymentData = await payment.get({ id: paymentId });

    const paymentRepository = new PrismaPaymentRepository();
    const upsertPaymentUseCase = new UpsertPaymentUseCase(paymentRepository);
    const raffleRepository = new PrismaRaffleRepository();
    const updateRaffleUseCase = new UpdateRaffleUseCase(raffleRepository);

    const raffleId = paymentData.external_reference;

    if (!raffleId) {
      return NextResponse.json({ received: true });
    }

    let status: PaymentStatus;

    switch (paymentData.status) {
      case "approved":
        status = "APPROVED";
        break;
      case "pending":
      case "in_process":
        status = "PENDING";
        break;
      case "cancelled":
        status = "CANCELLED";
        break;
      case "rejected":
      default:
        status = "REJECTED";
        break;
    }

    await upsertPaymentUseCase.execute({
      provider: "MERCADO_PAGO",
      providerPaymentId: paymentData.id!.toString(),
      amount: paymentData.transaction_amount!,
      currency: paymentData.currency_id!,
      status,
      paymentType: "RAFFLE_ACTIVATION",
      raffleId,
      payerEmail: paymentData.payer?.email,
      payerName: paymentData.payer?.first_name,
      providerMetadata: paymentData,
      paidAt: status === "APPROVED" ? new Date() : null,
    });

    if (status === "APPROVED") {
      await updateRaffleUseCase.execute(raffleId, {
        status: "ACTIVE",
        publishedAt: new Date(),
      });
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    if (error instanceof CustomError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.statusCode }
      );
    }

    const message =
      error instanceof Error ? error.message : "Internal server error";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
