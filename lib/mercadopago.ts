import prisma from "@/lib/prisma";

export async function getValidMpAccessToken(
  companyId: string
): Promise<string> {
  const company = await prisma.company.findUnique({
    where: { id: companyId },
    select: {
      mpAccessToken: true,
      mpRefreshToken: true,
      mpTokenExpiresAt: true,
    },
  });

  if (!company?.mpAccessToken) {
    throw new Error("La compañía no tiene Mercado Pago conectado");
  }

  const isExpired =
    !company.mpTokenExpiresAt ||
    company.mpTokenExpiresAt.getTime() - Date.now() < 5 * 60 * 1000;

  if (!isExpired) {
    return company.mpAccessToken;
  }

  const response = await fetch("https://api.mercadopago.com/oauth/token", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      client_id: process.env.MERCADOPAGO_APP_NUMBER,
      client_secret: process.env.MERCADOPAGO_CLIENT_SECRET,
      grant_type: "refresh_token",
      refresh_token: company.mpRefreshToken,
    }),
  });

  if (!response.ok) {
    throw new Error("No se pudo renovar el token de Mercado Pago");
  }

  const { access_token, refresh_token, expires_in } = await response.json();

  await prisma.company.update({
    where: { id: companyId },
    data: {
      mpAccessToken: access_token,
      mpRefreshToken: refresh_token,
      mpTokenExpiresAt: new Date(Date.now() + expires_in * 1000),
    },
  });

  return access_token;
}
