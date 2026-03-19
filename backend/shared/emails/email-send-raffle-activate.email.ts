import React from "react";

import { sendEmail } from "@/lib/email/send-email";
import RaffleActivatedEmail from "@/lib/email/templates/raffle-activated.email";
import prisma from "@/lib/prisma";
import { APP_URL } from "@/lib/utils";

export async function emailSendRaffleActivate(raffleId: string): Promise<void> {
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

  if (!raffle) return;

  await sendEmail({
    to: raffle.company.users[0].email,
    subject: `Tu rifa "${raffle.title}" ya está activa 🎉`,
    template: React.createElement(RaffleActivatedEmail, {
      companyName: raffle.company.name,
      raffleTitle: raffle.title,
      raffleUrl: `${APP_URL}/admin/raffle/${raffleId}/stast`,
      totalNumbers: raffle.totalNumbers,
      numberPrice: Number(raffle.numberPrice),
    }),
  }).catch((err) =>
    console.error("[Email] Error enviando email de activación:", err)
  );
}
