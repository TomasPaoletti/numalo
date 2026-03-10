import GetActiveReservation from "@/components/pages/raffle/checkout/services/get-reservation.service";

import CheckoutForm from "@/components/pages/raffle/checkout/components/CheckoutForm";
import CheckoutHeader from "@/components/pages/raffle/checkout/components/CheckoutHeader";
import CheckoutRaffleExpiration from "@/components/pages/raffle/checkout/components/CheckoutRaffleExpiration";
import CheckoutSummary from "@/components/pages/raffle/checkout/components/CheckoutSummary";

export default async function RaffleIdCheckout({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { id } = await params;
  const { session_id } = await searchParams;

  if (!session_id) {
    return (
      <section className="pt-10 text-center md:pt-20">
        <h1 className="text-xl md:text-2xl">Reserva no encontrada</h1>
      </section>
    );
  }

  const raffleWithNumbers = await GetActiveReservation(
    id,
    session_id as string,
    true
  );

  if (!raffleWithNumbers) {
    return <CheckoutRaffleExpiration raffleId={id} />;
  }

  return (
    <div className="flex w-full flex-col gap-y-6 p-6 md:py-12">
      <CheckoutHeader
        reservedUntil={raffleWithNumbers.reservedUntil}
        raffleId={id}
      />
      <div className="flex flex-col gap-y-4">
        <CheckoutSummary
          numbers={raffleWithNumbers.numbers}
          finalPrice={raffleWithNumbers.finalPrice}
        />
        <CheckoutForm />
      </div>
    </div>
  );
}
