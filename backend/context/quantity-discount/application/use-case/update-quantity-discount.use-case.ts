import { CreateQuantityDto } from "@/backend/context/quantity-discount/application/dto";

import { CreateQuantityDiscountUseCase } from "@/backend/context/quantity-discount/application/use-case/create-quantity-discount.use-case";
import { QuantityDiscountRepository } from "@/backend/context/quantity-discount/domain/repositories/quantity-discount.repository";

export class UpdateQuantityDiscountsUseCase {
  constructor(
    private quantityDiscountRepository: QuantityDiscountRepository,
    private createQuantityDiscountUseCase: CreateQuantityDiscountUseCase
  ) {}

  async execute(
    raffleId: string,
    hasQuantityDiscount: boolean,
    quantityDiscounts?: CreateQuantityDto[]
  ) {
    await this.quantityDiscountRepository.deleteByRaffleId(raffleId);

    if (
      hasQuantityDiscount &&
      quantityDiscounts &&
      quantityDiscounts.length > 0
    ) {
      for (const discount of quantityDiscounts) {
        await this.createQuantityDiscountUseCase.execute({
          quantity: discount.quantity,
          percentage: discount.percentage,
          raffleId,
        });
      }
    }
  }
}
