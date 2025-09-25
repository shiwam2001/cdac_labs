/*
  Warnings:

  - You are about to drop the `_LabToUser` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."_LabToUser" DROP CONSTRAINT "_LabToUser_A_fkey";

-- DropForeignKey
ALTER TABLE "public"."_LabToUser" DROP CONSTRAINT "_LabToUser_B_fkey";

-- AlterTable
ALTER TABLE "public"."Lab" ADD COLUMN     "custodianId" TEXT;

-- DropTable
DROP TABLE "public"."_LabToUser";

-- CreateTable
CREATE TABLE "public"."items" (
    "id" SERIAL NOT NULL,
    "departmentId" INTEGER NOT NULL,
    "labId" INTEGER NOT NULL,
    "assignedUserId" INTEGER NOT NULL,
    "custodianName" TEXT NOT NULL,
    "deviceNumber" TEXT NOT NULL,
    "deviceType" TEXT NOT NULL,
    "dateNow" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dateTill" TIMESTAMP(3),
    "status" "public"."Action" NOT NULL DEFAULT 'PENDING',

    CONSTRAINT "items_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."Lab" ADD CONSTRAINT "Lab_custodianId_fkey" FOREIGN KEY ("custodianId") REFERENCES "public"."User"("email") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."items" ADD CONSTRAINT "items_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "public"."Department"("departmentId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."items" ADD CONSTRAINT "items_labId_fkey" FOREIGN KEY ("labId") REFERENCES "public"."Lab"("labId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."items" ADD CONSTRAINT "items_assignedUserId_fkey" FOREIGN KEY ("assignedUserId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
