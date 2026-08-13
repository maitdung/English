import { CourseLevel } from '../../generated/prisma/client';
import { WritingTaskType } from './dto/review-writing.dto';

export const WRITING_REVIEW_SOURCES = [
  'openai',
  'xai',
  'gemini',
  'fallback',
] as const;

export const WRITING_CONSENT_VERSION = 'v1';

export type WritingReviewSource = (typeof WRITING_REVIEW_SOURCES)[number];

export type WritingCriterionKey =
  'taskAchievement' | 'coherence' | 'grammar' | 'vocabulary';

export interface WritingCriterion {
  key: WritingCriterionKey;
  labelVi: string;
  score: number;
  feedbackVi: string;
}

export interface WritingCorrection {
  original: string;
  corrected: string;
  explanationVi: string;
  category: 'grammar' | 'spelling' | 'punctuation' | 'style';
}

export interface VocabularySuggestion {
  original: string;
  suggestion: string;
  meaningVi: string;
  example: string;
}

export interface WritingAssessment {
  overallScore: number;
  cefrEstimate: CourseLevel;
  summaryVi: string;
  criteria: WritingCriterion[];
  corrections: WritingCorrection[];
  strengths: string[];
  priorities: string[];
  improvedVersion: string;
  vocabularySuggestions: VocabularySuggestion[];
  source: WritingReviewSource;
}

export interface WritingReviewResult extends WritingAssessment {
  id: string;
  reviewedAt: Date;
  taskType: WritingTaskType;
  level: CourseLevel;
  prompt: string | null;
  content: string;
  targetWords: number | null;
  wordCount: number;
  aiConsentAt: Date | null;
  aiConsentVersion: string | null;
}

export type WritingHistoryItem = Pick<
  WritingReviewResult,
  | 'id'
  | 'reviewedAt'
  | 'taskType'
  | 'level'
  | 'prompt'
  | 'wordCount'
  | 'overallScore'
  | 'cefrEstimate'
  | 'source'
>;

export interface WritingHistoryResult {
  items: WritingHistoryItem[];
  total: number;
  limit: number;
  offset: number;
}

export interface WritingExportResult {
  exportedAt: Date;
  retentionDays: number;
  items: WritingReviewResult[];
}

export interface WritingPolicyResult {
  retentionDays: number;
  consentVersion: typeof WRITING_CONSENT_VERSION;
  configuredProviders: Exclude<WritingReviewSource, 'fallback'>[];
  localFallbackAvailable: true;
}
