import { QuantityDiscountEntity } from "@/backend/context/quantity-discount/domain/entities/quantity-discount.entity";

export interface RaffleNumbersDto {
  id: string;
  title: string;
  totalNumbers: number;
  numberPrice: number;
  quantityDiscounts?: QuantityDiscountEntity[];
  soldNumbers: number[];
}
