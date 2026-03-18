import { ReservationStatus } from "@/app/generated/prisma/enums";
import { PaymentEntity } from "@/backend/context/payment/domain/entities/payment.entity";

export interface SoldNumbersEntity {
  id: string;
  number: number;
  raffleId: string;
  paymentId: string | null;
  reservedAt: Date | null;
  reservedBy: string | null;
  reservedUntil: Date | null;
  status: ReservationStatus;

  payment?: PaymentEntity;
}
