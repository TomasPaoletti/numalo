import { RaffleStatus } from "@/app/generated/prisma/enums";

import SectionFilterRaffles from "@/components/pages/admin/components/SectionFilterRaffles";
import SectionRafflesItems from "@/components/pages/admin/components/SectionRafflesItems";

import GetRaffles from "@/services/raffle/get-raffles.service";

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

  const raffles = await GetRaffles(true, status);

  return (
    <div className="flex flex-col gap-6">
      <SectionFilterRaffles />
      <SectionRafflesItems raffles={raffles} />
    </div>
  );
}
