import {
  DrawMethod,
  DrawTrigger,
  RaffleStatus,
} from "@/app/generated/prisma/enums";

export interface RaffleEntity {
  id: string;
  title: string;
  description: string;
  image: string | null;
  totalNumbers: number;
  numberPrice: number;
  hasQuantityDiscount: boolean;
  drawMethod: DrawMethod;
  drawDate: Date | null;
  drawTrigger: DrawTrigger;
  status: RaffleStatus;
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
