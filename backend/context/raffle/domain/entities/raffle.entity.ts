import {
  DrawMethod,
  DrawTrigger,
  RaffleStatus,
} from "@/app/generated/prisma/enums";

import { QuantityDiscountEntity } from "@/backend/context/quantity-discount/domain/entities/quantity-discount.entity";
import { RaffleWinnerEntity } from "@/backend/context/raffle-winner/domain/entities/raffle-winner.entity";

export interface RaffleEntity {
  id: string;
  title: string;
  description: string;
  image: string | null;
  imagePublicId: string | null;
  totalNumbers: number;
  numberPrice: number;
  winnersCount: number;
  hasQuantityDiscount: boolean;
  drawMethod: DrawMethod;
  drawDate: Date | null;
  drawTrigger: DrawTrigger;
  status: RaffleStatus;
  quantityDiscounts?: QuantityDiscountEntity[];
  winners?: RaffleWinnerEntity[];
  companyId: string;
  createdAt: Date;
  updatedAt: Date;
  publishedAt: Date | null;
  finishedAt: Date | null;
}
