import { MercadoPagoConfig, Payment } from "mercadopago";
import { NextRequest, NextResponse } from "next/server";

import {
  PaymentStatus,
  PaymentType,
  RaffleStatus,
  ReservationStatus,
} from "@/app/generated/prisma/enums";

import prisma from "@/lib/prisma";

import { UpdateRaffleUseCase } from "@/backend/context/raffle/application/use-case";
import { PrismaRaffleRepository } from "@/backend/context/raffle/infrastructure/database/raffle.prisma-repository";

import { UpsertPaymentUseCase } from "@/backend/context/payment/application/use-case";
import { PrismaPaymentRepository } from "@/backend/context/payment/infrastructure/database/payment.prisma-repository";

import { Prisma } from "@/app/generated/prisma/client";
import { CustomError } from "@/backend/shared/errors";

function mapStatus(mpStatus: string | undefined): PaymentStatus {
  switch (mpStatus) {
    case "approved":
      return PaymentStatus.APPROVED;
    case "pending":
    case "in_process":
      return PaymentStatus.PENDING;
    case "cancelled":
      return PaymentStatus.CANCELLED;
    case "rejected":
    default:
      return PaymentStatus.REJECTED;
  }
}

export async function POST(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const body = await req.json().catch(() => ({}));

    if (body.type !== "payment" && searchParams.get("topic") !== "payment") {
      return NextResponse.json({ received: true });
    }

    const mpPaymentId =
      body.data?.id || searchParams.get("data.id") || searchParams.get("id");

    if (!mpPaymentId) {
      return NextResponse.json({ received: true });
    }

    const mpUserId = body.user_id || searchParams.get("user_id");

    const company = mpUserId
      ? await prisma.company.findFirst({
          where: { mpUserId: String(mpUserId) },
        })
      : null;

    // Si encontramos la company usamos su token, sino caemos al token propio
    // (para RAFFLE_ACTIVATION que fue pagado a nuestra cuenta)
    const accessToken =
      company?.mpAccessToken ?? process.env.MERCADOPAGO_ACCESS_TOKEN!;

    const client = new MercadoPagoConfig({ accessToken });
    const mpPayment = new Payment(client);
    const paymentData = await mpPayment.get({ id: mpPaymentId });

    const externalReference = paymentData.external_reference;

    if (!externalReference) {
      return NextResponse.json({ received: true });
    }

    const status = mapStatus(paymentData.status);

    const numberPurchasePayment = await prisma.payment.findFirst({
      where: {
        id: externalReference,
        paymentType: PaymentType.NUMBER_PURCHASE,
      },
    });

    if (numberPurchasePayment) {
      // --- Flujo: compra de números ---
      await prisma.$transaction(async (tx) => {
        await tx.payment.update({
          where: { id: numberPurchasePayment.id },
          data: {
            status,
            providerPaymentId: paymentData.id!.toString(),
            providerMetadata: paymentData as unknown as Prisma.InputJsonValue,
            paidAt: status === PaymentStatus.APPROVED ? new Date() : null,
          },
        });

        if (status === PaymentStatus.APPROVED) {
          await tx.soldNumber.updateMany({
            where: { paymentId: numberPurchasePayment.id },
            data: {
              status: ReservationStatus.SOLD,
              reservedUntil: null,
            },
          });
        }

        if (
          status === PaymentStatus.REJECTED ||
          status === PaymentStatus.CANCELLED
        ) {
          await tx.soldNumber.updateMany({
            where: { paymentId: numberPurchasePayment.id },
            data: {
              status: ReservationStatus.AVAILABLE,
              paymentId: null,
              reservedBy: null,
              reservedAt: null,
              reservedUntil: null,
            },
          });
        }
      });

      return NextResponse.json({ received: true });
    }

    // --- Flujo: activación de rifa  ---
    const raffleId = externalReference;

    const paymentRepository = new PrismaPaymentRepository();
    const upsertPaymentUseCase = new UpsertPaymentUseCase(paymentRepository);
    const raffleRepository = new PrismaRaffleRepository();
    const updateRaffleUseCase = new UpdateRaffleUseCase(raffleRepository);

    await upsertPaymentUseCase.execute({
      provider: "MERCADO_PAGO",
      providerPaymentId: paymentData.id!.toString(),
      amount: paymentData.transaction_amount!,
      currency: paymentData.currency_id!,
      status,
      paymentType: PaymentType.RAFFLE_ACTIVATION,
      raffleId,
      payerEmail: paymentData.payer?.email,
      payerName: paymentData.payer?.first_name,
      providerMetadata: paymentData,
      paidAt: status === PaymentStatus.APPROVED ? new Date() : null,
    });

    if (status === PaymentStatus.APPROVED) {
      await updateRaffleUseCase.execute(raffleId, {
        status: RaffleStatus.ACTIVE,
        publishedAt: new Date(),
      });
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("[MP Webhook] Error:", error);
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
