/*
  Warnings:

  - Made the column `raffleId` on table `Payment` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Payment" DROP CONSTRAINT "Payment_raffleId_fkey";

-- DropIndex
DROP INDEX "Payment_raffleId_key";

-- AlterTable
ALTER TABLE "Payment" ALTER COLUMN "raffleId" SET NOT NULL;

-- CreateTable
CREATE TABLE "SoldNumber" (
    "id" TEXT NOT NULL,
    "number" INTEGER NOT NULL,
    "raffleId" TEXT NOT NULL,
    "paymentId" TEXT NOT NULL,

    CONSTRAINT "SoldNumber_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SoldNumber_raffleId_number_key" ON "SoldNumber"("raffleId", "number");

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_raffleId_fkey" FOREIGN KEY ("raffleId") REFERENCES "Raffle"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SoldNumber" ADD CONSTRAINT "SoldNumber_raffleId_fkey" FOREIGN KEY ("raffleId") REFERENCES "Raffle"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SoldNumber" ADD CONSTRAINT "SoldNumber_paymentId_fkey" FOREIGN KEY ("paymentId") REFERENCES "Payment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
