/*
  Warnings:

  - You are about to drop the `TransferRequest` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."TransferRequest" DROP CONSTRAINT "TransferRequest_itemId_fkey";

-- DropTable
DROP TABLE "public"."TransferRequest";

-- CreateTable
CREATE TABLE "public"."transfer_requests" (
    "id" TEXT NOT NULL,
    "itemId" INTEGER NOT NULL,
    "fromLabId" INTEGER NOT NULL,
    "toLabId" INTEGER NOT NULL,
    "fromDeptId" INTEGER NOT NULL,
    "toDeptId" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,
    "status" "public"."Action" NOT NULL DEFAULT 'PENDING',
    "activety" "public"."Activety" NOT NULL DEFAULT 'TRANSFER',
    "requestedBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "transfer_requests_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."transfer_requests" ADD CONSTRAINT "transfer_requests_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "public"."items"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."transfer_requests" ADD CONSTRAINT "transfer_requests_fromLabId_fkey" FOREIGN KEY ("fromLabId") REFERENCES "public"."Lab"("labId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."transfer_requests" ADD CONSTRAINT "transfer_requests_toLabId_fkey" FOREIGN KEY ("toLabId") REFERENCES "public"."Lab"("labId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."transfer_requests" ADD CONSTRAINT "transfer_requests_fromDeptId_fkey" FOREIGN KEY ("fromDeptId") REFERENCES "public"."Department"("departmentId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."transfer_requests" ADD CONSTRAINT "transfer_requests_toDeptId_fkey" FOREIGN KEY ("toDeptId") REFERENCES "public"."Department"("departmentId") ON DELETE RESTRICT ON UPDATE CASCADE;
