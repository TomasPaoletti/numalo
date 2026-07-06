"use client";

import { Clock, RotateCcw, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { ActiveReservation } from "@/backend/context/sold-numbers/application/dto";
import GetActiveReservation from "@/components/pages/raffle/checkout/services/get-reservation.service";
import { useReservationTimer } from "@/components/pages/raffle/pagar/hooks/useReservationTimer";
import DeleteReservation from "@/components/pages/raffle/sold-number/services/delete-reservation.service";
import { getOrCreateSessionId } from "@/lib/session";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ReservationRecoveryModalProps {
  raffleId: string;
}

export default function ReservationRecoveryModal({
  raffleId,
}: ReservationRecoveryModalProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [reservation, setReservation] = useState<ActiveReservation | null>(
    null
  );
  const [sessionId, setSessionId] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const sid = getOrCreateSessionId();
    setSessionId(sid);

    GetActiveReservation(raffleId, sid, false)
      .then((res) => {
        if (res && res.numbers.length > 0) {
          setReservation(res);
          setOpen(true);
        }
      })
      .catch(() => {});
  }, [raffleId]);

  const { formatted, isExpired } = useReservationTimer(
    reservation?.reservedUntil ?? ""
  );

  useEffect(() => {
    if (reservation && isExpired) setOpen(false);
  }, [reservation, isExpired]);

  const handleRecover = () => {
    router.push(`/raffle/${raffleId}/pagar?session_id=${sessionId}`);
  };

  const handleCancel = async () => {
    setLoading(true);
    try {
      await DeleteReservation(raffleId, sessionId);
      setOpen(false);
      setReservation(null);
    } catch {
      toast.error("No se pudo cancelar la reserva");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>Tenés una reserva activa</DialogTitle>
          <DialogDescription>
            Tenés{" "}
            <span className="text-foreground font-medium">
              {reservation?.numbers.length} número
              {reservation?.numbers.length !== 1 ? "s" : ""}
            </span>{" "}
            reservados:{" "}
            <span className="text-foreground font-medium">
              {reservation?.numbers.join(", ")}
            </span>
            . ¿Querés continuar con el pago o cancelar la reserva?
          </DialogDescription>
        </DialogHeader>

        {reservation && (
          <>
            <div className="text-muted-foreground flex items-center gap-1.5 text-sm">
              <Clock size={14} />
              <span>Tiempo restante: {formatted}</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {reservation.numbers.map((n) => (
                <span
                  key={n}
                  className="bg-primary text-primary-foreground flex size-8 items-center justify-center rounded-full text-xs font-medium"
                >
                  {n}
                </span>
              ))}
            </div>
          </>
        )}

        <DialogFooter className="flex-col gap-2 sm:flex-row">
          <Button variant="outline" onClick={handleCancel} disabled={loading}>
            <Trash2 size={15} />
            Cancelar reserva
          </Button>
          <Button onClick={handleRecover}>
            <RotateCcw size={15} />
            Recuperar reserva
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
