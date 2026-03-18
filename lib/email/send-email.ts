import { ReactElement } from "react";

import resend from "@/lib/email/resend";

interface SendEmailParams {
  to: string | string[];
  subject: string;
  template: ReactElement;
}

export async function sendEmail({ to, subject, template }: SendEmailParams) {
  const from = process.env.RESEND_FROM_EMAIL ?? "onboarding@resend.dev";

  const { data, error } = await resend.emails.send({
    from,
    to,
    subject,
    react: template,
  });

  if (error) {
    console.error("[Resend] Error enviando email:", error);
    throw new Error(`Error enviando email: ${error.message}`);
  }

  return data;
}
