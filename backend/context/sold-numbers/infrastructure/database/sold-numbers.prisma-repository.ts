import prisma from "@/lib/prisma";

import { SoldNumbersEntity } from "@/backend/context/sold-numbers/domain/entities/sold-numbers.entity";
import { SoldNumbersRepository } from "@/backend/context/sold-numbers/domain/repositories/sold-numbers.repository";
import { mapSoldNumberToDomainEntity } from "@/backend/context/sold-numbers/infrastructure/mappers/sold-number.mapper";

export class PrismaSoldNumberRepository implements SoldNumbersRepository {
  async create(
    soldNumberData: Omit<SoldNumbersEntity, "id">
  ): Promise<SoldNumbersEntity> {
    const prismaSoldNumbers = await prisma.soldNumber.create({
      data: {
        number: soldNumberData.number,
        paymentId: soldNumberData.paymentId,
        raffleId: soldNumberData.raffleId,
      },
    });

    return mapSoldNumberToDomainEntity(prismaSoldNumbers);
  }

  async findByRaffleId(raffleId: string): Promise<SoldNumbersEntity[]> {
    const soldNumbers = await prisma.soldNumber.findMany({
      where: { raffleId },
    });

    return soldNumbers.map(mapSoldNumberToDomainEntity);
  }

  async delete(id: string): Promise<void> {
    await prisma.soldNumber.delete({
      where: { id },
    });
  }
}
