"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

import { deleteSessionId } from "@/lib/session";

import { useReservationTimer } from "@/components/pages/raffle/checkout/hook/useReservationTimer";

import { DeleteReservationNumberBySession } from "@/components/pages/raffle/checkout/services/delete-reservation.service";

interface CheckoutHeaderProps {
  reservedUntil: string;
  raffleId: string;
}

const CheckoutHeader = ({ reservedUntil, raffleId }: CheckoutHeaderProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { formatted, isExpired } = useReservationTimer(reservedUntil);

  const sessionId = searchParams.get("session_id");

  const handleReturn = async () => {
    if (!sessionId) return;
    await DeleteReservationNumberBySession(raffleId, sessionId);
    deleteSessionId();
    router.push(`/raffle/${raffleId}/sold-number`);
  };
  useEffect(() => {
    if (isExpired) {
      handleReturn();
    }
  }, [isExpired]);

  return (
    <section id="section-checkout-header" className="flex flex-col">
      <h1 className="text-xl md:text-3xl">Completa tus datos</h1>
      <p className="md:text-lg">
        Estas a un paso de participar. Tus números están reservados por:{" "}
        <strong className="text-primary">{formatted}</strong>
      </p>
    </section>
  );
};

export default CheckoutHeader;
