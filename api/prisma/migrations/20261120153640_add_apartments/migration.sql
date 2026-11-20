/*
  Warnings:

  - You are about to drop the column `apartment` on the `Resident` table. All the data in the column will be lost.
  - You are about to drop the column `block` on the `Resident` table. All the data in the column will be lost.
  - Added the required column `apartmentId` to the `Resident` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Resident_block_apartment_idx";

-- AlterTable
ALTER TABLE "Resident" DROP COLUMN "apartment",
DROP COLUMN "block",
ADD COLUMN     "apartmentId" UUID NOT NULL;

-- CreateTable
CREATE TABLE "Apartment" (
    "id" UUID NOT NULL,
    "block" TEXT NOT NULL,
    "number" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Apartment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Apartment_block_number_key" ON "Apartment"("block", "number");

-- CreateIndex
CREATE INDEX "Resident_apartmentId_idx" ON "Resident"("apartmentId");

-- AddForeignKey
ALTER TABLE "Resident" ADD CONSTRAINT "Resident_apartmentId_fkey" FOREIGN KEY ("apartmentId") REFERENCES "Apartment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
