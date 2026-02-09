import { QuantityDiscountEntity } from "@/backend/context/quantity-discount/domain/entities/quantity-discount.entity";

import { QuantityDiscount } from "@/app/generated/prisma/client";

export function mapQuantityDiscountToDomainEntity(
  prismaQuantityDiscount: QuantityDiscount
): QuantityDiscountEntity {
  return {
    id: prismaQuantityDiscount.id,
    quantity: prismaQuantityDiscount.quantity,
    percentage: Number(prismaQuantityDiscount.percentage),
    raffleId: prismaQuantityDiscount.raffleId,
    createdAt: prismaQuantityDiscount.createdAt,
  };
}
