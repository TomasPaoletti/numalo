import { Payment, SoldNumber } from "@/app/generated/prisma/client";
import { mapPaymentToDomainEntity } from "@/backend/context/payment/infrastructure/mappers/payment.mapper";

import { SoldNumbersEntity } from "@/backend/context/sold-numbers/domain/entities/sold-numbers.entity";

type SoldNumberWithPayment = SoldNumber & {
  payment?: Payment | null;
};

export function mapSoldNumberToDomainEntity(
  prismaSoldNumbers: SoldNumberWithPayment
): SoldNumbersEntity {
  return {
    id: prismaSoldNumbers.id,
    number: prismaSoldNumbers.number,
    paymentId: prismaSoldNumbers.paymentId,
    raffleId: prismaSoldNumbers.raffleId,
    reservedAt: prismaSoldNumbers.reservedAt,
    reservedBy: prismaSoldNumbers.reservedBy,
    reservedUntil: prismaSoldNumbers.reservedUntil,
    status: prismaSoldNumbers.status,

    payment: prismaSoldNumbers.payment
      ? mapPaymentToDomainEntity(prismaSoldNumbers.payment)
      : undefined,
  };
}
