import SectionAssignQuinielaWinner from "@/components/pages/raffle/stats/components/SectionAssignQuinielaWinner";
import SectionPendingNumbers from "@/components/pages/raffle/stats/components/SectionPendingNumbers";
import SectionRaffleDetails from "@/components/pages/raffle/stats/components/SectionRaffleDetails";
import SectionRaffleStats from "@/components/pages/raffle/stats/components/SectionRaffleStats";

import { GetRaffleStatsById } from "@/services/raffle";
import { GetPendingNumbersWithPayment } from "@/services/sold-number";

export default async function RaffleIdStatsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [raffle, pendingNumbers] = await Promise.all([
    GetRaffleStatsById(id, true),
    GetPendingNumbersWithPayment(id, true),
  ]);

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold md:text-4xl">{raffle.title}</h1>
      <SectionPendingNumbers raffleId={id} pendingNumbers={pendingNumbers} />
      <SectionAssignQuinielaWinner raffle={raffle} />
      <SectionRaffleStats
        stats={raffle.stats}
        winners={raffle.winners ?? []}
        totalNumbers={raffle.totalNumbers}
      />
      <SectionRaffleDetails raffle={raffle} />
    </div>
  );
}
