/*
  Warnings:

  - You are about to drop the column `drawnAt` on the `Raffle` table. All the data in the column will be lost.
  - You are about to drop the column `winnerEmail` on the `Raffle` table. All the data in the column will be lost.
  - You are about to drop the column `winnerName` on the `Raffle` table. All the data in the column will be lost.
  - You are about to drop the column `winnerNumber` on the `Raffle` table. All the data in the column will be lost.
  - You are about to drop the column `winnerPhone` on the `Raffle` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Raffle" DROP COLUMN "drawnAt",
DROP COLUMN "winnerEmail",
DROP COLUMN "winnerName",
DROP COLUMN "winnerNumber",
DROP COLUMN "winnerPhone";

-- CreateTable
CREATE TABLE "RaffleWinner" (
    "id" TEXT NOT NULL,
    "position" INTEGER NOT NULL,
    "number" INTEGER NOT NULL,
    "name" TEXT,
    "phone" TEXT,
    "email" TEXT,
    "raffleId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RaffleWinner_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "RaffleWinner_raffleId_idx" ON "RaffleWinner"("raffleId");

-- CreateIndex
CREATE UNIQUE INDEX "RaffleWinner_raffleId_position_key" ON "RaffleWinner"("raffleId", "position");

-- CreateIndex
CREATE UNIQUE INDEX "RaffleWinner_raffleId_number_key" ON "RaffleWinner"("raffleId", "number");

-- AddForeignKey
ALTER TABLE "RaffleWinner" ADD CONSTRAINT "RaffleWinner_raffleId_fkey" FOREIGN KEY ("raffleId") REFERENCES "Raffle"("id") ON DELETE CASCADE ON UPDATE CASCADE;
