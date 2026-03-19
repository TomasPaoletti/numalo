import React from "react";

import { Company } from "@/backend/context/company/domain/entities/company.entity";
import { RaffleEntity } from "@/backend/context/raffle/domain/entities/raffle.entity";

import { sendEmail } from "@/lib/email/send-email";
import RaffleCompletedEmail from "@/lib/email/templates/raffle-completed.email";
import { APP_URL } from "@/lib/utils";

interface EmailSendRaffleCompletedParams {
  company: Company;
  raffle: RaffleEntity;
}

export async function emailSendRaffleCompleted({
  company,
  raffle,
}: EmailSendRaffleCompletedParams): Promise<void> {
  const ownerEmail = company.users && company.users[0]?.email;

  if (!ownerEmail) return;

  const totalRecaudado = raffle.totalNumbers * Number(raffle.numberPrice);

  await sendEmail({
    to: ownerEmail,
    subject: `¡Tu rifa "${raffle.title}" se ha cerrado! 🎉`,
    template: React.createElement(RaffleCompletedEmail, {
      companyName: company.name,
      raffleTitle: raffle.title,
      totalNumbers: raffle.totalNumbers,
      totalRecaudado,
      raffleUrl: `${APP_URL}/admin/raffle/${raffle.id}/stats`,
    }),
  }).catch((err) =>
    console.error("[Email] Error enviando email de rifa completada:", err)
  );
}
