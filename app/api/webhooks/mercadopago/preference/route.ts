import { NextRequest, NextResponse } from "next/server";

import {
  PaymentStatus,
  PaymentType,
  ReservationStatus,
} from "@/app/generated/prisma/enums";

import { getValidMpAccessToken } from "@/lib/mercadopago";
import prisma from "@/lib/prisma";
import { APP_URL } from "@/lib/utils";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      raffleId,
      numbers,
      finalPrice,
      payerName,
      payerEmail,
      payerPhone,
      payerInstagram,
    }: {
      raffleId: string;
      numbers: number[];
      finalPrice: number;
      payerName: string;
      payerEmail: string;
      payerPhone: string;
      payerInstagram?: string;
    } = body;

    if (
      !raffleId ||
      !numbers?.length ||
      !finalPrice ||
      !payerName ||
      !payerEmail ||
      !payerPhone
    ) {
      return NextResponse.json(
        { error: "Faltan parámetros requeridos" },
        { status: 400 }
      );
    }

    const raffle = await prisma.raffle.findUnique({
      where: { id: raffleId },
      include: { company: true },
    });

    if (!raffle) {
      return NextResponse.json(
        { error: "Rifa no encontrada" },
        { status: 404 }
      );
    }

    if (!raffle.company.mpAccessToken) {
      return NextResponse.json(
        { error: "El rifador no tiene Mercado Pago conectado" },
        { status: 400 }
      );
    }

    const accessToken = await getValidMpAccessToken(raffle.companyId);

    const payment = await prisma.$transaction(async (tx) => {
      const newPayment = await tx.payment.create({
        data: {
          amount: finalPrice,
          currency: "ARS",
          status: PaymentStatus.PENDING,
          paymentType: PaymentType.NUMBER_PURCHASE,
          raffleId,
          payerName,
          payerEmail,
          payerPhone,
          payerInstagram,
        },
      });

      await tx.soldNumber.updateMany({
        where: {
          raffleId,
          number: { in: numbers },
          status: ReservationStatus.RESERVED,
        },
        data: {
          paymentId: newPayment.id,
        },
      });

      return newPayment;
    });

    const preferenceResponse = await fetch(
      "https://api.mercadopago.com/checkout/preferences",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items: [
            {
              id: raffleId,
              title: `Números de rifa: ${numbers.join(", ")}`,
              quantity: 1,
              unit_price: finalPrice,
              currency_id: "ARS",
            },
          ],
          payer: {
            name: payerName,
            email: payerEmail,
            phone: { number: payerPhone },
          },
          external_reference: payment.id,
          notification_url: `${APP_URL}/api/webhooks/mercadopago`,
          back_urls: {
            success: `${APP_URL}/raffle/${raffleId}?payment=success`,
            failure: `${APP_URL}/raffle/${raffleId}?payment=failure`,
            pending: `${APP_URL}/raffle/${raffleId}?payment=pending`,
          },
          auto_return: "approved",
        }),
      }
    );

    if (!preferenceResponse.ok) {
      const errorBody = await preferenceResponse.text();
      console.error("[MP Preference] Error:", errorBody);
      return NextResponse.json(
        { error: "Error al crear la preferencia de pago" },
        { status: 500 }
      );
    }

    const preference = await preferenceResponse.json();

    return NextResponse.json({
      initPoint: preference.init_point,
      paymentId: payment.id,
    });
  } catch (error: any) {
    console.error("[MP Preference] Error inesperado:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
