-- AlterTable
ALTER TABLE "Profile" ADD COLUMN     "rejectedFields" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "rejectionNote" TEXT;
