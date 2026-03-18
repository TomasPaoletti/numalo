import { MercadoPagoConfig, Payment } from "mercadopago";
import { NextRequest, NextResponse } from "next/server";
import React from "react";

import {
  PaymentStatus,
  PaymentType,
  RaffleStatus,
  ReservationStatus,
} from "@/app/generated/prisma/enums";

import { Prisma } from "@/app/generated/prisma/client";

import prisma from "@/lib/prisma";

import { sendEmail } from "@/lib/email/send-email";
import NumberPurchasedEmail from "@/lib/email/templates/number-purchased.email";
import RaffleActivatedEmail from "@/lib/email/templates/raffle-activated.email";

import { UpdateRaffleUseCase } from "@/backend/context/raffle/application/use-case";
import { PrismaRaffleRepository } from "@/backend/context/raffle/infrastructure/database/raffle.prisma-repository";

import { UpsertPaymentUseCase } from "@/backend/context/payment/application/use-case";
import { PrismaPaymentRepository } from "@/backend/context/payment/infrastructure/database/payment.prisma-repository";

import { CustomError } from "@/backend/shared/errors";

const APP_URL =
  process.env.NODE_ENV === "production"
    ? process.env.NEXT_PUBLIC_APP_URL
    : process.env.NGROK_URL;

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
          include: {
            users: {
              select: { email: true },
              take: 1,
            },
          },
        })
      : null;

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

    // --- Flujo: compra de números ---
    const numberPurchasePayment = await prisma.payment.findFirst({
      where: {
        id: externalReference,
        paymentType: PaymentType.NUMBER_PURCHASE,
      },
    });

    if (numberPurchasePayment) {
      if (
        numberPurchasePayment.status === PaymentStatus.APPROVED ||
        numberPurchasePayment.status === PaymentStatus.REJECTED ||
        numberPurchasePayment.status === PaymentStatus.CANCELLED
      ) {
        return NextResponse.json({ received: true });
      }

      let soldNumbersList: number[] = [];

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
          const soldNumbers = await tx.soldNumber.findMany({
            where: { paymentId: numberPurchasePayment.id },
            select: { number: true },
          });

          soldNumbersList = soldNumbers.map((s) => s.number);

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

      // Email al comprador solo si fue aprobado
      if (
        status === PaymentStatus.APPROVED &&
        numberPurchasePayment.payerEmail
      ) {
        const raffle = await prisma.raffle.findUnique({
          where: { id: numberPurchasePayment.raffleId },
          select: { title: true, drawDate: true },
        });

        if (raffle) {
          await sendEmail({
            to: numberPurchasePayment.payerEmail,
            subject: `Tus números para "${raffle.title}" están confirmados ✅`,
            template: React.createElement(NumberPurchasedEmail, {
              payerName: numberPurchasePayment.payerName ?? "Participante",
              raffleTitle: raffle.title,
              numbers: soldNumbersList,
              totalAmount: Number(numberPurchasePayment.amount),
              raffleUrl: `${APP_URL}/rifa/${numberPurchasePayment.raffleId}`,
              drawDate: raffle.drawDate
                ? raffle.drawDate.toLocaleDateString("es-AR")
                : null,
            }),
          }).catch((err) =>
            console.error("[Email] Error enviando confirmación de compra:", err)
          );
        }
      }

      return NextResponse.json({ received: true });
    }

    // --- Flujo: activación de rifa ---
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

      // Email al rifador
      const raffle = await prisma.raffle.findUnique({
        where: { id: raffleId },
        select: {
          title: true,
          totalNumbers: true,
          numberPrice: true,
          company: {
            select: {
              name: true,
              users: {
                select: { email: true },
                take: 1,
              },
            },
          },
        },
      });

      if (raffle && raffle.company.users[0]?.email) {
        await sendEmail({
          to: raffle.company.users[0].email,
          subject: `Tu rifa "${raffle.title}" ya está activa 🎉`,
          template: React.createElement(RaffleActivatedEmail, {
            companyName: raffle.company.name,
            raffleTitle: raffle.title,
            raffleUrl: `${APP_URL}/admin/rifas/${raffleId}`,
            totalNumbers: raffle.totalNumbers,
            numberPrice: Number(raffle.numberPrice),
          }),
        }).catch((err) =>
          console.error("[Email] Error enviando email de activación:", err)
        );
      }
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
