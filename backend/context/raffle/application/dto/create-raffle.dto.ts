import {
  DrawMethod,
  DrawTrigger,
  RaffleStatus,
} from "@/app/generated/prisma/enums";

import { CreateQuantityDto } from "@/backend/context/quantity-discount/application/dto";

export interface CreateRaffleDto {
  title: string;
  description?: string;
  image?: File;
  totalNumbers: number;
  numberPrice: number;
  hasQuantityDiscount: boolean;
  drawMethod: DrawMethod;
  drawTrigger: DrawTrigger;
  drawDate?: Date;
  quantityDiscounts?: CreateQuantityDto[];
  status: RaffleStatus;
}
