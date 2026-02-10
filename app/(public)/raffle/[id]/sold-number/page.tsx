export default async function RaffleIdSoldNumbers({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  //   const raffle = await GetRaffleByIdPublic(id, true);

  console.log(id);

  return <p>numeros</p>;
}
