import React from "react";

import { sendEmail } from "@/lib/email/send-email";
import NumberPurchasedEmail from "@/lib/email/templates/number-purchased.email";
import prisma from "@/lib/prisma";
import { APP_URL } from "@/lib/utils";

interface EmailSendNumberPurchasedParams {
  to: string;
  payerName: string;
  raffleId: string;
  numbers: number[];
  totalAmount: number;
}

export async function emailSendNumberPurchased({
  to,
  payerName,
  raffleId,
  numbers,
  totalAmount,
}: EmailSendNumberPurchasedParams): Promise<void> {
  const raffle = await prisma.raffle.findUnique({
    where: { id: raffleId },
    select: { title: true, drawDate: true },
  });

  if (!raffle) return;

  await sendEmail({
    to,
    subject: `Tus números para "${raffle.title}" están confirmados ✅`,
    template: React.createElement(NumberPurchasedEmail, {
      payerName,
      raffleTitle: raffle.title,
      numbers,
      totalAmount,
      raffleUrl: `${APP_URL}/raffle/${raffleId}`,
      drawDate: raffle.drawDate
        ? raffle.drawDate.toLocaleDateString("es-AR")
        : null,
    }),
  }).catch((err) =>
    console.error("[Email] Error enviando confirmación de compra:", err)
  );
}
