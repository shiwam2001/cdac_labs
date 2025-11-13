-- AlterTable
ALTER TABLE "public"."items" ADD COLUMN     "transferedUserId" INTEGER;

-- AddForeignKey
ALTER TABLE "public"."items" ADD CONSTRAINT "items_transferedUserId_fkey" FOREIGN KEY ("transferedUserId") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
