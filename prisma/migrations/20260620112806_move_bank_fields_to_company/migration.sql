/*
  Warnings:

  - You are about to drop the column `alias` on the `Raffle` table. All the data in the column will be lost.
  - You are about to drop the column `banco` on the `Raffle` table. All the data in the column will be lost.
  - You are about to drop the column `cbu` on the `Raffle` table. All the data in the column will be lost.
  - You are about to drop the column `cuit` on the `Raffle` table. All the data in the column will be lost.
  - You are about to drop the column `titular` on the `Raffle` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Company" ADD COLUMN     "alias" TEXT,
ADD COLUMN     "banco" TEXT,
ADD COLUMN     "cbu" TEXT,
ADD COLUMN     "cuit" TEXT,
ADD COLUMN     "titular" TEXT;

-- AlterTable
ALTER TABLE "Raffle" DROP COLUMN "alias",
DROP COLUMN "banco",
DROP COLUMN "cbu",
DROP COLUMN "cuit",
DROP COLUMN "titular";
