-- Existing submissions predate explicit consent capture, so the new audit
-- fields remain nullable for those legacy rows. New writes always populate both.
ALTER TABLE "writing_submissions"
ADD COLUMN "aiConsentAt" TIMESTAMP(3),
ADD COLUMN "aiConsentVersion" VARCHAR(32);

ALTER TABLE "writing_submissions"
ADD CONSTRAINT "writing_submissions_aiConsent_pair_check"
CHECK (
  ("aiConsentAt" IS NULL AND "aiConsentVersion" IS NULL)
  OR
  ("aiConsentAt" IS NOT NULL AND "aiConsentVersion" IS NOT NULL AND length("aiConsentVersion") > 0)
);

CREATE INDEX "writing_submissions_reviewedAt_idx"
ON "writing_submissions"("reviewedAt");
