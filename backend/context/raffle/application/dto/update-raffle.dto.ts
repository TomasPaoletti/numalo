import {
  DrawMethod,
  DrawTrigger,
  RaffleStatus,
} from "@/app/generated/prisma/enums";
import { CreateQuantityDto } from "@/backend/context/quantity-discount/application/dto";

export interface UpdateRaffleDto {
  title?: string;
  description?: string;
  image?: File;
  imagePublicId?: string;
  totalNumbers?: number;
  numberPrice?: number;
  hasQuantityDiscount?: boolean;
  drawMethod?: DrawMethod;
  drawTrigger?: DrawTrigger;
  drawDate?: Date;
  status?: RaffleStatus;
  publishedAt?: Date;
  finishedAt?: Date;
  winnerNumber?: number;
  winnerName?: string;
  winnerPhone?: string;
  winnerEmail?: string;
  drawnAt?: Date;
  quantityDiscounts?: CreateQuantityDto[];
}
