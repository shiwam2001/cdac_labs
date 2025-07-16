/*
  Warnings:

  - You are about to drop the column `is_approved` on the `User` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "Action" AS ENUM ('PENDING', 'REJECTED', 'APPROVED');

-- AlterTable
ALTER TABLE "User" DROP COLUMN "is_approved",
ADD COLUMN     "action" "Action" NOT NULL DEFAULT 'PENDING';
