import SoldNumbersTable from "@/components/pages/raffle/sold-numbers/components/SoldNumbersTable";
import { GetSoldNumbersWithPayment } from "@/services/sold-number";

export default async function RaffleIdSoldNumbers({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const soldNumbers = await GetSoldNumbersWithPayment(id, true);

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold md:text-4xl">Números vendidos</h1>
      <SoldNumbersTable soldNumbers={soldNumbers} />
    </div>
  );
}
