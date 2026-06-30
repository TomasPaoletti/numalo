"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";

import { DrawMethod, RaffleStatus } from "@/app/generated/prisma/enums";
import { RaffleWithStats } from "@/backend/context/raffle/application/dto";

import { AssignQuinielaWinner } from "@/services/raffle";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function mapQuinielaPreview(
  quinielaNumber: number,
  totalNumbers: number
): number {
  if (totalNumbers <= 100) {
    const lastTwo = quinielaNumber % 100;
    return lastTwo === 0 ? totalNumbers : lastTwo;
  }
  if (totalNumbers <= 1000) {
    const lastThree = quinielaNumber % 1000;
    return lastThree === 0 ? totalNumbers : lastThree;
  }
  return Math.min(quinielaNumber, totalNumbers);
}

function parseQuinielaInput(raw: string): number | null {
  if (raw.trim() === "") return null;
  const n = parseInt(raw, 10);
  if (isNaN(n) || n < 0 || n > 9999) return null;
  return n;
}

interface SectionAssignQuinielaWinnerProps {
  raffle: RaffleWithStats;
}

export default function SectionAssignQuinielaWinner({
  raffle,
}: SectionAssignQuinielaWinnerProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [inputs, setInputs] = useState<string[]>(
    Array(raffle.winnersCount).fill("")
  );
  const [confirmOpen, setConfirmOpen] = useState(false);

  const hasWinners = (raffle.winners?.length ?? 0) > 0;

  if (
    raffle.drawMethod !== DrawMethod.QUINIELA_NACIONAL ||
    raffle.status !== RaffleStatus.FINISHED ||
    hasWinners
  ) {
    return null;
  }

  const parsedNumbers = inputs.map(parseQuinielaInput);
  const allValid = parsedNumbers.every((n) => n !== null);

  const preview = parsedNumbers.map((n) =>
    n !== null ? mapQuinielaPreview(n, raffle.totalNumbers) : null
  );

  const handleInputChange = (index: number, value: string) => {
    setInputs((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
  };

  const handleConfirm = () => {
    if (!allValid) return;

    startTransition(async () => {
      try {
        const result = await AssignQuinielaWinner(
          raffle.id,
          parsedNumbers as number[]
        );

        const summary = result.winners
          .map((w) =>
            w.winnerName
              ? `#${w.mappedNumber} — ${w.winnerName}`
              : `#${w.mappedNumber} (sin dueño registrado)`
          )
          .join(", ");

        toast.success(
          `¡Ganador${result.winners.length > 1 ? "es" : ""} asignado${result.winners.length > 1 ? "s" : ""}! ${summary}`
        );
        setConfirmOpen(false);
        router.refresh();
      } catch (error: any) {
        toast.error(error?.message ?? "Error al asignar el ganador");
      }
    });
  };

  const isMultiple = raffle.winnersCount > 1;

  return (
    <>
      <Card className="border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/20">
        <CardHeader>
          <CardTitle className="text-amber-900 dark:text-amber-100">
            Asignar ganador por quiniela
          </CardTitle>
          <CardDescription className="text-amber-700 dark:text-amber-300">
            {isMultiple
              ? `Ingresá los ${raffle.winnersCount} números de la Quiniela Nacional, uno por posición.`
              : "Ingresá el número que salió en la Quiniela Nacional y el sistema calculará el número ganador de tu rifa."}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {inputs.map((raw, index) => {
            const parsed = parsedNumbers[index];
            const mapped = preview[index];
            return (
              <div key={index} className="flex flex-col gap-2">
                <Label htmlFor={`quiniela-number-${index}`}>
                  {isMultiple
                    ? `Número de quiniela — Posición ${index + 1} (0000–9999)`
                    : "Número de quiniela (0000–9999)"}
                </Label>
                <div className="flex items-center gap-3">
                  <Input
                    id={`quiniela-number-${index}`}
                    type="number"
                    min={0}
                    max={9999}
                    placeholder="ej: 4523"
                    value={raw}
                    onChange={(e) => handleInputChange(index, e.target.value)}
                    className="dark:bg-background w-40 bg-white"
                  />
                  {parsed !== null && mapped !== null && (
                    <p className="text-sm text-amber-800 dark:text-amber-200">
                      → Número ganador de la rifa:{" "}
                      <span className="font-semibold">#{mapped}</span>
                    </p>
                  )}
                </div>
              </div>
            );
          })}

          <Button
            onClick={() => setConfirmOpen(true)}
            disabled={!allValid}
            className="w-fit"
          >
            Confirmar ganador{isMultiple ? "es" : ""}
          </Button>
        </CardContent>
      </Card>

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              ¿Confirmar ganador{isMultiple ? "es" : ""}?
            </DialogTitle>
            <DialogDescription asChild>
              <div className="flex flex-col gap-3">
                <p>
                  {isMultiple
                    ? "Estos son los números ganadores que se asignarán:"
                    : `El número de quiniela `}
                  {!isMultiple && (
                    <>
                      <span className="font-semibold">{parsedNumbers[0]}</span>
                      {" corresponde al número "}
                      <span className="font-semibold">#{preview[0]}</span>
                      {" de tu rifa."}
                    </>
                  )}
                </p>
                {isMultiple && (
                  <ul className="space-y-1 text-sm">
                    {parsedNumbers.map((n, i) => (
                      <li key={i}>
                        Posición {i + 1}: quiniela{" "}
                        <span className="font-semibold">{n}</span> → rifa{" "}
                        <span className="font-semibold">#{preview[i]}</span>
                      </li>
                    ))}
                  </ul>
                )}
                <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-800 dark:bg-red-950/30 dark:text-red-300">
                  Esta acción no se puede deshacer. Una vez confirmado, el
                  número ganador no podrá modificarse.
                </p>
              </div>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setConfirmOpen(false)}
              disabled={isPending}
            >
              Cancelar
            </Button>
            <Button onClick={handleConfirm} disabled={isPending}>
              {isPending ? "Procesando..." : "Confirmar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
