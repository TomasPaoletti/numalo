import {
  DrawMethod,
  DrawTrigger,
  RaffleStatus,
} from "@/app/generated/prisma/enums";

import { QuantityDiscountEntity } from "@/backend/context/quantity-discount/domain/entities/quantity-discount.entity";

export interface RaffleEntity {
  id: string;
  title: string;
  description: string;
  image: string | null;
  imagePublicId: string | null;
  totalNumbers: number;
  numberPrice: number;
  hasQuantityDiscount: boolean;
  drawMethod: DrawMethod;
  drawDate: Date | null;
  drawTrigger: DrawTrigger;
  status: RaffleStatus;
  quantityDiscounts?: QuantityDiscountEntity[];
  winnerNumber: number | null;
  winnerName: string | null;
  winnerPhone: string | null;
  winnerEmail: string | null;
  drawnAt: Date | null;
  companyId: string;
  createdAt: Date;
  updatedAt: Date;
  publishedAt: Date | null;
  finishedAt: Date | null;
}
