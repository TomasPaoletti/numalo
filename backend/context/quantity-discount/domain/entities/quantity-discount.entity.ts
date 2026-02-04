export interface QuantityDiscountEntity {
  id: string;
  quantity: number;
  percentage: number;
  raffleId: string;
  createdAt: Date;
}
