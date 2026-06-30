import { RaffleStatus } from "@/app/generated/prisma/enums";

import SectionFilterRaffles from "@/components/pages/admin/components/SectionFilterRaffles";
import SectionRafflesItems from "@/components/pages/admin/components/SectionRafflesItems";

import { GetRaffles } from "@/services/raffle";

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const params = await searchParams;

  const status =
    params.status &&
    Object.values(RaffleStatus).includes(params.status as RaffleStatus)
      ? (params.status as RaffleStatus)
      : undefined;

  const raffles = await GetRaffles(true, status).catch((error) => {
    if (error?.apiError?.statusCode === 403) return [];
    throw error;
  });

  const sorted = [...raffles].sort((a, b) => {
    const aNeedsWinner =
      a.status === RaffleStatus.FINISHED && !a.winners?.length;
    const bNeedsWinner =
      b.status === RaffleStatus.FINISHED && !b.winners?.length;
    if (aNeedsWinner && !bNeedsWinner) return -1;
    if (!aNeedsWinner && bNeedsWinner) return 1;
    return 0;
  });

  return (
    <div className="flex flex-col gap-6">
      <SectionFilterRaffles />
      <SectionRafflesItems raffles={sorted} />
    </div>
  );
}
