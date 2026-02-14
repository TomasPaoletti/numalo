import { GetSoldNumbersByRaffle } from "@/services/sold-number";

import { SelectedNumbersProvider } from "@/contexts/SelectedNumbersContext";

import SoldNumberFilter from "@/components/pages/raffle/sold-number/components/SoldNumberFilter";
import SoldNumberFooter from "@/components/pages/raffle/sold-number/components/SoldNumberFooter";
import SoldNumberHeader from "@/components/pages/raffle/sold-number/components/SoldNumberHeader";
import SoldNumberSelector from "@/components/pages/raffle/sold-number/components/SoldNumberSelector";

export default async function RaffleIdSoldNumbers({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const raffleWithNumbers = await GetSoldNumbersByRaffle(id, true);

  return (
    <SelectedNumbersProvider raffleWithNumbers={raffleWithNumbers}>
      <div className="flex w-full flex-col p-6 md:p-12">
        <SoldNumberHeader
          title={raffleWithNumbers.title}
          totalNumbers={raffleWithNumbers.totalNumbers}
          soldNumbers={raffleWithNumbers.soldNumbers}
        />
        <SoldNumberFilter />
        <SoldNumberSelector raffleWithNumbers={raffleWithNumbers} />
        <SoldNumberFooter />
      </div>
    </SelectedNumbersProvider>
  );
}
