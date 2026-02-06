import {
  DrawMethod,
  DrawTrigger,
  RaffleStatus,
} from "@/app/generated/prisma/enums";

export interface UpdateRaffleDto {
  title?: string;
  description?: string;
  image?: string;
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
}
