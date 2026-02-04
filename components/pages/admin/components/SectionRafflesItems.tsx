"use client";

import { RaffleEntity } from "@/backend/context/raffle/domain/entities/raffle.entity";

import ItemRaffles from "@/components/pages/admin/components/ItemRaffles";
import SectionEmptyStateAdmin from "@/components/pages/admin/components/SectionEmptyStateAdmin";

interface SectionRafflesItemsProps {
  raffles: RaffleEntity[];
}

const SectionRafflesItems = ({ raffles }: SectionRafflesItemsProps) => {
  return (
    <section id="section-raffles-items">
      {raffles.length === 0 ? (
        <SectionEmptyStateAdmin />
      ) : (
        <ItemRaffles raffles={raffles} />
      )}
    </section>
  );
};
export default SectionRafflesItems;
