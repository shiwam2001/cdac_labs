/*
  Warnings:

  - The `status` column on the `TransferRequest` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "public"."TransferRequest" DROP COLUMN "status",
ADD COLUMN     "status" "public"."Action" NOT NULL DEFAULT 'PENDING';
