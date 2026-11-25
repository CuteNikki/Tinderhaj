-- AlterTable
ALTER TABLE "User" ADD COLUMN     "birthdayEmails" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "heartsEmails" BOOLEAN NOT NULL DEFAULT true;

-- CreateTable
CREATE TABLE "SentEmail" (
    "id" TEXT NOT NULL,
    "kind" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SentEmail_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SentEmail_kind_key_key" ON "SentEmail"("kind", "key");
