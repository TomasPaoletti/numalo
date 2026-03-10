"use client";

import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

import { deleteSessionId } from "@/lib/session";

import { DeleteReservationNumberBySession } from "@/components/pages/raffle/checkout/services/delete-reservation.service";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface CheckoutReturnDialogProps {
  open: boolean;
  handleReturnDialog: () => void;
}

const CheckoutReturnDialog = ({
  open,
  handleReturnDialog,
}: CheckoutReturnDialogProps) => {
  const router = useRouter();
  const { id } = useParams();
  const searchParams = useSearchParams();

  const [loading, setLoading] = useState(false);

  const sessionId = searchParams.get("session_id");

  const handleReturn = async () => {
    const raffleId = id as string;

    try {
      if (!sessionId) return;
      setLoading(true);
      await DeleteReservationNumberBySession(raffleId, sessionId);
      deleteSessionId();
      router.push(`/raffle/${id}/sold-number`);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleReturnDialog}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>¿Estas seguro de salir?</DialogTitle>
          <DialogDescription>
            Si vuelves, tus números volveran a estar disponibles para todos
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button disabled={loading} onClick={handleReturn}>
            Volver
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
export default CheckoutReturnDialog;
