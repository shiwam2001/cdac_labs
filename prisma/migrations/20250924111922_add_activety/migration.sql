-- CreateEnum
CREATE TYPE "public"."Activety" AS ENUM ('DELETE', 'UPDATE', 'TRANSFER', 'ADDED');

-- AlterTable
ALTER TABLE "public"."items" ADD COLUMN     "activety" "public"."Activety" NOT NULL DEFAULT 'ADDED';
