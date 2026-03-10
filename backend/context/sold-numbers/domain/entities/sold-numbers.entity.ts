import { ReservationStatus } from "@/app/generated/prisma/enums";

export interface SoldNumbersEntity {
  id: string;
  number: number;
  raffleId: string;
  paymentId: string | null;
  reservedAt: Date | null;
  reservedBy: string | null;
  reservedUntil: Date | null;
  status: ReservationStatus;
}
