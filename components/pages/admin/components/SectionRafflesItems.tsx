"use client";

import { TriangleAlert } from "lucide-react";

import { RaffleStatus } from "@/app/generated/prisma/enums";
import { RaffleEntity } from "@/backend/context/raffle/domain/entities/raffle.entity";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import ItemRaffles from "@/components/pages/admin/components/ItemRaffles";
import SectionEmptyStateAdmin from "@/components/pages/admin/components/SectionEmptyStateAdmin";

interface SectionRafflesItemsProps {
  raffles: RaffleEntity[];
}

const SectionRafflesItems = ({ raffles }: SectionRafflesItemsProps) => {
  const pendingWinnerCount = raffles.filter(
    (r) => r.status === RaffleStatus.FINISHED && !(r.winners?.length)
  ).length;

  return (
    <section id="section-raffles-items" className="flex flex-col gap-4">
      {pendingWinnerCount > 0 && (
        <Alert className="border-amber-300 bg-amber-50 text-amber-900 dark:border-amber-700 dark:bg-amber-950/30 dark:text-amber-100 [&>svg]:text-amber-600 dark:[&>svg]:text-amber-400">
          <TriangleAlert />
          <AlertTitle>
            {pendingWinnerCount === 1
              ? "Tenés 1 rifa finalizada sin ganador asignado"
              : `Tenés ${pendingWinnerCount} rifas finalizadas sin ganador asignado`}
          </AlertTitle>
          <AlertDescription>
            Ingresá a las rifas marcadas para asignar el número ganador.
          </AlertDescription>
        </Alert>
      )}
      {raffles.length === 0 ? (
        <SectionEmptyStateAdmin />
      ) : (
        <ItemRaffles raffles={raffles} />
      )}
    </section>
  );
};
export default SectionRafflesItems;
