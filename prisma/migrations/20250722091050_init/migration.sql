/*
  Warnings:

  - A unique constraint covering the columns `[labId]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Lab" ADD COLUMN     "labId" SERIAL NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "labId" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "User_labId_key" ON "User"("labId");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_labId_fkey" FOREIGN KEY ("labId") REFERENCES "Lab"("labNumber") ON DELETE SET NULL ON UPDATE CASCADE;
