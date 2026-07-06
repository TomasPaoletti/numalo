"use client";

import { ArrowLeft, Clock, Send, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";

import { cn, formatPrice } from "@/lib/utils";

import { useReservationTimer } from "@/components/pages/raffle/pagar/hooks/useReservationTimer";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

import DeleteReservation from "@/components/pages/raffle/sold-number/services/delete-reservation.service";

import BankDetailRows from "./BankDetailRows";
import ComprobanteDropzone from "./ComprobanteDropzone";
import ComprobanteModal from "./ComprobanteModal";

interface BankInfo {
  titular: string | null;
  alias: string | null;
  cbu: string | null;
  cuit: string | null;
  banco: string | null;
}

interface ContactForm {
  payerName: string;
  payerEmail: string;
  payerPhone: string;
}

interface PagarClientProps {
  raffleId: string;
  bankInfo: BankInfo;
  numbers: number[];
  finalPrice: number;
  sessionId: string;
  reservedUntil: string;
  defaultEmail?: string;
  defaultName?: string;
}

export default function PagarClient({
  raffleId,
  bankInfo,
  numbers,
  finalPrice,
  sessionId,
  reservedUntil,
  defaultEmail = "",
  defaultName = "",
}: PagarClientProps) {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [expiredOpen, setExpiredOpen] = useState(false);
  const [cancelOpen, setCancelOpen] = useState(false);
  const [cancelLoading, setCancelLoading] = useState(false);
  const [pendingFormData, setPendingFormData] = useState<FormData | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const { formatted, isExpired } = useReservationTimer(reservedUntil);

  useEffect(() => {
    if (isExpired) {
      setExpiredOpen(true);
    }
  }, [isExpired]);

  const form = useForm<ContactForm>({
    defaultValues: {
      payerName: defaultName,
      payerEmail: defaultEmail,
      payerPhone: "",
    },
  });

  const handleSubmit = form.handleSubmit((data) => {
    if (!file) return;

    const fd = new FormData();
    fd.append("raffleId", raffleId);
    fd.append("sessionId", sessionId);
    fd.append("comprobante", file);
    fd.append("payerName", data.payerName);
    fd.append("payerEmail", data.payerEmail);
    fd.append("payerPhone", data.payerPhone);

    setPendingFormData(fd);
    setModalOpen(true);
  });

  const handleExpiredClose = () => {
    setExpiredOpen(false);
    router.push(`/raffle/${raffleId}/sold-number`);
  };

  const handleConfirmBack = async () => {
    setCancelLoading(true);
    try {
      await DeleteReservation(raffleId, sessionId);
    } catch {
      // best effort — the TTL will clean it up
    } finally {
      setCancelLoading(false);
    }
    router.push(`/raffle/${raffleId}/sold-number`);
  };

  return (
    <>
      <div className="w-full p-6 pb-32 md:py-12 md:pb-32">
        <div className="flex flex-col gap-[18px]">
          <button
            onClick={() => setCancelOpen(true)}
            className="text-muted-foreground hover:bg-muted flex w-fit items-center gap-1.5 rounded-md px-2 py-1 text-sm transition-colors duration-150"
          >
            <ArrowLeft size={14} />
            Volver a elegir números
          </button>

          <div>
            <h1 className="text-[27px] font-bold tracking-tight">
              Pagá por transferencia
            </h1>
            <p className="text-muted-foreground text-[14.5px]">
              Transferí el monto exacto y subí el comprobante para reservar tus
              números.
            </p>
          </div>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">
                  Tus números ({numbers.length})
                </CardTitle>
                <div
                  className={cn(
                    "flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-medium",
                    isExpired
                      ? "bg-destructive/10 text-destructive"
                      : "bg-primary/10 text-primary"
                  )}
                >
                  <Clock size={13} />
                  <span>{isExpired ? "Expirado" : formatted}</span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="flex flex-wrap gap-1.5">
                {numbers.map((n) => (
                  <span
                    key={n}
                    className="bg-primary text-primary-foreground flex size-8 items-center justify-center rounded-full text-xs font-medium"
                  >
                    {n}
                  </span>
                ))}
              </div>
              <div className="border-border border-t pt-3">
                <p className="text-muted-foreground text-xs">
                  Total a transferir
                </p>
                <p className="text-primary font-mono text-[30px] font-semibold">
                  {formatPrice(finalPrice)}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                Datos para la transferencia
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <BankDetailRows bankInfo={bankInfo} />
              <div className="border-primary/22 bg-primary/9 flex items-start gap-3 rounded-lg border px-4 py-3">
                <ShieldCheck className="text-primary mt-0.5 size-4 shrink-0" />
                <p className="text-muted-foreground text-xs leading-relaxed">
                  El dinero se transfiere directamente a la cuenta del creador.
                  Numeralo no recibe ni administra los pagos.
                </p>
              </div>
            </CardContent>
          </Card>

          <form ref={formRef} onSubmit={handleSubmit}>
            <Card>
              <CardHeader>
                <CardTitle className="text-base">
                  Tu información de contacto
                </CardTitle>
              </CardHeader>
              <CardContent>
                <FieldGroup className="flex flex-col gap-4">
                  <Controller
                    name="payerName"
                    control={form.control}
                    rules={{ required: "Ingresá tu nombre" }}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="payerName">Nombre</FieldLabel>
                        <Input
                          {...field}
                          id="payerName"
                          type="text"
                          autoComplete="name"
                          placeholder="Juan García"
                        />
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />
                  <Controller
                    name="payerEmail"
                    control={form.control}
                    rules={{
                      required: "Ingresá tu email",
                      pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: "Email inválido",
                      },
                    }}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="payerEmail">Email</FieldLabel>
                        <Input
                          {...field}
                          id="payerEmail"
                          type="email"
                          autoComplete="email"
                          placeholder="juan@gmail.com"
                        />
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />
                  <Controller
                    name="payerPhone"
                    control={form.control}
                    render={({ field }) => (
                      <Field>
                        <div className="flex items-center justify-between">
                          <FieldLabel htmlFor="payerPhone">Teléfono</FieldLabel>
                          <p className="text-muted-foreground text-xs italic">
                            Opcional
                          </p>
                        </div>
                        <Input
                          {...field}
                          id="payerPhone"
                          type="tel"
                          autoComplete="tel"
                          placeholder="1143211234"
                        />
                      </Field>
                    )}
                  />
                </FieldGroup>
              </CardContent>
            </Card>

            <Card className="mt-[18px]">
              <CardHeader>
                <CardTitle className="text-base">Subí tu comprobante</CardTitle>
              </CardHeader>
              <CardContent>
                <ComprobanteDropzone
                  file={file}
                  onFile={setFile}
                  onClear={() => setFile(null)}
                />
              </CardContent>
            </Card>
          </form>
        </div>
      </div>

      <div className="bg-background fixed right-0 bottom-0 left-0 border-t px-4 py-2">
        <div className="mx-auto flex items-center justify-between">
          <Button variant="outline" onClick={() => setCancelOpen(true)}>
            <ArrowLeft size={16} />
            Volver
          </Button>
          <Button
            type="button"
            disabled={!file || isExpired}
            onClick={handleSubmit}
          >
            <Send size={16} />
            Enviar comprobante
          </Button>
        </div>
      </div>

      <ComprobanteModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setPendingFormData(null);
        }}
        formData={pendingFormData}
      />

      {/* Cancel reservation dialog */}
      <Dialog open={cancelOpen} onOpenChange={setCancelOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>¿Cancelar la reserva?</DialogTitle>
            <DialogDescription>
              Si volvés a elegir números, tu reserva actual será cancelada y los
              números quedarán disponibles nuevamente.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setCancelOpen(false)}
              disabled={cancelLoading}
            >
              Quedarme aquí
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmBack}
              disabled={cancelLoading}
            >
              Sí, cancelar reserva
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Expired reservation dialog */}
      <Dialog open={expiredOpen} onOpenChange={() => {}}>
        <DialogContent onInteractOutside={(e) => e.preventDefault()}>
          <DialogHeader>
            <DialogTitle>Reserva expirada</DialogTitle>
            <DialogDescription>
              El tiempo para completar el pago expiró y tus números fueron
              liberados. Podés volver a seleccionarlos si están disponibles.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={handleExpiredClose}>Volver a la rifa</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
