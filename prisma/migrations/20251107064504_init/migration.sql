-- CreateTable
CREATE TABLE "public"."TransferRequest" (
    "id" TEXT NOT NULL,
    "itemId" INTEGER NOT NULL,
    "fromLabId" TEXT NOT NULL,
    "toLabId" TEXT NOT NULL,
    "fromDeptId" TEXT NOT NULL,
    "toDeptId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TransferRequest_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."TransferRequest" ADD CONSTRAINT "TransferRequest_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "public"."items"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
