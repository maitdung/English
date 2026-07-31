ALTER TABLE "users"
ADD COLUMN "passwordResetTokenHash" TEXT,
ADD COLUMN "passwordResetExpiresAt" TIMESTAMP(3);

CREATE UNIQUE INDEX "users_passwordResetTokenHash_key"
ON "users"("passwordResetTokenHash");
