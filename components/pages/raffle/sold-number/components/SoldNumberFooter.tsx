"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { getOrCreateSessionId } from "@/lib/session";

import { useSelectedNumbers } from "@/contexts/SelectedNumbersContext";

import CreateReservation from "@/components/pages/raffle/sold-number/services/create-reservation.service";

import { Button } from "@/components/ui/button";

interface SoldNumberFooterProps {
  raffleId: string;
}

const SoldNumberFooter = ({ raffleId }: SoldNumberFooterProps) => {
  const [loading, setLoading] = useState<boolean>(false);

  const { selectedNumbers, totalPrice, finalPrice, appliedDiscount } =
    useSelectedNumbers();

  const router = useRouter();

  const handleContinue = async () => {
    try {
      setLoading(true);
      toast.loading("Reservando números...");

      const sessionId = getOrCreateSessionId();

      await CreateReservation({
        raffleId,
        numbers: selectedNumbers,
        sessionId,
      });

      toast.dismiss();

      toast.success("Números reservados");

      router.push(`/raffle/${raffleId}/checkout?session_id=${sessionId}`);
    } catch (error: any) {
      toast.dismiss();
      toast.error(error.apiError?.message || "Error al reservar números");
    } finally {
      setLoading(false);
    }
  };

  if (selectedNumbers.length === 0) return null;

  return (
    <section
      id="sold-number-footer"
      className="bg-background fixed right-0 bottom-0 left-0 border-t px-4 py-2"
    >
      <div className="mx-auto flex items-center justify-between">
        <div>
          <p className="text-muted-foreground text-sm">
            {selectedNumbers.length} número
            {selectedNumbers.length > 1 ? "s" : ""} seleccionado
            {selectedNumbers.length > 1 ? "s" : ""}
          </p>

          {appliedDiscount ? (
            <>
              <p className="text-muted-foreground text-sm line-through">
                ${totalPrice.toFixed(2)}
              </p>
              <p className="text-primary text-lg font-semibold">
                ${finalPrice.toFixed(2)}
                <span className="ml-2 text-sm font-normal">
                  ({appliedDiscount.percentage}% off)
                </span>
              </p>
            </>
          ) : (
            <p className="text-lg font-semibold">
              Total: ${finalPrice.toFixed(2)}
            </p>
          )}
        </div>
        <Button size="lg" onClick={handleContinue} disabled={loading}>
          Continuar
        </Button>
      </div>
    </section>
  );
};

export default SoldNumberFooter;
