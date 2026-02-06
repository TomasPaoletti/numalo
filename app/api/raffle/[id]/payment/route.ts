import { MercadoPagoConfig, Preference } from "mercadopago";
import { NextRequest, NextResponse } from "next/server";

import { PrismaRaffleRepository } from "@/backend/context/raffle/infrastructure/database/raffle.prisma-repository";

import { CustomError } from "@/backend/shared/errors";
import { requireAuth } from "@/backend/shared/guards/auth.guard";

const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN!,
});

const APP_URL =
  process.env.NODE_ENV === "production"
    ? process.env.NEXT_PUBLIC_APP_URL
    : process.env.NGROK_URL;

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId, companyId } = await requireAuth();
    const { id } = await params;

    if (!companyId) {
      return NextResponse.json(
        { error: "Debes tener una compañía asociada" },
        { status: 403 }
      );
    }

    const raffleRepository = new PrismaRaffleRepository();
    const raffle = await raffleRepository.findById(id);

    if (!raffle) {
      return NextResponse.json(
        { error: "Rifa no encontrada" },
        { status: 404 }
      );
    }

    if (raffle.companyId !== companyId) {
      return NextResponse.json(
        { error: "No tienes permiso para publicar esta rifa" },
        { status: 403 }
      );
    }

    if (raffle.status !== "DRAFT") {
      return NextResponse.json(
        { error: "La rifa ya está publicada" },
        { status: 400 }
      );
    }

    const totalRevenue = raffle.totalNumbers * Number(raffle.numberPrice);
    const platformFee = (totalRevenue * 2) / 100;

    const preference = new Preference(client);

    const result = await preference.create({
      body: {
        items: [
          {
            id: raffle.id,
            title: `Publicación de rifa: ${raffle.title}`,
            description: `Comisión por publicar rifa de ${raffle.totalNumbers} números`,
            unit_price: platformFee,
            quantity: 1,
            currency_id: "ARS",
          },
        ],
        back_urls: {
          success: `${APP_URL}/admin/payment/success`,
          failure: `${APP_URL}/admin/payment/failure`,
          pending: `${APP_URL}/admin/payment/pending`,
        },
        auto_return: "approved",
        external_reference: raffle.id,
        notification_url: `${APP_URL}/api/webhooks/mercadopago`,
        metadata: {
          raffle_id: raffle.id,
          company_id: companyId,
          user_id: userId,
        },
      },
    });

    return NextResponse.json({
      preferenceId: result.id,
      initPoint: result.init_point,
    });
  } catch (error) {
    if (error instanceof CustomError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.statusCode }
      );
    }

    return NextResponse.json(
      { error: "Error al procesar el pago" },
      { status: 500 }
    );
  }
}
