/** Number of questions and time limit in the standard TOEIC Listening & Reading test. */
export const TOEIC_QUESTION_COUNT = 200;
export const TOEIC_EXAM_DURATION_MINUTES = 120;
export const TOEIC_EXAM_DURATION_SECONDS =
  TOEIC_EXAM_DURATION_MINUTES * 60;

const LAST_QUESTION_INDEX = TOEIC_QUESTION_COUNT - 1;

export interface ExamState {
  /** Zero-based index used by the question renderer. */
  readonly currentQuestionIndex: number;
  /** Selected option by zero-based question index. */
  readonly answers: Readonly<Record<number, number>>;
  /** Optional grading result for answers that have already been checked. */
  readonly gradedAnswers: Readonly<Record<number, boolean>>;
  readonly score: number;
  /** Remaining exam time in seconds. */
  readonly timeLeft: number;
  readonly isFinished: boolean;
  /** Dense answer sheet for rendering all 200 question status buttons. */
  readonly selectedOptions: ReadonlyArray<number | null>;
}

export type ExamAction =
  | { readonly type: "NEXT_QUESTION" }
  | { readonly type: "PREVIOUS_QUESTION" }
  | { readonly type: "GO_TO_QUESTION"; readonly questionIndex: number }
  | {
      readonly type: "MARK_ANSWER";
      readonly optionIndex: number;
      readonly questionIndex?: number;
      readonly isCorrect?: boolean;
    }
  | { readonly type: "CLEAR_ANSWER"; readonly questionIndex?: number }
  | { readonly type: "TICK"; readonly seconds?: number }
  | { readonly type: "FINISH" }
  | { readonly type: "RESET"; readonly durationSeconds?: number };

function normalizeDuration(durationSeconds: number | undefined): number {
  if (
    durationSeconds === undefined ||
    !Number.isFinite(durationSeconds) ||
    durationSeconds <= 0
  ) {
    return TOEIC_EXAM_DURATION_SECONDS;
  }

  return Math.max(1, Math.trunc(durationSeconds));
}

function isValidOptionIndex(optionIndex: number): boolean {
  return Number.isInteger(optionIndex) && optionIndex >= 0;
}

export function isQuestionIndexInBounds(questionIndex: number): boolean {
  return (
    Number.isInteger(questionIndex) &&
    questionIndex >= 0 &&
    questionIndex < TOEIC_QUESTION_COUNT
  );
}

export function clampQuestionIndex(questionIndex: number): number {
  if (Number.isNaN(questionIndex) || questionIndex === Number.NEGATIVE_INFINITY) {
    return 0;
  }

  if (questionIndex === Number.POSITIVE_INFINITY) {
    return LAST_QUESTION_INDEX;
  }

  return Math.min(
    LAST_QUESTION_INDEX,
    Math.max(0, Math.trunc(questionIndex)),
  );
}

export function createInitialExamState(
  durationSeconds = TOEIC_EXAM_DURATION_SECONDS,
): ExamState {
  return {
    currentQuestionIndex: 0,
    answers: {},
    gradedAnswers: {},
    score: 0,
    timeLeft: normalizeDuration(durationSeconds),
    isFinished: false,
    selectedOptions: Array<number | null>(TOEIC_QUESTION_COUNT).fill(null),
  };
}

export const initialExamState = createInitialExamState();

export function finishExam(state: ExamState): ExamState {
  return state.isFinished ? state : { ...state, isFinished: true };
}

function markAnswer(
  state: ExamState,
  questionIndex: number,
  optionIndex: number,
  isCorrect: boolean | undefined,
): ExamState {
  if (
    !isQuestionIndexInBounds(questionIndex) ||
    !isValidOptionIndex(optionIndex)
  ) {
    return state;
  }

  const answers = { ...state.answers, [questionIndex]: optionIndex };
  const selectedOptions = [...state.selectedOptions];
  selectedOptions[questionIndex] = optionIndex;

  const gradedAnswers = { ...state.gradedAnswers };
  const previousGrade = gradedAnswers[questionIndex];
  let score = state.score - (previousGrade === true ? 1 : 0);

  if (isCorrect === undefined) {
    delete gradedAnswers[questionIndex];
  } else {
    gradedAnswers[questionIndex] = isCorrect;
    score += isCorrect ? 1 : 0;
  }

  return {
    ...state,
    answers,
    gradedAnswers,
    score,
    selectedOptions,
  };
}

