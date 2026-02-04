import { QuantityDiscountEntity } from "@/backend/context/quantity-discount/domain/entities/quantity-discount.entity";

export interface QuantityDiscountRepository {
  create(
    quantityDiscountData: Omit<
      QuantityDiscountEntity,
      "id" | "createdAt" | "updatedAt"
    >
  ): Promise<QuantityDiscountEntity>;
  delete(id: string): Promise<void>;
}
