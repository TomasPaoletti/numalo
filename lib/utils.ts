import { DrawMethod, DrawTrigger } from "@/app/generated/prisma/enums";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatPrice = (price: number) =>
  new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
  }).format(price);

export const getDrawMethodLabel = (method: DrawMethod) =>
  method === DrawMethod.QUINIELA_NACIONAL
    ? "Quiniela Nacional"
    : "Aleatorio (Numeralo)";

export const getDrawTriggerLabel = (trigger: DrawTrigger) =>
  trigger === DrawTrigger.VENDER_TODO
    ? "Al vender todos los números"
    : "Fecha fija";
