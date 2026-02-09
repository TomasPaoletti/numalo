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

    const parsedQuantity = Number(quantity);
    const parsedPercentage = Number(percentage);

    if (!Number.isInteger(parsedQuantity)) {
      throw new ValidationError("La cantidad debe ser un número entero");
    }

    if (!Number.isInteger(parsedPercentage)) {
      throw new ValidationError("El porcentaje debe ser un número entero");
    }

    if (parsedPercentage <= 0 || parsedPercentage > 100) {
      throw new ValidationError("El porcentaje debe estar entre 1 y 100");
    }

    const quantityDiscount = await this.quantityDiscountRepository.create({
      quantity: parsedQuantity,
      percentage: parsedPercentage,
      raffleId,
    });

    return quantityDiscount;
  }
}
