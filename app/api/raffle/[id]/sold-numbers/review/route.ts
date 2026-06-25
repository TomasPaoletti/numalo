import React from "react";
import { NextRequest, NextResponse } from "next/server";

import { PaymentStatus, ReservationStatus } from "@/app/generated/prisma/enums";

import prisma from "@/lib/prisma";
import { sendEmail } from "@/lib/email/send-email";
import TransferApprovedEmail from "@/lib/email/templates/transfer-approved.email";
import TransferDeniedEmail from "@/lib/email/templates/transfer-denied.email";
import { APP_URL } from "@/lib/utils";

import { CustomError, ValidationError } from "@/backend/shared/errors";
import { requireAuth } from "@/backend/shared/guards/auth.guard";
import { RaffleVerifyComplete } from "@/backend/shared/raffle/raffle-verify-complete";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { companyId } = await requireAuth();

    const { id: raffleId } = await params;
    const { paymentId, action } = await req.json();

    const raffle = await prisma.raffle.findUnique({
      where: { id: raffleId },
      select: {
        companyId: true,
        drawTrigger: true,
        title: true,
        company: {
          select: {
            id: true,
            name: true,
            image: true,
            phone: true,
            titular: true,
            alias: true,
            cbu: true,
            cuit: true,
            banco: true,
            canCreateFreeRaffle: true,
            createdAt: true,
            users: { select: { email: true } },
          },
        },
      },
    });

    if (!raffle || raffle.companyId !== companyId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    if (!paymentId || !action) {
      throw new ValidationError("Faltan parámetros requeridos");
    }

    if (action !== "approve" && action !== "deny") {
      throw new ValidationError("Acción inválida");
    }

    const payment = await prisma.payment.findUnique({
      where: { id: paymentId, raffleId },
      include: {
        soldNumbers: true,
      },
    });

    if (!payment) {
      throw new ValidationError("Pago no encontrado");
    }

    const soldNumberIds = payment.soldNumbers.map((s) => s.id);
    const numbers = payment.soldNumbers.map((s) => s.number);
    const raffleUrl = `${APP_URL}/raffle/${raffleId}`;

    if (action === "approve") {
      await prisma.$transaction([
        prisma.soldNumber.updateMany({
          where: { id: { in: soldNumberIds } },
          data: { status: ReservationStatus.SOLD, reservedUntil: null },
        }),
        prisma.payment.update({
          where: { id: paymentId },
          data: { status: PaymentStatus.APPROVED, paidAt: new Date() },
        }),
      ]);

      if (payment.payerEmail) {
        sendEmail({
          to: payment.payerEmail,
          subject: `¡Pago confirmado para la rifa!`,
          template: React.createElement(TransferApprovedEmail, {
            payerName: payment.payerName ?? "Participante",
            raffleTitle: raffle.title,
            numbers,
            totalAmount: Number(payment.amount),
            raffleUrl,
          }),
        }).catch((err) => console.error("[review] Error enviando email aprobación:", err));
      }

      if (raffle.drawTrigger === "VENDER_TODO") {
        try {
          await RaffleVerifyComplete(raffleId, raffle.company);
        } catch (err) {
          console.error("[review] Error al cerrar rifa tras aprobación:", err);
        }
      }
    } else {
      await prisma.$transaction([
        prisma.soldNumber.updateMany({
          where: { id: { in: soldNumberIds } },
          data: {
            status: ReservationStatus.AVAILABLE,
            paymentId: null,
            reservedBy: null,
            reservedAt: null,
            reservedUntil: null,
          },
        }),
        prisma.payment.update({
          where: { id: paymentId },
          data: { status: PaymentStatus.REJECTED },
        }),
      ]);

      if (payment.payerEmail) {
        sendEmail({
          to: payment.payerEmail,
          subject: `Comprobante no aprobado`,
          template: React.createElement(TransferDeniedEmail, {
            payerName: payment.payerName ?? "Participante",
            raffleTitle: raffle.title,
            numbers,
            raffleUrl,
          }),
        }).catch((err) => console.error("[review] Error enviando email denegación:", err));
      }
    }

    return NextResponse.json({ ok: true });
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
