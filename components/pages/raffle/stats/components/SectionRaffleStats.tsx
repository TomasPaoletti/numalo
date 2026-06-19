"use client";

import { ChevronRight } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

import { RaffleStats } from "@/backend/context/raffle/application/dto";

import { cn, formatPrice } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from "@/components/ui/item";

interface SectionRaffleStatsProps {
  stats: RaffleStats;
  winners: { name?: string | null; number: number }[];
  totalNumbers: number;
}

const SectionRaffleStats = ({
  stats,
  winners,
  totalNumbers,
}: SectionRaffleStatsProps) => {
  const winner =
    winners.length > 0
      ? winners.map((w) => w.name ?? `Número ${w.number}`).join(", ")
      : null;
  const { id } = useParams();
  const router = useRouter();

  const { moneyCollected, numbersSold } = stats;

  const hasNumbers = numbersSold > 0;
  const hasMoney = moneyCollected > 0;

  const handleNavigateToSoldNumbers = () => {
    if (!hasNumbers || !hasMoney) return;
    router.push(`/admin/raffle/${id}/sold-numbers`);
  };

  const handleNavigateToWinner = () => {
    if (!winner) return;
    router.push(`/admin/raffle/${id}/sold-numbers`);
  };

  return (
    <section
      id="section-raffle-stats"
      className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-6"
    >
      <Item
        variant="muted"
        className={cn("col-span-1", hasNumbers && "cursor-pointer")}
        onClick={handleNavigateToSoldNumbers}
      >
        <ItemContent>
          <ItemTitle>Números vendidos</ItemTitle>
        </ItemContent>
        <ItemActions>
          <Button size="sm" variant="outline" disabled={!hasNumbers}>
            {numbersSold}/{totalNumbers}
            <ChevronRight />
          </Button>
        </ItemActions>
      </Item>

      <Item variant="muted" className="col-span-1">
        <ItemContent>
          <ItemTitle>Dinero recaudado</ItemTitle>
        </ItemContent>
        <ItemContent className="flex-none text-center">
          <ItemDescription className="bg-card rounded-sm px-2 py-1">
            {formatPrice(moneyCollected)}
          </ItemDescription>
        </ItemContent>
      </Item>

      <Item
        variant="muted"
        className={cn("col-span-1", winner && "cursor-pointer")}
        onClick={handleNavigateToWinner}
      >
        <ItemContent>
          <ItemTitle>Ganador</ItemTitle>
        </ItemContent>
        <ItemActions>
          <Button size="sm" variant="outline" disabled={!winner}>
            {winner ? winner : "No sorteado"}
            <ChevronRight />
          </Button>
        </ItemActions>
      </Item>
    </section>
  );
};
export default SectionRaffleStats;
