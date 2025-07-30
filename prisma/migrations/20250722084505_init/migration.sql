-- CreateTable
CREATE TABLE "Lab" (
    "labNumber" INTEGER NOT NULL,
    "labName" TEXT NOT NULL,
    "custodianName" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Lab_pkey" PRIMARY KEY ("labNumber")
);

-- CreateIndex
CREATE UNIQUE INDEX "Lab_labNumber_key" ON "Lab"("labNumber");
