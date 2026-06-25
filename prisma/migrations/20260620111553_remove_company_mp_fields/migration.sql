/*
  Warnings:

  - You are about to drop the column `mpAccessToken` on the `Company` table. All the data in the column will be lost.
  - You are about to drop the column `mpRefreshToken` on the `Company` table. All the data in the column will be lost.
  - You are about to drop the column `mpTokenExpiresAt` on the `Company` table. All the data in the column will be lost.
  - You are about to drop the column `mpUserId` on the `Company` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Company" DROP COLUMN "mpAccessToken",
DROP COLUMN "mpRefreshToken",
DROP COLUMN "mpTokenExpiresAt",
DROP COLUMN "mpUserId";
