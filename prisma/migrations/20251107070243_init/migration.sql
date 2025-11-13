/*
  Warnings:

  - Added the required column `quantity` to the `TransferRequest` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."TransferRequest" ADD COLUMN     "quantity" INTEGER NOT NULL;
