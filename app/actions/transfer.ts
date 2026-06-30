"use server";

import React from "react";
import { getServerSession } from "next-auth";

import { PaymentProvider, PaymentType, RaffleStatus, ReservationStatus } from "@/app/generated/prisma/enums";

import { authOptions } from "@/lib/auth";
import { sendEmail } from "@/lib/email/send-email";
import TransferReceivedEmail from "@/lib/email/templates/transfer-received.email";
import prisma from "@/lib/prisma";

import { deleteAsset, uploadDocument, uploadImage } from "@/backend/shared/cloudinary/cloudinary-uploader";

export async function submitComprobante(formData: FormData): Promise<{
  ok: boolean;
  error?: string;
}> {
  try {
    const raffleId = formData.get("raffleId") as string | null;
    const sessionId = formData.get("sessionId") as string | null;
    const file = formData.get("comprobante") as File | null;
    const payerName = (formData.get("payerName") as string | null) ?? "";
    const payerEmail = (formData.get("payerEmail") as string | null) ?? "";
    const payerPhone = (formData.get("payerPhone") as string | null) ?? "";

    if (!raffleId || !sessionId || !file) {
      return { ok: false, error: "Faltan datos obligatorios." };
    }

    if (!payerEmail) {
      return { ok: false, error: "El email es obligatorio para recibir confirmación." };
    }

    const session = await getServerSession(authOptions);

    const resolvedName = payerName || session?.user?.name || "Participante";
    const resolvedEmail = payerEmail || session?.user?.email || "";

    if (!resolvedEmail) {
      return { ok: false, error: "El email es obligatorio para recibir confirmación." };
    }

    const raffle = await prisma.raffle.findUnique({
      where: { id: raffleId, status: RaffleStatus.ACTIVE },
      select: { id: true, title: true, numberPrice: true },
    });

    if (!raffle) {
      return { ok: false, error: "La rifa no está disponible." };
    }

    const reservedNumbers = await prisma.soldNumber.findMany({
      where: {
        raffleId,
        reservedBy: sessionId,
        status: ReservationStatus.RESERVED,
      },
      select: { id: true, number: true },
    });

    if (reservedNumbers.length === 0) {
      return { ok: false, error: "No hay números reservados para esta sesión." };
    }

    const folderSoldNumberId = reservedNumbers[0].id;
    const buffer = Buffer.from(await file.arrayBuffer());
    const uploadOptions = {
      folder: `numeralo/comprobantes/${folderSoldNumberId}`,
      publicId: "comprobante",
    };
    const isImage = file.type.startsWith("image/");
    const { url: comprobanteUrl, publicId: comprobantePublicId } = isImage
      ? await uploadImage(buffer, uploadOptions)
      : await uploadDocument(buffer, uploadOptions);

    const totalAmount = Number(raffle.numberPrice) * reservedNumbers.length;

    try {
      await prisma.$transaction(async (tx) => {
        const newPayment = await tx.payment.create({
          data: {
            amount: totalAmount,
            currency: "ARS",
            status: "PENDING",
            provider: PaymentProvider.MANUAL,
            paymentType: PaymentType.NUMBER_PURCHASE,
            raffleId,
            payerName: resolvedName,
            payerEmail: resolvedEmail,
            payerPhone: payerPhone || null,
            comprobanteUrl,
            comprobantePublicId,
          },
        });

        await tx.soldNumber.updateMany({
          where: { id: { in: reservedNumbers.map((n) => n.id) } },
          data: {
            paymentId: newPayment.id,
            status: ReservationStatus.RESERVED_WITH_COMPROBANT,
            reservedUntil: null,
          },
        });
      });
    } catch (txError) {
      await deleteAsset(comprobantePublicId, isImage ? "image" : "raw").catch(() => {});
      throw txError;
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "";
    const raffleUrl = `${appUrl}/raffle/${raffleId}`;

    sendEmail({
      to: resolvedEmail,
      subject: `Comprobante recibido para "${raffle.title}"`,
      template: React.createElement(TransferReceivedEmail, {
        payerName: resolvedName,
        raffleTitle: raffle.title,
        numbers: reservedNumbers.map((n) => n.number),
        totalAmount,
        raffleUrl,
      }),
    }).catch((err) => console.error("[submitComprobante] Error enviando email:", err));

    return { ok: true };
  } catch (error) {
    console.error("[submitComprobante]", error);
    return { ok: false, error: "Ocurrió un error. Intentá de nuevo." };
  }
}
