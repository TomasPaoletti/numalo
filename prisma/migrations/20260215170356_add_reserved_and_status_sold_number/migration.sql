-- CreateEnum
CREATE TYPE "ReservationStatus" AS ENUM ('AVAILABLE', 'RESERVED', 'SOLD');

-- AlterTable
ALTER TABLE "SoldNumber" ADD COLUMN     "reservedAt" TIMESTAMP(3),
ADD COLUMN     "reservedBy" TEXT,
ADD COLUMN     "reservedUntil" TIMESTAMP(3),
ADD COLUMN     "status" "ReservationStatus" NOT NULL DEFAULT 'AVAILABLE';
