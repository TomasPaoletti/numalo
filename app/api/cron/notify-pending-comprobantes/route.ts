import React from "react";
import { NextRequest, NextResponse } from "next/server";

import { ReservationStatus } from "@/app/generated/prisma/enums";

import prisma from "@/lib/prisma";
import { sendEmail } from "@/lib/email/send-email";
import PendingComprobantesEmail from "@/lib/email/templates/pending-comprobantes.email";
import { APP_URL } from "@/lib/utils";

export async function POST(req: NextRequest) {
  const secret = req.headers.get("x-cron-secret");

  if (secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const raffles = await prisma.raffle.findMany({
      where: {
        soldNumbers: {
          some: { status: ReservationStatus.RESERVED_WITH_COMPROBANT },
        },
      },
      select: {
        id: true,
        title: true,
        company: {
          select: {
            name: true,
            users: { select: { email: true }, take: 1 },
          },
        },
        _count: {
          select: {
            soldNumbers: {
              where: { status: ReservationStatus.RESERVED_WITH_COMPROBANT },
            },
          },
        },
      },
    });

    if (raffles.length === 0) {
      return NextResponse.json({ notified: 0 });
    }

    // Group raffles by company email
    const byEmail = new Map<
      string,
      {
        companyName: string;
        raffles: { title: string; pendingCount: number; statsUrl: string }[];
      }
    >();

    for (const raffle of raffles) {
      const ownerEmail = raffle.company.users[0]?.email;
      if (!ownerEmail) continue;

      if (!byEmail.has(ownerEmail)) {
        byEmail.set(ownerEmail, {
          companyName: raffle.company.name,
          raffles: [],
        });
      }

      byEmail.get(ownerEmail)!.raffles.push({
        title: raffle.title,
        pendingCount: raffle._count.soldNumbers,
        statsUrl: `${APP_URL}/admin/raffle/${raffle.id}/stats`,
      });
    }

    const results = await Promise.allSettled(
      Array.from(byEmail.entries()).map(([email, data]) =>
        sendEmail({
          to: email,
          subject: `Tenés pagos pendientes de revisión en Numeralo`,
          template: React.createElement(PendingComprobantesEmail, {
            companyName: data.companyName,
            raffles: data.raffles,
          }),
        })
      )
    );

    const failed = results.filter((r) => r.status === "rejected");
    if (failed.length > 0) {
      console.error(
        `[Cron] ${failed.length} email(s) fallaron:`,
        failed.map((r) => (r as PromiseRejectedResult).reason)
      );
    }

    return NextResponse.json({
      notified: byEmail.size - failed.length,
      failed: failed.length,
    });
  } catch (error) {
    console.error("[Cron] Error inesperado:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
