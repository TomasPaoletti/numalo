import React from "react";

import { sendEmail } from "@/lib/email/send-email";
import WelcomeEmail from "@/lib/email/templates/welcome-email";

interface emailSendWelcome {
  email: string;
  firstName: string;
  lastName: string;
}

export async function emailSendWelcome({
  email,
  firstName,
  lastName,
}: emailSendWelcome): Promise<void> {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "";

  await sendEmail({
    to: email,
    subject: `Bienvenido a Numeralo ${firstName} 🎉`,
    template: React.createElement(WelcomeEmail, {
      firstName,
      lastName,
      appUrl,
    }),
  }).catch((err) =>
    console.error("[Email] Error enviando email de activación:", err)
  );
}
