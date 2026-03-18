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
      <h1>Numeros vendidos</h1>
    </div>
  );
}
