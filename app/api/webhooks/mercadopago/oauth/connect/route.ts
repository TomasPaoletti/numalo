import { redirect } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";

import { requireAuth } from "@/backend/shared/guards/auth.guard";

const APP_URL =
  process.env.NODE_ENV === "production"
    ? process.env.NEXT_PUBLIC_APP_URL
    : process.env.NGROK_URL;

export async function GET(req: NextRequest) {
  const { companyId } = await requireAuth();

  if (!companyId) {
    return NextResponse.json(
      { error: "Debes tener una compañía asociada" },
      { status: 403 }
    );
  }

  const appId = process.env.MERCADOPAGO_APP_NUMBER;
  const redirectUri = `${APP_URL}/api/webhooks/mercadopago/oauth/callback`;

  if (!appId) {
    return new Response("Mercado Pago is not configured", { status: 500 });
  }

  const url = new URL("https://auth.mercadopago.com/authorization");
  url.searchParams.set("client_id", appId);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("platform_id", "mp");
  url.searchParams.set("redirect_uri", redirectUri);
  url.searchParams.set("state", companyId);

  redirect(url.toString());
}
