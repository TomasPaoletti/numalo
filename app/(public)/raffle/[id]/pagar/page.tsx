import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";

import { RaffleStatus } from "@/app/generated/prisma/enums";

import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

import GetActiveReservation from "@/components/pages/raffle/checkout/services/get-reservation.service";
import PagarClient from "@/components/pages/raffle/pagar/PagarClient";

export default async function PagarPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { id } = await params;
  const { session_id } = await searchParams;

  if (!session_id || typeof session_id !== "string") {
    redirect(`/raffle/${id}/sold-number`);
  }

  const [raffle, reservation, session] = await Promise.all([
    prisma.raffle.findUnique({
      where: { id, status: RaffleStatus.ACTIVE },
      select: {
        id: true,
        title: true,
        numberPrice: true,
        company: {
          select: {
            titular: true,
            alias: true,
            cbu: true,
            cuit: true,
            banco: true,
          },
        },
      },
    }),
    GetActiveReservation(id, session_id, true),
    getServerSession(authOptions),
  ]);

  if (!raffle) {
    redirect("/");
  }

  if (!reservation) {
    redirect(`/raffle/${id}/sold-number`);
  }

  return (
    <PagarClient
      raffleId={id}
      bankInfo={{
        titular: raffle.company.titular,
        alias: raffle.company.alias,
        cbu: raffle.company.cbu,
        cuit: raffle.company.cuit,
        banco: raffle.company.banco,
      }}
      numbers={reservation.numbers}
      finalPrice={reservation.finalPrice}
      sessionId={session_id}
      reservedUntil={String(reservation.reservedUntil)}
      defaultEmail={session?.user?.email ?? ""}
      defaultName={session?.user?.name ?? ""}
    />
  );
}
