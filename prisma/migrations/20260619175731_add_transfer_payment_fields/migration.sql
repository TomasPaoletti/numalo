-- AlterTable
ALTER TABLE "Payment" ADD COLUMN     "comprobantePublicId" TEXT,
ADD COLUMN     "comprobanteUrl" TEXT;

-- AlterTable
ALTER TABLE "Raffle" ADD COLUMN     "alias" TEXT,
ADD COLUMN     "banco" TEXT,
ADD COLUMN     "cbu" TEXT,
ADD COLUMN     "cuit" TEXT,
ADD COLUMN     "titular" TEXT;
