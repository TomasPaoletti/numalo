import { redirect } from "next/navigation";

import { GetRaffleStatsById } from "@/services/raffle";
import { GetSoldNumbersWithPayment } from "@/services/sold-number";

import { RaffleStatus } from "@/app/generated/prisma/enums";

import SoldNumbersCards from "@/components/pages/raffle/sold-numbers/components/SoldNumbersCards";
import SoldNumbersTable from "@/components/pages/raffle/sold-numbers/components/SoldNumbersTable";
import SoldNumbersWinnerData from "@/components/pages/raffle/sold-numbers/components/SoldNumbersWinnerData";

export default async function RaffleIdSoldNumbers({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [soldNumbers, raffle] = await Promise.all([
    GetSoldNumbersWithPayment(id, true),
    GetRaffleStatsById(id, true),
  ]);

  if (soldNumbers.length === 0) {
    redirect("/admin");
  }

  const winnerNumbers = raffle.winners?.map((w) => w.number) ?? [];

  const sortedNumbers = soldNumbers.sort((a, b) => {
    const aIsWinner = winnerNumbers.includes(a.number);
    const bIsWinner = winnerNumbers.includes(b.number);
    if (aIsWinner && !bIsWinner) return -1;
    if (!aIsWinner && bIsWinner) return 1;
    return a.number - b.number;
  });

  return (
    <div className="flex flex-col gap-6">
      <h1 className="line-clamp-1 text-2xl font-semibold break-all md:text-4xl">
        Números vendidos de {raffle.title}
      </h1>
      {raffle.status === RaffleStatus.FINISHED && raffle.winners && (
        <SoldNumbersWinnerData winners={raffle.winners} />
      )}
      <SoldNumbersTable
        soldNumbers={sortedNumbers}
        winnerNumbers={winnerNumbers}
      />
      <SoldNumbersCards
        soldNumbers={sortedNumbers}
        winnerNumbers={winnerNumbers}
      />
    </div>
  );
}
