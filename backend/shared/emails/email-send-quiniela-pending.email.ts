import React from "react";

import { Company } from "@/backend/context/company/domain/entities/company.entity";
import { RaffleEntity } from "@/backend/context/raffle/domain/entities/raffle.entity";

import { sendEmail } from "@/lib/email/send-email";
import QuinielaPendingWinnerEmail from "@/lib/email/templates/quiniela-pending-winner.email";
import { APP_URL } from "@/lib/utils";

interface EmailSendQuinielaPendingParams {
  company: Company;
  raffle: RaffleEntity;
}

export async function emailSendQuinielaPending({
  company,
  raffle,
}: EmailSendQuinielaPendingParams): Promise<void> {
  const ownerEmail = company.users && company.users[0]?.email;

  if (!ownerEmail) return;

  await sendEmail({
    to: ownerEmail,
    subject: `Rifa "${raffle.title}" cerrada — ingresá el número de quiniela`,
    template: React.createElement(QuinielaPendingWinnerEmail, {
      companyName: company.name,
      raffleTitle: raffle.title,
      statsUrl: `${APP_URL}/admin/raffle/${raffle.id}/stats`,
    }),
  }).catch((err) =>
    console.error("[Email] Error enviando email de quiniela pendiente:", err)
  );
}
