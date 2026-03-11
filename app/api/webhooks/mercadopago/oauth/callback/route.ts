import { redirect } from "next/navigation";
import { NextRequest } from "next/server";

import prisma from "@/lib/prisma";

const APP_URL =
  process.env.NODE_ENV === "production"
    ? process.env.NEXT_PUBLIC_APP_URL
    : process.env.NGROK_URL;

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const code = searchParams.get("code");
  const companyId = searchParams.get("state");
  const error = searchParams.get("error");

  if (error || !code || !companyId) {
    redirect("/admin/settings/mp/cancelled");
  }

  const redirectUri = `${APP_URL}/api/webhooks/mercadopago/oauth/callback`;

  try {
    const response = await fetch("https://api.mercadopago.com/oauth/token", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        client_id: process.env.MERCADOPAGO_APP_NUMBER,
        client_secret: process.env.MERCADOPAGO_CLIENT_SECRET,
        code,
        grant_type: "authorization_code",
        redirect_uri: redirectUri,
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error("MP OAuth Error al obtener tokens:", errorBody);
      redirect("/admin/settings/mp/error");
    }

    const data = await response.json();

    const {
      access_token,
      refresh_token,
      expires_in,
      user_id,
    }: {
      access_token: string;
      refresh_token: string;
      expires_in: number;
      user_id: number;
    } = data;

    await prisma.company.update({
      where: { id: companyId },
      data: {
        mpAccessToken: access_token,
        mpRefreshToken: refresh_token,
        mpTokenExpiresAt: new Date(Date.now() + expires_in * 1000),
        mpUserId: String(user_id),
      },
    });
  } catch (err) {
    console.error("MP OAuth Error inesperado:", err);
    redirect("/admin/settings/mp/error");
  }

  redirect("/admin/settings/mp/success");
}
