-- CreateTable
CREATE TABLE "AssignedLab" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "labId" INTEGER NOT NULL,

    CONSTRAINT "AssignedLab_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AssignedLab_email_labId_key" ON "AssignedLab"("email", "labId");

-- AddForeignKey
ALTER TABLE "AssignedLab" ADD CONSTRAINT "AssignedLab_email_fkey" FOREIGN KEY ("email") REFERENCES "User"("email") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssignedLab" ADD CONSTRAINT "AssignedLab_labId_fkey" FOREIGN KEY ("labId") REFERENCES "Lab"("labId") ON DELETE RESTRICT ON UPDATE CASCADE;
