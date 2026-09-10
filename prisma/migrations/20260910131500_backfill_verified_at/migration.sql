UPDATE "Profile"
SET "verifiedAt" = COALESCE("submittedAt", "createdAt")
WHERE "status" = 'VERIFIED'
  AND "verifiedAt" IS NULL;