function clearAnswer(state: ExamState, questionIndex: number): ExamState {
  if (
    !isQuestionIndexInBounds(questionIndex) ||
    state.answers[questionIndex] === undefined
  ) {
    return state;
  }

  const answers = { ...state.answers };
  const gradedAnswers = { ...state.gradedAnswers };
  const previousGrade = gradedAnswers[questionIndex];
  const selectedOptions = [...state.selectedOptions];

  delete answers[questionIndex];
  delete gradedAnswers[questionIndex];
  selectedOptions[questionIndex] = null;

  return {
    ...state,
    answers,
    gradedAnswers,
    score: state.score - (previousGrade === true ? 1 : 0),
    selectedOptions,
  };
}

export function examReducer(state: ExamState, action: ExamAction): ExamState {
  if (action.type === "RESET") {
    return createInitialExamState(action.durationSeconds);
  }

  if (state.isFinished) {
    return state;
  }

  switch (action.type) {
    case "NEXT_QUESTION":
      return {
        ...state,
        currentQuestionIndex: clampQuestionIndex(
          state.currentQuestionIndex + 1,
        ),
      };

    case "PREVIOUS_QUESTION":
      return {
        ...state,
        currentQuestionIndex: clampQuestionIndex(
          state.currentQuestionIndex - 1,
        ),
      };

    case "GO_TO_QUESTION":
      return {
        ...state,
        currentQuestionIndex: clampQuestionIndex(action.questionIndex),
      };

    case "MARK_ANSWER":
      return markAnswer(
        state,
        action.questionIndex ?? state.currentQuestionIndex,
        action.optionIndex,
        action.isCorrect,
      );

    case "CLEAR_ANSWER":
      return clearAnswer(
        state,
        action.questionIndex ?? state.currentQuestionIndex,
      );

    case "TICK": {
      const elapsedSeconds = action.seconds ?? 1;
      if (!Number.isFinite(elapsedSeconds) || elapsedSeconds <= 0) {
        return state;
      }

      const timeLeft = Math.max(
        0,
        state.timeLeft - Math.max(1, Math.trunc(elapsedSeconds)),
      );

      return {
        ...state,
        timeLeft,
        isFinished: timeLeft === 0,
      };
    }

    case "FINISH":
      return finishExam(state);
  }
}

export function getAnsweredCount(state: ExamState): number {
  return Object.keys(state.answers).length;
}

export function getUnansweredQuestionIndexes(state: ExamState): number[] {
  return Array.from({ length: TOEIC_QUESTION_COUNT }, (_, index) => index).filter(
    (questionIndex) => state.answers[questionIndex] === undefined,
  );
}

export function getExamProgress(state: ExamState): number {
  return Math.round((getAnsweredCount(state) / TOEIC_QUESTION_COUNT) * 100);
}

export function calculateScore(
  answers: Readonly<Record<number, number>>,
  answerKey: Readonly<Record<number, number>>,
): number {
  return Object.entries(answers).reduce((score, [questionIndex, optionIndex]) => {
    const parsedQuestionIndex = Number(questionIndex);
    return isQuestionIndexInBounds(parsedQuestionIndex) &&
      answerKey[parsedQuestionIndex] === optionIndex
      ? score + 1
      : score;
  }, 0);
}

export function formatExamTime(timeLeftSeconds: number): string {
  const safeSeconds = Number.isFinite(timeLeftSeconds)
    ? Math.max(0, Math.trunc(timeLeftSeconds))
    : 0;
  const hours = Math.floor(safeSeconds / 3600);
  const minutes = Math.floor((safeSeconds % 3600) / 60);
  const seconds = safeSeconds % 60;
  const minuteAndSecond = `${String(minutes).padStart(2, "0")}:${String(
    seconds,
  ).padStart(2, "0")}`;

  return hours > 0
    ? `${String(hours).padStart(2, "0")}:${minuteAndSecond}`
    : minuteAndSecond;
}

export default examReducer;
