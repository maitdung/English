-- CreateTable
CREATE TABLE "writing_submissions" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "taskType" TEXT NOT NULL,
    "level" "CourseLevel" NOT NULL,
    "prompt" TEXT,
    "content" TEXT NOT NULL,
    "targetWords" INTEGER,
    "wordCount" INTEGER NOT NULL,
    "overallScore" INTEGER NOT NULL,
    "cefrEstimate" "CourseLevel" NOT NULL,
    "summaryVi" TEXT NOT NULL,
    "criteria" JSONB NOT NULL,
    "corrections" JSONB NOT NULL,
    "strengths" JSONB NOT NULL,
    "priorities" JSONB NOT NULL,
    "improvedVersion" TEXT NOT NULL,
    "vocabularySuggestions" JSONB NOT NULL,
    "source" TEXT NOT NULL,
    "reviewedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "writing_submissions_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "writing_submissions_taskType_check" CHECK ("taskType" IN ('general', 'email', 'essay', 'toeic', 'ielts')),
    CONSTRAINT "writing_submissions_source_check" CHECK ("source" IN ('openai', 'xai', 'gemini', 'fallback')),
    CONSTRAINT "writing_submissions_wordCount_check" CHECK ("wordCount" >= 0),
    CONSTRAINT "writing_submissions_overallScore_check" CHECK ("overallScore" BETWEEN 0 AND 100),
    CONSTRAINT "writing_submissions_targetWords_check" CHECK ("targetWords" IS NULL OR "targetWords" BETWEEN 30 AND 2000)
);

-- CreateIndex
CREATE INDEX "writing_submissions_userId_reviewedAt_idx" ON "writing_submissions"("userId", "reviewedAt" DESC);

-- CreateIndex
CREATE INDEX "writing_submissions_userId_taskType_idx" ON "writing_submissions"("userId", "taskType");

-- AddForeignKey
ALTER TABLE "writing_submissions" ADD CONSTRAINT "writing_submissions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
