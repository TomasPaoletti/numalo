import { CreateQuantityDto } from "@/backend/context/quantity-discount/application/dto";
import { QuantityDiscountEntity } from "@/backend/context/quantity-discount/domain/entities/quantity-discount.entity";
import { QuantityDiscountRepository } from "@/backend/context/quantity-discount/domain/repositories/quantity-discount.repository";

import { ValidationError } from "@/backend/shared/errors";

export class CreateQuantityDiscountUseCase {
  constructor(private quantityDiscountRepository: QuantityDiscountRepository) {}

  async execute(data: CreateQuantityDto): Promise<QuantityDiscountEntity> {
    const { quantity, percentage, raffleId } = data;

    if (!raffleId) {
      throw new ValidationError("El id de la rifa es obligatorio");
    }

    if (quantity < 2) {
      throw new ValidationError("La cantidad mínima es 2");
    }

    if (percentage <= 0 || percentage > 100) {
      throw new ValidationError("El porcentaje debe estar entre 0 y 100");
    }

    const quantityDiscount = await this.quantityDiscountRepository.create({
      quantity,
      percentage,
      raffleId,
    });

    return quantityDiscount;
  }
}
