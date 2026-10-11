-- Moderations on the Discord server, for each member's history in the bot (bot/).
-- CreateEnum
CREATE TYPE "ModerationAction" AS ENUM ('WARN', 'TIMEOUT', 'UNTIMEOUT', 'KICK', 'BAN', 'UNBAN');

-- CreateTable
CREATE TABLE "Moderation" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "moderatorId" TEXT NOT NULL,
    "action" "ModerationAction" NOT NULL,
    "reason" TEXT,
    "until" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Moderation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Moderation_userId_createdAt_idx" ON "Moderation"("userId", "createdAt");

