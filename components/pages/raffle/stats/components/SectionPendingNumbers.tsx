"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { SoldNumbersEntity } from "@/backend/context/sold-numbers/domain/entities/sold-numbers.entity";

import { apiClient } from "@/lib/api";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import ComprobantePreviewDialog, {
  ComprobantePaymentData,
} from "./ComprobantePreviewDialog";

interface SectionPendingNumbersProps {
  raffleId: string;
  pendingNumbers: SoldNumbersEntity[];
}

type GroupedPayment = ComprobantePaymentData & { paymentId: string };

function groupByPayment(soldNumbers: SoldNumbersEntity[]): GroupedPayment[] {
  const map = new Map<string, GroupedPayment>();

  for (const sn of soldNumbers) {
    if (!sn.payment?.id || !sn.payment.comprobanteUrl) continue;

    const key = sn.payment.id;
    if (!map.has(key)) {
      map.set(key, {
        paymentId: sn.payment.id,
        payerName: sn.payment.payerName ?? "—",
        payerEmail: sn.payment.payerEmail ?? "—",
        payerPhone: sn.payment.payerPhone ?? "—",
        numbers: [],
        comprobanteUrl: sn.payment.comprobanteUrl,
        totalAmount: sn.payment.amount,
      });
    }
    map.get(key)!.numbers.push(sn.number);
  }

  return Array.from(map.values()).sort((a, b) => a.numbers[0] - b.numbers[0]);
}

export default function SectionPendingNumbers({
  raffleId,
  pendingNumbers,
}: SectionPendingNumbersProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [selected, setSelected] = useState<GroupedPayment | null>(null);

  const groups = groupByPayment(pendingNumbers);

  const handleReview = async (action: "approve" | "deny") => {
    if (!selected) return;

    startTransition(async () => {
      try {
        await apiClient.post(`/api/raffle/${raffleId}/sold-numbers/review`, {
          paymentId: selected.paymentId,
          action,
        });

        toast.success(
          action === "approve"
            ? "Pago aprobado. Se notificó al comprador."
            : "Pago denegado. Los números fueron liberados."
        );
        setSelected(null);
        router.refresh();
      } catch (error: any) {
        toast.error(error?.message ?? "Error al procesar la acción");
      }
    });
  };

  if (groups.length === 0) return null;

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Comprobantes pendientes</CardTitle>
          <CardDescription>
            {groups.length} pago{groups.length !== 1 ? "s" : ""} esperando
            revisión
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Desktop */}
          <div className="hidden md:block">
            <Table>
              <TableHeader>
                <TableRow className="bg-card">
                  <TableHead>Números</TableHead>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Teléfono</TableHead>
                  <TableHead>Comprobante</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {groups.map((g) => (
                  <TableRow
                    key={g.paymentId}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => setSelected(g)}
                  >
                    <TableCell className="font-medium">
                      {g.numbers.map((n) => `#${n}`).join(", ")}
                    </TableCell>
                    <TableCell>{g.payerName}</TableCell>
                    <TableCell>{g.payerEmail}</TableCell>
                    <TableCell>{g.payerPhone}</TableCell>
                    <TableCell>
                      <span className="text-primary text-sm underline-offset-4 hover:underline">
                        Ver comprobante
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Mobile */}
          <div className="flex flex-col gap-3 md:hidden">
            {groups.map((g) => (
              <div
                key={g.paymentId}
                className="bg-muted/40 border-border flex flex-col gap-1 rounded-lg border p-4"
                onClick={() => setSelected(g)}
              >
                <p className="font-semibold">
                  {g.numbers.map((n) => `#${n}`).join(", ")}
                </p>
                <p className="text-muted-foreground text-sm">{g.payerName}</p>
                <p className="text-muted-foreground text-sm">{g.payerEmail}</p>
                <span className="text-primary mt-1 text-sm underline-offset-4 hover:underline">
                  Ver comprobante →
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <ComprobantePreviewDialog
        open={!!selected}
        onClose={() => setSelected(null)}
        payment={selected}
        onApprove={() => handleReview("approve")}
        onDeny={() => handleReview("deny")}
        isActionPending={isPending}
      />
    </>
  );
}
