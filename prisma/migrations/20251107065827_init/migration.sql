/*
  Warnings:

  - Changed the type of `fromLabId` on the `TransferRequest` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `toLabId` on the `TransferRequest` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `fromDeptId` on the `TransferRequest` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `toDeptId` on the `TransferRequest` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "public"."TransferRequest" DROP COLUMN "fromLabId",
ADD COLUMN     "fromLabId" INTEGER NOT NULL,
DROP COLUMN "toLabId",
ADD COLUMN     "toLabId" INTEGER NOT NULL,
DROP COLUMN "fromDeptId",
ADD COLUMN     "fromDeptId" INTEGER NOT NULL,
DROP COLUMN "toDeptId",
ADD COLUMN     "toDeptId" INTEGER NOT NULL;
