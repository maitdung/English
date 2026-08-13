import WritingReviewPanel from "../features/writing/components/WritingReviewPanel";
import type { WritingReview } from "../lib/api/writing-api";

export type AIReviewProps = {
  result?: WritingReview | null;
  isAnalyzing?: boolean;
};

/**
 * Compatibility wrapper for the earlier WIP import path.
 * The full editor and request lifecycle now live on WritingPage.
 */
export function AIReview({
  result = null,
  isAnalyzing = false,
}: AIReviewProps) {
  return (
    <WritingReviewPanel review={result} isLoading={isAnalyzing} />
  );
}

export default AIReview;
