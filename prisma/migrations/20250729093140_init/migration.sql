/*
  Warnings:

  - The primary key for the `Lab` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[labId]` on the table `Lab` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Lab" DROP CONSTRAINT "Lab_pkey",
ADD CONSTRAINT "Lab_pkey" PRIMARY KEY ("labId");

-- CreateIndex
CREATE UNIQUE INDEX "Lab_labId_key" ON "Lab"("labId");
