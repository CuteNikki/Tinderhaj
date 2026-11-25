-- AlterTable
ALTER TABLE "User" ADD COLUMN     "featuredEmails" BOOLEAN NOT NULL DEFAULT true;

-- CreateTable
CREATE TABLE "SharkOfTheWeek" (
    "id" TEXT NOT NULL,
    "week" TEXT NOT NULL,
    "profileId" TEXT NOT NULL,
    "skipped" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SharkOfTheWeek_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "SharkOfTheWeek_profileId_idx" ON "SharkOfTheWeek"("profileId");

-- CreateIndex
CREATE UNIQUE INDEX "SharkOfTheWeek_week_profileId_key" ON "SharkOfTheWeek"("week", "profileId");

-- AddForeignKey
ALTER TABLE "SharkOfTheWeek" ADD CONSTRAINT "SharkOfTheWeek_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
