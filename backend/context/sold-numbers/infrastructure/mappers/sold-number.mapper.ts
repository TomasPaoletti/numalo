import { SoldNumber } from "@/app/generated/prisma/client";

import { SoldNumbersEntity } from "@/backend/context/sold-numbers/domain/entities/sold-numbers.entity";

export function mapSoldNumberToDomainEntity(
  prismaSoldNumbers: SoldNumber
): SoldNumbersEntity {
  return {
    id: prismaSoldNumbers.id,
    number: prismaSoldNumbers.number,
    paymentId: prismaSoldNumbers.paymentId,
    raffleId: prismaSoldNumbers.raffleId,
  };
}
