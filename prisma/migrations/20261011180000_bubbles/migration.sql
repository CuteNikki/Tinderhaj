-- Bubbles from the Discord bot in bot/: its voice channels, and how each owner left their last one.
-- CreateTable
CREATE TABLE "Bubble" (
    "channelId" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "panelMessageId" TEXT,
    "locked" BOOLEAN NOT NULL DEFAULT false,
    "hidden" BOOLEAN NOT NULL DEFAULT false,
    "allowed" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "blocked" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Bubble_pkey" PRIMARY KEY ("channelId")
);

-- CreateTable
CREATE TABLE "BubbleSettings" (
    "userId" TEXT NOT NULL,
    "name" TEXT,
    "userLimit" INTEGER NOT NULL DEFAULT 0,
    "locked" BOOLEAN NOT NULL DEFAULT false,
    "hidden" BOOLEAN NOT NULL DEFAULT false,
    "allowed" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "blocked" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BubbleSettings_pkey" PRIMARY KEY ("userId")
);

-- CreateIndex
CREATE INDEX "Bubble_ownerId_idx" ON "Bubble"("ownerId");

