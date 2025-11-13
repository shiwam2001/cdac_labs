-- DropForeignKey
ALTER TABLE "public"."items" DROP CONSTRAINT "items_assignedUserId_fkey";

-- AlterTable
ALTER TABLE "public"."items" ALTER COLUMN "assignedUserId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."items" ADD CONSTRAINT "items_assignedUserId_fkey" FOREIGN KEY ("assignedUserId") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
