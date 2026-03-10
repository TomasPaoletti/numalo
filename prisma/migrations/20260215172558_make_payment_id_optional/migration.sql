-- DropForeignKey
ALTER TABLE "SoldNumber" DROP CONSTRAINT "SoldNumber_paymentId_fkey";

-- AlterTable
ALTER TABLE "SoldNumber" ALTER COLUMN "paymentId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "SoldNumber" ADD CONSTRAINT "SoldNumber_paymentId_fkey" FOREIGN KEY ("paymentId") REFERENCES "Payment"("id") ON DELETE SET NULL ON UPDATE CASCADE;
