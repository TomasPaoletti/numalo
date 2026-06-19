"use client";

import { useEffect, useRef, useState } from "react";
import { CircleCheckBig, XCircle } from "lucide-react";
import { useRouter } from "next/navigation";

import { submitComprobante } from "@/app/actions/transfer";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Spinner } from "@/components/ui/spinner";

type Phase = "processing" | "done" | "error";

const STEPS = [
  "Recibimos tu comprobante de transferencia.",
  "El creador de la rifa verifica el pago.",
  "Te confirmamos tus números por email.",
];

const COUNTDOWN = 6;

interface ComprobanteModalProps {
  open: boolean;
  onClose: () => void;
  formData: FormData | null;
}

export default function ComprobanteModal({
  open,
  onClose,
  formData,
}: ComprobanteModalProps) {
  const [phase, setPhase] = useState<Phase>("processing");
  const [activeStep, setActiveStep] = useState(0);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(COUNTDOWN);
  const router = useRouter();
  const submitted = useRef(false);

  useEffect(() => {
    if (!open || !formData || submitted.current) return;

    submitted.current = true;

    const stepInterval = setInterval(() => {
      setActiveStep((s) => Math.min(s + 1, STEPS.length - 1));
    }, 1000);

    submitComprobante(formData).then((result) => {
      clearInterval(stepInterval);
      setActiveStep(STEPS.length - 1);

      if (result.ok) {
        setPhase("done");
      } else {
        setPhase("error");
        setErrorMsg(result.error ?? "Ocurrió un error.");
      }
    });

    return () => clearInterval(stepInterval);
  }, [open, formData]);

  useEffect(() => {
    if (phase !== "done") return;

    const timer = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) {
          clearInterval(timer);
          router.push("/");
          return 0;
        }
        return c - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [phase, router]);

  const handleClose = () => {
    if (phase === "processing") return;
    submitted.current = false;
    setPhase("processing");
    setActiveStep(0);
    setErrorMsg(null);
    setCountdown(COUNTDOWN);
    onClose();
  };

  const circumference = 2 * Math.PI * 20;
  const progress = ((COUNTDOWN - countdown) / COUNTDOWN) * circumference;

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) handleClose();
      }}
    >
      <DialogContent
        showCloseButton={phase !== "processing"}
        className="max-w-sm text-center"
        onInteractOutside={(e) => {
          if (phase === "processing") e.preventDefault();
        }}
        onEscapeKeyDown={(e) => {
          if (phase === "processing") e.preventDefault();
        }}
      >
        {phase === "processing" && (
          <>
            <DialogHeader className="items-center gap-4">
              <div className="bg-primary/10 flex size-16 items-center justify-center rounded-full">
                <Spinner className="text-primary size-8" />
              </div>
              <div>
                <DialogTitle className="text-center text-lg">
                  Procesando tu comprobante
                </DialogTitle>
                <DialogDescription className="text-center text-sm">
                  No cierres esta ventana, tardamos unos segundos.
                </DialogDescription>
              </div>
            </DialogHeader>

            <div className="mt-2 flex flex-col gap-3">
              {STEPS.map((step, i) => (
                <div key={i} className="flex items-start gap-3 text-left">
                  <span
                    className={`mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border-2 text-xs font-bold transition-colors duration-300 ${
                      i <= activeStep
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-muted-foreground/30 text-muted-foreground/30"
                    }`}
                  >
                    {i < activeStep ? "✓" : i + 1}
                  </span>
                  <p
                    className={`text-sm transition-colors duration-300 ${
                      i <= activeStep
                        ? "text-foreground"
                        : "text-muted-foreground/40"
                    }`}
                  >
                    {step}
                  </p>
                </div>
              ))}
            </div>
          </>
        )}

        {phase === "done" && (
          <>
            <DialogHeader className="items-center gap-4">
              <div className="bg-[--chart-1]/20 text-[--chart-1] flex size-16 items-center justify-center rounded-full">
                <CircleCheckBig size={32} />
              </div>
              <div>
                <DialogTitle className="text-center text-lg">
                  ¡Comprobante enviado!
                </DialogTitle>
                <DialogDescription className="text-center text-sm">
                  Tus números quedaron reservados. Cuando el creador confirme la
                  transferencia, te avisamos por email.
                </DialogDescription>
              </div>
            </DialogHeader>

            <div className="mt-4 flex flex-col items-center gap-4">
              <div className="relative flex size-16 items-center justify-center">
                <svg viewBox="0 0 48 48" className="size-16 -rotate-90">
                  <circle
                    cx="24"
                    cy="24"
                    r="20"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="4"
                    className="text-muted/40"
                  />
                  <circle
                    cx="24"
                    cy="24"
                    r="20"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="4"
                    strokeDasharray={circumference}
                    strokeDashoffset={circumference - progress}
                    strokeLinecap="round"
                    className="text-primary transition-all duration-1000"
                  />
                </svg>
                <span className="absolute text-sm font-semibold tabular-nums">
                  {countdown}
                </span>
              </div>
              <p className="text-muted-foreground text-sm">
                Volvés al inicio en {countdown} segundo
                {countdown !== 1 ? "s" : ""}…
              </p>
              <Button onClick={() => router.push("/")} className="w-full">
                Volver al inicio ahora
              </Button>
            </div>
          </>
        )}

        {phase === "error" && (
          <>
            <DialogHeader className="items-center gap-4">
              <div className="flex size-16 items-center justify-center rounded-full bg-destructive/10 text-destructive">
                <XCircle size={32} />
              </div>
              <div>
                <DialogTitle className="text-center text-lg">
                  Algo salió mal
                </DialogTitle>
                <DialogDescription className="text-center text-sm">
                  {errorMsg}
                </DialogDescription>
              </div>
            </DialogHeader>
            <Button
              variant="outline"
              onClick={handleClose}
              className="mt-2 w-full"
            >
              Cerrar e intentar de nuevo
            </Button>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
