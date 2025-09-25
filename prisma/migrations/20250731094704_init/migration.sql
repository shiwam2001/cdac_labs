/*
  Warnings:

  - The primary key for the `Lab` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `department` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `labId` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[labId]` on the table `Lab` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `departmentId` to the `Lab` table without a default value. This is not possible if the table is not empty.
  - Added the required column `departmentId` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_labId_fkey";

-- DropIndex
DROP INDEX "Lab_labNumber_key";

-- DropIndex
DROP INDEX "User_labId_key";

-- AlterTable
ALTER TABLE "Lab" DROP CONSTRAINT "Lab_pkey",
ADD COLUMN     "departmentId" INTEGER NOT NULL,
ALTER COLUMN "labNumber" DROP NOT NULL,
ALTER COLUMN "labName" DROP NOT NULL,
ADD CONSTRAINT "Lab_pkey" PRIMARY KEY ("labId");

-- AlterTable
ALTER TABLE "User" DROP COLUMN "department",
DROP COLUMN "labId",
ADD COLUMN     "departmentId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "Department" (
    "departmentId" SERIAL NOT NULL,
    "department_Name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Department_pkey" PRIMARY KEY ("departmentId")
);

-- CreateTable
CREATE TABLE "_LabToUser" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_LabToUser_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "Department_departmentId_key" ON "Department"("departmentId");

-- CreateIndex
CREATE UNIQUE INDEX "Department_department_Name_key" ON "Department"("department_Name");

-- CreateIndex
CREATE INDEX "_LabToUser_B_index" ON "_LabToUser"("B");

-- CreateIndex
CREATE UNIQUE INDEX "Lab_labId_key" ON "Lab"("labId");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "Department"("departmentId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lab" ADD CONSTRAINT "Lab_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "Department"("departmentId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_LabToUser" ADD CONSTRAINT "_LabToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Lab"("labId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_LabToUser" ADD CONSTRAINT "_LabToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
