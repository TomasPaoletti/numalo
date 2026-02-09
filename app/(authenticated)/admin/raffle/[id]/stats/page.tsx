import SectionRaffleDetails from "@/components/pages/raffle/stats/components/SectionRaffleDetails";
import SectionRaffleStats from "@/components/pages/raffle/stats/components/SectionRaffleStats";

import { GetRaffleStatsById } from "@/services/raffle";

export default async function RaffleIdStatsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const raffle = await GetRaffleStatsById(id, true);

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold md:text-4xl">{raffle.title}</h1>
      <SectionRaffleStats
        stats={raffle.stats}
        winner={raffle.winnerName}
        totalNumbers={raffle.totalNumbers}
      />
      <SectionRaffleDetails raffle={raffle} />
    </div>
  );
}
