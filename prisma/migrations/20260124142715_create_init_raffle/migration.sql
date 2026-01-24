-- CreateEnum
CREATE TYPE "DrawMethod" AS ENUM ('QUINIELA_NACIONAL', 'ALEATORIO');

-- CreateEnum
CREATE TYPE "DrawTrigger" AS ENUM ('VENDER_TODO', 'FECHA_FIJA');

-- CreateEnum
CREATE TYPE "RaffleStatus" AS ENUM ('DRAFT', 'ACTIVE', 'FINISHED');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "PaymentProvider" AS ENUM ('MERCADO_PAGO', 'MANUAL');

-- CreateEnum
CREATE TYPE "PaymentType" AS ENUM ('RAFFLE_ACTIVATION', 'NUMBER_PURCHASE');

-- CreateTable
CREATE TABLE "Raffle" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "image" TEXT,
    "totalNumbers" INTEGER NOT NULL,
    "numberPrice" DECIMAL(10,2) NOT NULL,
    "hasQuantityDiscount" BOOLEAN NOT NULL DEFAULT false,
    "drawMethod" "DrawMethod" NOT NULL,
    "drawDate" TIMESTAMP(3),
    "drawTrigger" "DrawTrigger" NOT NULL,
    "status" "RaffleStatus" NOT NULL DEFAULT 'DRAFT',
    "winnerNumber" INTEGER,
    "winnerName" TEXT,
    "winnerPhone" TEXT,
    "winnerEmail" TEXT,
    "drawnAt" TIMESTAMP(3),
    "companyId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "publishedAt" TIMESTAMP(3),
    "finishedAt" TIMESTAMP(3),

    CONSTRAINT "Raffle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QuantityDiscount" (
    "id" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "percentage" DECIMAL(5,2) NOT NULL,
    "raffleId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "QuantityDiscount_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Payment" (
    "id" TEXT NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'ARS',
    "status" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "provider" "PaymentProvider" NOT NULL DEFAULT 'MERCADO_PAGO',
    "providerPaymentId" TEXT,
    "providerMetadata" JSONB,
    "paymentType" "PaymentType" NOT NULL,
    "raffleId" TEXT,
    "payerName" TEXT,
    "payerEmail" TEXT,
    "payerPhone" TEXT,
    "payerInstagram" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "paidAt" TIMESTAMP(3),

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Raffle_companyId_idx" ON "Raffle"("companyId");

-- CreateIndex
CREATE INDEX "Raffle_status_idx" ON "Raffle"("status");

-- CreateIndex
CREATE INDEX "QuantityDiscount_raffleId_idx" ON "QuantityDiscount"("raffleId");

-- CreateIndex
CREATE UNIQUE INDEX "QuantityDiscount_raffleId_quantity_key" ON "QuantityDiscount"("raffleId", "quantity");

-- CreateIndex
CREATE UNIQUE INDEX "Payment_providerPaymentId_key" ON "Payment"("providerPaymentId");

-- CreateIndex
CREATE UNIQUE INDEX "Payment_raffleId_key" ON "Payment"("raffleId");

-- CreateIndex
CREATE INDEX "Payment_status_idx" ON "Payment"("status");

-- CreateIndex
CREATE INDEX "Payment_providerPaymentId_idx" ON "Payment"("providerPaymentId");

-- CreateIndex
CREATE INDEX "Payment_raffleId_idx" ON "Payment"("raffleId");

-- AddForeignKey
ALTER TABLE "Raffle" ADD CONSTRAINT "Raffle_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuantityDiscount" ADD CONSTRAINT "QuantityDiscount_raffleId_fkey" FOREIGN KEY ("raffleId") REFERENCES "Raffle"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_raffleId_fkey" FOREIGN KEY ("raffleId") REFERENCES "Raffle"("id") ON DELETE SET NULL ON UPDATE CASCADE;
