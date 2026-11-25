-- CreateTable
CREATE TABLE "SharedMatch" (
    "id" TEXT NOT NULL,
    "profileAId" TEXT NOT NULL,
    "profileBId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SharedMatch_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "SharedMatch_profileBId_idx" ON "SharedMatch"("profileBId");

-- CreateIndex
CREATE UNIQUE INDEX "SharedMatch_profileAId_profileBId_key" ON "SharedMatch"("profileAId", "profileBId");

-- AddForeignKey
ALTER TABLE "SharedMatch" ADD CONSTRAINT "SharedMatch_profileAId_fkey" FOREIGN KEY ("profileAId") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SharedMatch" ADD CONSTRAINT "SharedMatch_profileBId_fkey" FOREIGN KEY ("profileBId") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
