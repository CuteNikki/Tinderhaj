-- CreateTable
CREATE TABLE "Heart" (
    "id" TEXT NOT NULL,
    "fromProfileId" TEXT NOT NULL,
    "toProfileId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "seenAt" TIMESTAMP(3),

    CONSTRAINT "Heart_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Heart_toProfileId_idx" ON "Heart"("toProfileId");

-- CreateIndex
CREATE UNIQUE INDEX "Heart_fromProfileId_toProfileId_key" ON "Heart"("fromProfileId", "toProfileId");

-- AddForeignKey
ALTER TABLE "Heart" ADD CONSTRAINT "Heart_fromProfileId_fkey" FOREIGN KEY ("fromProfileId") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Heart" ADD CONSTRAINT "Heart_toProfileId_fkey" FOREIGN KEY ("toProfileId") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

