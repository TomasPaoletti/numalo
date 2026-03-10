"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { deleteSessionId } from "@/lib/session";

const CheckoutRaffleExpiration = ({ raffleId }: { raffleId: string }) => {
  const router = useRouter();
  const [timeLeft, setTimeLeft] = useState(5);

  useEffect(() => {
    deleteSessionId();

    const interval = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (timeLeft <= 0) {
      router.push(`/raffle/${raffleId}`);
    }
  }, [timeLeft, router, raffleId]);

  return (
    <section className="mx-auto flex w-full flex-col items-center gap-y-6 pt-10 md:pt-20">
      <h1 className="text-xl md:text-2xl">Reserva expirada</h1>
      <p>Seras redirigido a la rifa en: {timeLeft}</p>
    </section>
  );
};

export default CheckoutRaffleExpiration;
