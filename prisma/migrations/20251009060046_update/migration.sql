/*
  Warnings:

  - You are about to drop the column `actionAt` on the `items` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."items" DROP COLUMN "actionAt",
ADD COLUMN     "updateAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
