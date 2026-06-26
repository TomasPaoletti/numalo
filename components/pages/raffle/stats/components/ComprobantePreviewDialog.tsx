"use client";

import dynamic from "next/dynamic";
import { ExternalLink, CheckCircle, XCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const PdfViewer = dynamic(() => import("@/components/ui/pdf-viewer"), {
  ssr: false,
  loading: () => (
    <div className="bg-muted flex h-40 items-center justify-center text-sm text-muted-foreground">
      Cargando PDF…
    </div>
  ),
});

export interface ComprobantePaymentData {
  payerName: string;
  payerEmail: string;
  payerPhone?: string | null;
  totalAmount: number;
  comprobanteUrl: string;
  numbers: number[];
}

interface ComprobantePreviewDialogProps {
  open: boolean;
  onClose: () => void;
  payment: ComprobantePaymentData | null;
  onApprove?: () => void;
  onDeny?: () => void;
  isActionPending?: boolean;
}

export default function ComprobantePreviewDialog({
  open,
  onClose,
  payment,
  onApprove,
  onDeny,
  isActionPending,
}: ComprobantePreviewDialogProps) {
  const proxyUrl = payment
    ? `/api/proxy/comprobante?url=${encodeURIComponent(payment.comprobanteUrl)}`
    : "";

  return (
    <Dialog open={open} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Comprobante</DialogTitle>
          <DialogDescription>
            {payment && (
              <>
                <strong>{payment.payerName}</strong> —{" "}
                {payment.numbers.map((n) => `#${n}`).join(", ")}
              </>
            )}
          </DialogDescription>
        </DialogHeader>

        {payment && (
          <div className="flex flex-col gap-4">
            <div className="bg-muted flex flex-col gap-1 rounded-lg p-3 text-sm">
              <p>
                <span className="text-muted-foreground">Email:</span>{" "}
                {payment.payerEmail}
              </p>
              {payment.payerPhone && payment.payerPhone !== "—" && (
                <p>
                  <span className="text-muted-foreground">Teléfono:</span>{" "}
                  {payment.payerPhone}
                </p>
              )}
              <p>
                <span className="text-muted-foreground">Total:</span> $
                {Number(payment.totalAmount).toLocaleString("es-AR")} ARS
              </p>
            </div>

            <div className="border-border overflow-hidden rounded-lg border">
              {payment.comprobanteUrl.includes("/image/upload/") ? (
                <img
                  src={payment.comprobanteUrl}
                  alt="Comprobante"
                  className="max-h-80 w-full object-contain"
                />
              ) : (
                <PdfViewer url={proxyUrl} />
              )}
            </div>

            <a
              href={proxyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground flex items-center gap-1 text-xs transition-colors"
            >
              <ExternalLink size={12} />
              Abrir en nueva pestaña
            </a>
          </div>
        )}

        {(onApprove || onDeny) && (
          <DialogFooter className="gap-1">
            {onDeny && (
              <Button
                variant="destructive"
                disabled={isActionPending}
                onClick={onDeny}
              >
                <XCircle size={16} />
                Denegar
              </Button>
            )}
            {onApprove && (
              <Button disabled={isActionPending} onClick={onApprove}>
                <CheckCircle size={16} />
                Aprobar
              </Button>
            )}
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}
