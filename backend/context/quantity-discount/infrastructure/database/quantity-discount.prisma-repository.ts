import prisma from "@/lib/prisma";

import { QuantityDiscountEntity } from "@/backend/context/quantity-discount/domain/entities/quantity-discount.entity";
import { QuantityDiscountRepository } from "@/backend/context/quantity-discount/domain/repositories/quantity-discount.repository";
import { mapQuantityDiscountToDomainEntity } from "@/backend/context/quantity-discount/infrastructure/mappers/quantity-discount.mapper";

export class PrismaQuantityDiscountRepository implements QuantityDiscountRepository {
  async create(
    quantityDiscountData: Omit<QuantityDiscountEntity, "id" | "createdAt">
  ): Promise<QuantityDiscountEntity> {
    const prismaQuantityDiscount = await prisma.quantityDiscount.create({
      data: {
        quantity: quantityDiscountData.quantity,
        percentage: quantityDiscountData.percentage,
        raffleId: quantityDiscountData.raffleId,
      },
    });

    return mapQuantityDiscountToDomainEntity(prismaQuantityDiscount);
  }

  async deleteByRaffleId(raffleId: string): Promise<void> {
    await prisma.quantityDiscount.deleteMany({
      where: { raffleId },
    });
  }

  async delete(id: string): Promise<void> {
    await prisma.quantityDiscount.delete({
      where: { id },
    });
  }
}
