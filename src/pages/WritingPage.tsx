import {
  type FormEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Link } from "react-router-dom";

import WritingReviewPanel from "../features/writing/components/WritingReviewPanel";
import {
  cefrLevelDescriptions,
  writingPresets,
  writingTaskConfig,
} from "../features/writing/data/writing-prompts";
import { useAuth } from "../features/auth/context/AuthContext";
import {
  cefrLevels,
  deleteWritingHistoryRequest,
  deleteWritingReviewRequest,
  exportWritingHistoryRequest,
  getWritingHistoryRequest,
  getWritingPolicyRequest,
  getWritingReviewRequest,
  reviewWritingRequest,
  writingTaskTypes,
  type CefrLevel,
  type WritingHistoryItem,
  type WritingPolicy,
  type WritingReview,
  type WritingTaskType,
} from "../lib/api/writing-api";

type Draft = {
  taskType: WritingTaskType;
  level: CefrLevel;
  prompt: string;
  content: string;
  targetWords: number;
};

type SaveStatus = "idle" | "saving" | "saved";
type MobilePanel = "editor" | "review";

const HISTORY_PAGE_SIZE = 20;
const FALLBACK_POLICY: WritingPolicy = {
  retentionDays: 365,
  consentVersion: "v1",
  configuredProviders: [],
  localFallbackAvailable: true,
};

const DEFAULT_DRAFT: Draft = {
  taskType: "general",
  level: "B1",
  prompt: writingPresets[0].prompt,
  content: "",
  targetWords: writingPresets[0].targetWords,
};

function countWords(value: string): number {
  const normalizedValue = value.trim();
  return normalizedValue ? normalizedValue.split(/\s+/u).length : 0;
}

function countSentences(value: string): number {
  const normalizedValue = value.trim();

  if (!normalizedValue) {
    return 0;
  }

  const sentenceMatches = normalizedValue.match(/[^.!?]+[.!?]+|[^.!?]+$/gu);
  return sentenceMatches?.filter((item) => item.trim()).length ?? 0;
}

function readingTime(wordCount: number): string {
  if (wordCount === 0) {
    return "0 phút";
  }

  const minutes = Math.max(1, Math.ceil(wordCount / 180));
  return `${minutes} phút`;
}

function errorMessage(error: unknown): string {
  return error instanceof Error
    ? error.message
    : "Không thể chấm bài lúc này. Vui lòng thử lại.";
}

function formatHistoryDate(value: string): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Gần đây";
  }

  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function isWritingTaskType(value: unknown): value is WritingTaskType {
  return writingTaskTypes.some((item) => item === value);
}

function isCefrLevel(value: unknown): value is CefrLevel {
  return cefrLevels.some((item) => item === value);
}

function readDraft(storage: Storage, storageKey: string): Draft | null {
  try {
    const storedValue = storage.getItem(storageKey);

    if (!storedValue) {
      return null;
    }

    const value = JSON.parse(storedValue) as Partial<Draft>;

    if (!isWritingTaskType(value.taskType) || !isCefrLevel(value.level)) {
      return null;
    }

    return {
      taskType: value.taskType,
      level: value.level,
      prompt: typeof value.prompt === "string" ? value.prompt.slice(0, 2_000) : "",
      content:
        typeof value.content === "string" ? value.content.slice(0, 12_000) : "",
      targetWords:
        typeof value.targetWords === "number" && Number.isFinite(value.targetWords)
          ? Math.min(2_000, Math.max(30, Math.round(value.targetWords)))
          : DEFAULT_DRAFT.targetWords,
    };
  } catch {
    return null;
  }
}

function removeStorageItem(storage: Storage, storageKey: string): void {
  try {
    storage.removeItem(storageKey);
  } catch {
    // Browsers can block storage; clearing UI state should still succeed.
  }
}

function setStorageItem(
  storage: Storage,
  storageKey: string,
  value: string,
): void {
  try {
    storage.setItem(storageKey, value);
  } catch {
    // Storage is an optional convenience, never required to use the editor.
  }
}

function reviewToHistoryItem(review: WritingReview): WritingHistoryItem {
  return {
    id: review.id,
    reviewedAt: review.reviewedAt,
    taskType: review.taskType,
    level: review.level,
    prompt: review.prompt,
    wordCount: review.wordCount ?? countWords(review.content ?? ""),
    overallScore: review.overallScore,
    cefrEstimate: review.cefrEstimate,
    source: review.source,
  };
}

function sourceLabel(source: string): string {
  const labels: Record<string, string> = {
    openai: "OpenAI",
    xai: "xAI",
    gemini: "Google Gemini",
    fallback: "Chấm cục bộ",
  };

  return labels[source.toLowerCase()] ?? "Bộ chấm Writing";
}

function providerDisclosure(
  policy: WritingPolicy,
  hasCurrentPolicy: boolean,
): string {
  const providerNames = policy.configuredProviders.map(sourceLabel);

  if (providerNames.length === 0) {
    if (hasCurrentPolicy) {
      return "bộ chấm heuristic cục bộ; không có nhà cung cấp AI bên ngoài đang được cấu hình";
    }

    return "nhà cung cấp AI được cấu hình (OpenAI, xAI hoặc Google Gemini)";
  }

  return providerNames.join(", ");
}

function WritingWorkspace() {
  const { session, user } = useAuth();
  const [draft, setDraft] = useState<Draft>(DEFAULT_DRAFT);
  const [activeReview, setActiveReview] = useState<WritingReview | null>(null);
  const [history, setHistory] = useState<WritingHistoryItem[]>([]);
  const [historyTotal, setHistoryTotal] = useState(0);
  const [policy, setPolicy] = useState<WritingPolicy>(FALLBACK_POLICY);
  const [hasCurrentPolicy, setHasCurrentPolicy] = useState(false);
  const [consentAccepted, setConsentAccepted] = useState(false);
  const [hasAcknowledgedPolicy, setHasAcknowledgedPolicy] = useState(false);
  const [keepDraftOnDevice, setKeepDraftOnDevice] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isHistoryLoading, setIsHistoryLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [loadingReviewId, setLoadingReviewId] = useState<string | null>(null);
  const [deletingReviewId, setDeletingReviewId] = useState<string | null>(null);
  const [isDeletingHistory, setIsDeletingHistory] = useState(false);
  const [isExportingHistory, setIsExportingHistory] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [historyError, setHistoryError] = useState<string | null>(null);
  const [historyActionError, setHistoryActionError] = useState<string | null>(null);
  const [historyNotice, setHistoryNotice] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
  const [showPresets, setShowPresets] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [mobilePanel, setMobilePanel] = useState<MobilePanel>("editor");
  const [lastSubmittedDraft, setLastSubmittedDraft] = useState<Draft | null>(null);
  const hasLoadedDraftRef = useRef(false);
  const skipNextDraftSaveRef = useRef(false);
  const editorRef = useRef<HTMLTextAreaElement | null>(null);

  const draftStorageKey = `mtd-lingo-writing-draft:${user?.id ?? "guest"}`;
  const persistentDraftStorageKey = `${draftStorageKey}:persistent`;
  const consentAcknowledgementKey = `mtd-lingo-writing-consent:${user?.id ?? "guest"}:${policy.consentVersion}`;
  const wordCount = useMemo(() => countWords(draft.content), [draft.content]);
  const sentenceCount = useMemo(
    () => countSentences(draft.content),
    [draft.content],
  );
  const targetProgress = Math.min(
    100,
    Math.round((wordCount / Math.max(draft.targetWords, 1)) * 100),
  );
  const selectedTask = writingTaskConfig[draft.taskType];
  const filteredPresets = writingPresets.filter(
    (preset) => preset.taskType === draft.taskType,
  );
  const canSubmit =
    draft.content.trim().length >= 20 &&
    draft.content.length <= 12_000 &&
    draft.prompt.length <= 2_000 &&
    consentAccepted &&
    !isSubmitting;

  useEffect(() => {
    const sessionDraft = readDraft(window.sessionStorage, draftStorageKey);
    const persistentDraft = readDraft(
      window.localStorage,
      persistentDraftStorageKey,
    );
    const legacyDraft = readDraft(window.localStorage, draftStorageKey);
    const storedDraft = sessionDraft ?? persistentDraft ?? legacyDraft;

    // Older versions silently kept plaintext drafts in localStorage. Migrate
    // that value into session-only storage and remove the legacy copy.
    removeStorageItem(window.localStorage, draftStorageKey);

    if (legacyDraft && !sessionDraft && !persistentDraft) {
      setStorageItem(
        window.sessionStorage,
        draftStorageKey,
        JSON.stringify(legacyDraft),
      );
    }

    setDraft(storedDraft ?? DEFAULT_DRAFT);
    setKeepDraftOnDevice(Boolean(persistentDraft));
    hasLoadedDraftRef.current = true;
    setSaveStatus(storedDraft ? "saved" : "idle");
  }, [draftStorageKey, persistentDraftStorageKey]);

  useEffect(() => {
    if (!hasLoadedDraftRef.current) {
      return;
    }

    if (skipNextDraftSaveRef.current) {
      skipNextDraftSaveRef.current = false;
      removeStorageItem(window.sessionStorage, draftStorageKey);
      removeStorageItem(window.localStorage, draftStorageKey);
      removeStorageItem(window.localStorage, persistentDraftStorageKey);
      setSaveStatus("idle");
      return;
    }

    setSaveStatus("saving");
    const timeout = window.setTimeout(() => {
      try {
        const serializedDraft = JSON.stringify(draft);
        window.sessionStorage.setItem(draftStorageKey, serializedDraft);

        if (keepDraftOnDevice) {
          window.localStorage.setItem(persistentDraftStorageKey, serializedDraft);
        } else {
          removeStorageItem(window.localStorage, persistentDraftStorageKey);
        }

        removeStorageItem(window.localStorage, draftStorageKey);
        setSaveStatus("saved");
      } catch {
        setSaveStatus("idle");
      }
    }, 500);

    return () => window.clearTimeout(timeout);
  }, [draft, draftStorageKey, keepDraftOnDevice, persistentDraftStorageKey]);

  useEffect(() => {
    setConsentAccepted(false);

    try {
      setHasAcknowledgedPolicy(
        window.localStorage.getItem(consentAcknowledgementKey) !== null,
      );
    } catch {
      setHasAcknowledgedPolicy(false);
    }
  }, [consentAcknowledgementKey]);

  useEffect(() => {
    if (!session?.accessToken) {
      return;
    }

    let isActive = true;

    const loadPolicy = async () => {
      try {
        const nextPolicy = await getWritingPolicyRequest(session.accessToken);

        if (isActive) {
          setPolicy(nextPolicy);
          setHasCurrentPolicy(true);
        }
      } catch {
        if (isActive) {
          setPolicy(FALLBACK_POLICY);
          setHasCurrentPolicy(false);
        }
      }
    };

    void loadPolicy();

    return () => {
      isActive = false;
    };
  }, [session?.accessToken]);

  const loadHistory = useCallback(async (offset = 0) => {
    if (!session?.accessToken) {
      setIsHistoryLoading(false);
      return;
    }

    const isFirstPage = offset === 0;

    if (isFirstPage) {
      setIsHistoryLoading(true);
    } else {
      setIsLoadingMore(true);
    }

    setHistoryError(null);
    setHistoryActionError(null);

    try {
      const page = await getWritingHistoryRequest(session.accessToken, {
        limit: HISTORY_PAGE_SIZE,
        offset,
      });

      setHistory((currentHistory) => {
        if (isFirstPage) {
          return page.items;
        }

        const knownIds = new Set(currentHistory.map((item) => item.id));
        return [
          ...currentHistory,
          ...page.items.filter((item) => !knownIds.has(item.id)),
        ];
      });
      setHistoryTotal(page.total);
    } catch (error) {
      setHistoryError(errorMessage(error));
    } finally {
      if (isFirstPage) {
        setIsHistoryLoading(false);
      } else {
        setIsLoadingMore(false);
      }
    }
  }, [session?.accessToken]);

  useEffect(() => {
    void loadHistory(0);
  }, [loadHistory]);

  useEffect(() => {
    if (!showHistory) {
      return undefined;
    }

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setShowHistory(false);
      }
    };

    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [showHistory]);

  const updateDraft = <Key extends keyof Draft>(key: Key, value: Draft[Key]) => {
    setDraft((currentDraft) => ({ ...currentDraft, [key]: value }));
    setSubmitError(null);
  };

  const updateConsent = (accepted: boolean) => {
    setConsentAccepted(accepted);
    setSubmitError(null);

    if (!accepted) {
      return;
    }

    try {
      window.localStorage.setItem(
        consentAcknowledgementKey,
        JSON.stringify({ acknowledgedAt: new Date().toISOString() }),
      );
      setHasAcknowledgedPolicy(true);
    } catch {
      // Consent still applies to this request even if this device blocks storage.
    }
  };

  const clearLocalDraft = () => {
    if (
      draft.content.trim() &&
      !window.confirm(
        "Xóa nội dung đang viết và mọi bản nháp của Writing trên thiết bị này?",
      )
    ) {
      return;
    }

    skipNextDraftSaveRef.current = true;
    removeStorageItem(window.sessionStorage, draftStorageKey);
    removeStorageItem(window.localStorage, draftStorageKey);
    removeStorageItem(window.localStorage, persistentDraftStorageKey);
    setKeepDraftOnDevice(false);
    setDraft((currentDraft) => ({ ...currentDraft, content: "" }));
    setSaveStatus("idle");
    setSubmitError(null);
    window.setTimeout(() => editorRef.current?.focus(), 0);
  };

  const selectTaskType = (taskType: WritingTaskType) => {
    const firstPreset = writingPresets.find(
      (preset) => preset.taskType === taskType,
    );

    setDraft((currentDraft) => ({
      ...currentDraft,
      taskType,
      prompt: firstPreset?.prompt ?? "",
      targetWords: firstPreset?.targetWords ?? currentDraft.targetWords,
    }));
    setActiveReview(null);
    setSubmitError(null);
  };

  const applyPreset = (presetId: string) => {
    const preset = writingPresets.find((item) => item.id === presetId);

    if (!preset) {
      return;
    }

    setDraft((currentDraft) => ({
      ...currentDraft,
      taskType: preset.taskType,
      level: preset.levelHint,
      prompt: preset.prompt,
      targetWords: preset.targetWords,
    }));
    setShowPresets(false);
    setSubmitError(null);
    window.setTimeout(() => editorRef.current?.focus(), 0);
  };

  const handleSubmit = async (
    event?: FormEvent,
    draftOverride?: Draft,
  ) => {
    event?.preventDefault();
    const submittedDraft = draftOverride ?? { ...draft };

    if (!session?.accessToken) {
      setSubmitError("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
      return;
    }

    if (submittedDraft.content.trim().length < 20) {
      setSubmitError("Hãy viết ít nhất 20 ký tự để hệ thống có đủ dữ liệu phân tích.");
      editorRef.current?.focus();
      return;
    }

    if (!consentAccepted) {
      setSubmitError(
        "Bạn cần xác nhận việc lưu và xử lý nội dung trước khi gửi chấm.",
      );
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);
    setLastSubmittedDraft(submittedDraft);
    setMobilePanel("review");

    try {
      const review = await reviewWritingRequest(
        {
          taskType: submittedDraft.taskType,
          level: submittedDraft.level,
          prompt: submittedDraft.prompt.trim(),
          content: submittedDraft.content.trim(),
          targetWords: submittedDraft.targetWords,
          consent: true,
        },
        session.accessToken,
      );

      setActiveReview(review);
      setHistory((currentHistory) => [
        reviewToHistoryItem(review),
        ...currentHistory.filter((item) => item.id !== review.id),
      ]);
      setHistoryTotal((currentTotal) => currentTotal + 1);
      removeStorageItem(window.sessionStorage, draftStorageKey);
      removeStorageItem(window.localStorage, draftStorageKey);
      removeStorageItem(window.localStorage, persistentDraftStorageKey);
      setSaveStatus("idle");
      setConsentAccepted(false);
    } catch (error) {
      setSubmitError(errorMessage(error));
      setMobilePanel("editor");
    } finally {
      setIsSubmitting(false);
    }
  };

  const retrySubmission = () => {
    if (lastSubmittedDraft) {
      setDraft(lastSubmittedDraft);
      void handleSubmit(undefined, lastSubmittedDraft);
      return;
    }

    void handleSubmit();
  };

  const startNewDraft = () => {
    const nextPreset = writingPresets.find(
      (item) => item.taskType === draft.taskType,
    );

    setDraft((currentDraft) => ({
      ...currentDraft,
      content: "",
      prompt: nextPreset?.prompt ?? currentDraft.prompt,
      targetWords: nextPreset?.targetWords ?? currentDraft.targetWords,
    }));
    setActiveReview(null);
    setSubmitError(null);
    setMobilePanel("editor");
    window.setTimeout(() => editorRef.current?.focus(), 0);
  };

  const openHistoryItem = async (item: WritingHistoryItem) => {
    if (!session?.accessToken) {
      return;
    }

    setLoadingReviewId(item.id);
    setHistoryActionError(null);

    try {
      const review = await getWritingReviewRequest(
        item.id,
        session.accessToken,
      );

      setActiveReview(review);
      setShowHistory(false);
      setMobilePanel("review");
    } catch (error) {
      setHistoryActionError(errorMessage(error));
    } finally {
      setLoadingReviewId(null);
    }
  };

  const deleteHistoryItem = async (item: WritingHistoryItem) => {
    if (
      !session?.accessToken ||
      !window.confirm(
        "Xóa vĩnh viễn bài chấm này khỏi tài khoản? Thao tác không thể hoàn tác.",
      )
    ) {
      return;
    }

    setDeletingReviewId(item.id);
    setHistoryActionError(null);
    setHistoryNotice(null);

    try {
      await deleteWritingReviewRequest(item.id, session.accessToken);
      setHistory((currentHistory) =>
        currentHistory.filter((review) => review.id !== item.id),
      );
      setHistoryTotal((currentTotal) => Math.max(0, currentTotal - 1));

      if (activeReview?.id === item.id) {
        setActiveReview(null);
      }

      setHistoryNotice("Đã xóa bài chấm khỏi tài khoản.");
    } catch (error) {
      setHistoryActionError(errorMessage(error));
    } finally {
      setDeletingReviewId(null);
    }
  };

  const deleteAllHistory = async () => {
    if (
      !session?.accessToken ||
      historyTotal === 0 ||
      !window.confirm(
        `Xóa vĩnh viễn toàn bộ ${historyTotal.toLocaleString("vi-VN")} bài chấm? Thao tác này không thể hoàn tác.`,
      )
    ) {
      return;
    }

    setIsDeletingHistory(true);
    setHistoryActionError(null);
    setHistoryNotice(null);

    try {
      const deletedCount = await deleteWritingHistoryRequest(
        session.accessToken,
      );
      setHistory([]);
      setHistoryTotal(0);
      setActiveReview(null);
      setHistoryNotice(
        `Đã xóa ${deletedCount.toLocaleString("vi-VN")} bài chấm.`,
      );
    } catch (error) {
      setHistoryActionError(errorMessage(error));
    } finally {
      setIsDeletingHistory(false);
    }
  };

  const exportHistory = async () => {
    if (!session?.accessToken) {
      return;
    }

    setIsExportingHistory(true);
    setHistoryActionError(null);
    setHistoryNotice(null);

    try {
      const exportedHistory = await exportWritingHistoryRequest(
        session.accessToken,
      );
      const blob = new Blob([JSON.stringify(exportedHistory, null, 2)], {
        type: "application/json;charset=utf-8",
      });
      const objectUrl = URL.createObjectURL(blob);
      const downloadLink = document.createElement("a");
      const date = new Date().toISOString().slice(0, 10);

      downloadLink.href = objectUrl;
      downloadLink.download = `mtd-lingo-writing-${date}.json`;
      document.body.append(downloadLink);
      downloadLink.click();
      downloadLink.remove();
      URL.revokeObjectURL(objectUrl);
      setHistoryNotice(
        `Đã chuẩn bị tệp gồm ${exportedHistory.items.length.toLocaleString("vi-VN")} bài chấm.`,
      );
    } catch (error) {
      setHistoryActionError(errorMessage(error));
    } finally {
      setIsExportingHistory(false);
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-5rem)] overflow-hidden bg-slate-950">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[460px] bg-[radial-gradient(circle_at_18%_10%,rgba(34,211,238,0.12),transparent_35%),radial-gradient(circle_at_82%_4%,rgba(139,92,246,0.12),transparent_34%)]"
      />

      <div className="relative mx-auto max-w-[1720px] px-4 py-6 sm:px-6 sm:py-8 xl:px-9">
        <header className="reveal-up flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-full border border-cyan-300/20 bg-cyan-300/[0.08] px-3 py-1.5 text-[11px] font-black uppercase tracking-[0.2em] text-cyan-300">
                AI Writing Studio
              </span>
              <span className="flex items-center gap-2 text-xs font-bold text-slate-500">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.8)]" />
                Xử lý qua máy chủ
              </span>
            </div>
            <h1 className="mt-4 max-w-4xl text-3xl font-black tracking-[-0.04em] text-white sm:text-4xl xl:text-5xl">
              Viết sắc nét hơn với phản hồi
              <span className="bg-gradient-to-r from-cyan-300 to-violet-300 bg-clip-text text-transparent">
                {" "}đúng trọng tâm.
              </span>
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-400 sm:text-base">
              Luyện từ A1 đến C2, email, bài luận, TOEIC và IELTS trong cùng
              một không gian — chấm theo rubric, sửa câu và hướng dẫn bước tiếp theo.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setShowHistory(true)}
              className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-black text-slate-200 transition hover:border-cyan-300/25 hover:bg-white/[0.07]"
            >
              Lịch sử <span className="ml-1 text-slate-500">{historyTotal}</span>
            </button>
            <button
              type="button"
              onClick={startNewDraft}
              className="premium-button rounded-2xl bg-cyan-300 px-5 py-3 text-sm font-black text-slate-950 transition hover:bg-cyan-200"
            >
              + Bài viết mới
            </button>
          </div>
        </header>

        <section className="reveal-up-delayed mt-8 rounded-[1.75rem] border border-white/[0.08] bg-slate-900/55 p-2 shadow-[0_30px_100px_rgba(0,0,0,0.3)] backdrop-blur-xl">
          <div
            className="grid gap-2 sm:grid-cols-2 lg:grid-cols-5"
            role="tablist"
            aria-label="Loại bài viết"
          >
            {writingTaskTypes.map((taskType) => {
              const config = writingTaskConfig[taskType];
              const selected = taskType === draft.taskType;

              return (
                <button
                  key={taskType}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  onClick={() => selectTaskType(taskType)}
                  className={`group rounded-[1.25rem] border px-4 py-4 text-left transition ${
                    selected
                      ? "border-cyan-300/25 bg-gradient-to-br from-cyan-300/15 to-violet-400/10 shadow-[0_12px_30px_rgba(34,211,238,0.08)]"
                      : "border-transparent bg-transparent hover:border-white/[0.07] hover:bg-white/[0.035]"
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <span
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-sm font-black ${
                        selected
                          ? "bg-cyan-300 text-slate-950"
                          : "bg-white/[0.06] text-slate-400 group-hover:text-white"
                      }`}
                    >
                      {config.icon}
                    </span>
                    <span>
                      <strong
                        className={`block text-sm ${selected ? "text-white" : "text-slate-300"}`}
                      >
                        {config.label}
                      </strong>
                      <span className="mt-1 hidden text-[11px] leading-5 text-slate-500 xl:block">
                        {config.description}
                      </span>
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        <div className="mt-5 grid grid-cols-2 gap-2 lg:hidden">
          <button
            type="button"
            onClick={() => setMobilePanel("editor")}
            className={`rounded-xl px-4 py-3 text-sm font-black ${
              mobilePanel === "editor"
                ? "bg-cyan-300 text-slate-950"
                : "border border-white/10 bg-white/[0.04] text-slate-400"
            }`}
          >
            Bài viết
          </button>
          <button
            type="button"
            onClick={() => setMobilePanel("review")}
            className={`rounded-xl px-4 py-3 text-sm font-black ${
              mobilePanel === "review"
                ? "bg-violet-300 text-slate-950"
                : "border border-white/10 bg-white/[0.04] text-slate-400"
            }`}
          >
            Phản hồi {activeReview ? "✓" : ""}
          </button>
        </div>

        <main className="mt-5 grid items-start gap-5 lg:grid-cols-[minmax(0,1.08fr)_minmax(390px,0.92fr)]">
          <form
            onSubmit={handleSubmit}
            className={`${mobilePanel === "editor" ? "block" : "hidden"} overflow-hidden rounded-[1.75rem] border border-white/[0.09] bg-slate-900/75 shadow-[0_30px_90px_rgba(0,0,0,0.28)] lg:block`}
          >
            <div className="border-b border-white/[0.08] p-5 sm:p-7">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-cyan-300">
                    Brief
                  </p>
                  <h2 className="mt-2 text-xl font-black text-white">
                    Đề bài & mục tiêu
                  </h2>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <label className="sr-only" htmlFor="writing-level">
                    Trình độ CEFR
                  </label>
                  <select
                    id="writing-level"
                    value={draft.level}
                    onChange={(event) =>
                      updateDraft("level", event.target.value as CefrLevel)
                    }
                    className="rounded-xl border border-white/10 bg-slate-950 px-3 py-2.5 text-xs font-black text-white focus:border-cyan-300/40"
                  >
                    {cefrLevels.map((level) => (
                      <option key={level} value={level}>
                        {level} · {cefrLevelDescriptions[level]}
                      </option>
                    ))}
                  </select>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setShowPresets((currentValue) => !currentValue)}
                      aria-expanded={showPresets}
                      className="rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2.5 text-xs font-black text-slate-200 transition hover:border-violet-300/30"
                    >
                      Đổi đề ▾
                    </button>
                    {showPresets && (
                      <div className="absolute right-0 top-[calc(100%+10px)] z-20 w-[min(22rem,calc(100vw-3rem))] overflow-hidden rounded-2xl border border-white/10 bg-slate-900 p-2 shadow-2xl shadow-black/50">
                        <div className="max-h-80 overflow-y-auto">
                          {filteredPresets.map((preset) => (
                            <button
                              key={preset.id}
                              type="button"
                              onClick={() => applyPreset(preset.id)}
                              className="block w-full rounded-xl p-3 text-left transition hover:bg-white/[0.05]"
                            >
                              <span className="flex items-center justify-between gap-3">
                                <strong className="text-sm text-slate-100">
                                  {preset.title}
                                </strong>
                                <span className="shrink-0 text-[10px] font-black uppercase tracking-wider text-violet-300">
                                  {preset.tag}
                                </span>
                              </span>
                              <span className="mt-1 line-clamp-2 block text-xs leading-5 text-slate-500">
                                {preset.prompt}
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <label
                htmlFor="writing-prompt"
                className="mt-5 block text-xs font-black text-slate-400"
              >
                Đề bài <span className="font-normal text-slate-600">(có thể chỉnh sửa)</span>
              </label>
              <textarea
                id="writing-prompt"
                value={draft.prompt}
                onChange={(event) => updateDraft("prompt", event.target.value)}
                maxLength={2_000}
                rows={3}
                className="mt-2 w-full resize-y rounded-2xl border border-white/[0.09] bg-slate-950/70 px-4 py-3.5 text-sm leading-6 text-slate-200 outline-none transition placeholder:text-slate-700 focus:border-cyan-300/30 focus:ring-4 focus:ring-cyan-300/[0.04]"
                placeholder="Nhập đề bài hoặc mục tiêu bạn muốn luyện…"
              />

              <div className="mt-4 flex flex-col gap-3 rounded-2xl border border-white/[0.07] bg-white/[0.025] p-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-xs font-black text-slate-300">Khung triển khai</p>
                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    {selectedTask.framework.join(" · ")}
                  </p>
                </div>
                <label className="flex shrink-0 items-center gap-2 text-xs font-bold text-slate-400">
                  Mục tiêu
                  <input
                    type="number"
                    min={30}
                    max={2_000}
                    step={10}
                    value={draft.targetWords}
                    onChange={(event) =>
                      updateDraft(
                        "targetWords",
                        Math.min(
                          2_000,
                          Math.max(30, Number(event.target.value) || 30),
                        ),
                      )
                    }
                    className="w-20 rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-center font-black text-white"
                    aria-label="Mục tiêu số từ"
                  />
                  từ
                </label>
              </div>
            </div>

            <div className="p-5 sm:p-7">
              <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                <label htmlFor="writing-content" className="text-sm font-black text-white">
                  Bài viết của bạn
                </label>
                <div className="flex flex-wrap items-center justify-end gap-3">
                  <span
                    className={`flex items-center gap-2 text-xs font-bold ${
                      saveStatus === "saved" ? "text-emerald-300" : "text-slate-500"
                    }`}
                    aria-live="polite"
                  >
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${
                        saveStatus === "saving"
                          ? "animate-pulse bg-amber-300"
                          : saveStatus === "saved"
                            ? "bg-emerald-300"
                            : "bg-slate-600"
                      }`}
                    />
                    {saveStatus === "saving"
                      ? "Đang lưu nháp…"
                      : saveStatus === "saved"
                        ? keepDraftOnDevice
                          ? "Đã lưu trên thiết bị"
                          : "Đã lưu trong phiên này"
                        : "Bản nháp tạm"}
                  </span>
                  <button
                    type="button"
                    onClick={clearLocalDraft}
                    className="text-xs font-black text-slate-500 underline decoration-white/10 underline-offset-4 transition hover:text-rose-200"
                  >
                    Xóa bản nháp
                  </button>
                </div>
              </div>

              <label className="mt-3 flex cursor-pointer items-start gap-3 rounded-2xl border border-white/[0.07] bg-white/[0.02] px-4 py-3 text-xs leading-5 text-slate-400">
                <input
                  type="checkbox"
                  checked={keepDraftOnDevice}
                  onChange={(event) =>
                    setKeepDraftOnDevice(event.target.checked)
                  }
                  className="mt-0.5 h-4 w-4 shrink-0 accent-cyan-300"
                />
                <span>
                  <strong className="text-slate-200">
                    Giữ bản nháp trên thiết bị
                  </strong>{" "}
                  — nếu không chọn, bản nháp chỉ tồn tại trong phiên/tab hiện tại.
                </span>
              </label>

              <div className="relative overflow-hidden rounded-[1.4rem] border border-white/[0.1] bg-slate-950/80 transition focus-within:border-cyan-300/35 focus-within:ring-4 focus-within:ring-cyan-300/[0.04]">
                <textarea
                  ref={editorRef}
                  id="writing-content"
                  value={draft.content}
                  onChange={(event) => updateDraft("content", event.target.value)}
                  minLength={20}
                  maxLength={12_000}
                  rows={15}
                  spellCheck="true"
                  className="min-h-[360px] w-full resize-y bg-transparent px-5 py-5 text-[15px] leading-8 text-slate-100 outline-none placeholder:text-slate-700 sm:min-h-[420px] sm:px-6 sm:py-6 sm:text-base"
                  placeholder="Start writing here… Đừng cố hoàn hảo ngay từ câu đầu; hãy để ý tưởng chảy trước."
                  aria-describedby="writing-editor-help"
                />
                <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/[0.07] bg-white/[0.02] px-4 py-3 text-[11px] font-bold text-slate-500 sm:px-5">
                  <span id="writing-editor-help">
                    {sentenceCount} câu · {readingTime(wordCount)} đọc
                  </span>
                  <span>{draft.content.length.toLocaleString("vi-VN")} / 12.000 ký tự</span>
                </div>
              </div>

              <div className="mt-5 rounded-2xl border border-white/[0.07] bg-white/[0.025] p-4">
                <div className="flex items-center justify-between gap-4">
                  <p className="text-sm font-black text-slate-200">
                    {wordCount.toLocaleString("vi-VN")}
                    <span className="ml-1 font-bold text-slate-500">
                      / {draft.targetWords} từ
                    </span>
                  </p>
                  <span
                    className={`text-xs font-black ${
                      targetProgress >= 100 ? "text-emerald-300" : "text-cyan-300"
                    }`}
                  >
                    {targetProgress >= 100 ? "Đạt mục tiêu ✓" : `${targetProgress}%`}
                  </span>
                </div>
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/[0.07]">
                  <div
                    className={`h-full rounded-full transition-[width] duration-300 ${
                      targetProgress >= 100
                        ? "bg-emerald-300"
                        : "bg-gradient-to-r from-violet-400 to-cyan-300"
                    }`}
                    style={{ width: `${targetProgress}%` }}
                  />
                </div>
              </div>

              <div className="mt-5 rounded-2xl border border-cyan-300/15 bg-cyan-300/[0.035] p-4 sm:p-5">
                <div className="flex items-start gap-3">
                  <span
                    aria-hidden="true"
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-cyan-300/10 text-sm text-cyan-200"
                  >
                    ◈
                  </span>
                  <div>
                    <p className="text-sm font-black text-slate-100">
                      Quyền riêng tư trước khi chấm
                    </p>
                    <p
                      id="writing-consent-description"
                      className="mt-2 text-xs leading-6 text-slate-400"
                    >
                      Bài viết, đề bài và kết quả sẽ được lưu trong tài khoản tối đa{" "}
                      {policy.retentionDays.toLocaleString("vi-VN")} ngày. Nội dung
                      có thể được xử lý bởi {providerDisclosure(policy, hasCurrentPolicy)}
                      {policy.configuredProviders.length > 0 || !hasCurrentPolicy
                        ? "; chính sách riêng của nhà cung cấp áp dụng"
                        : ""}
                      . Nếu dịch vụ AI
                      không khả dụng, hệ thống có thể dùng bộ chấm heuristic cục bộ.
                    </p>
                  </div>
                </div>

                <label className="mt-4 flex cursor-pointer items-start gap-3 rounded-xl border border-white/[0.08] bg-slate-950/45 p-3 text-xs leading-5 text-slate-300">
                  <input
                    type="checkbox"
                    checked={consentAccepted}
                    onChange={(event) => updateConsent(event.target.checked)}
                    aria-describedby="writing-consent-description"
                    className="mt-0.5 h-4 w-4 shrink-0 accent-cyan-300"
                  />
                  <span>
                    Tôi đã đọc và đồng ý việc lưu, xử lý nội dung cho lần chấm
                    này. Xem{" "}
                    <Link
                      to="/privacy"
                      target="_blank"
                      rel="noreferrer"
                      className="font-black text-cyan-300 underline decoration-cyan-300/30 underline-offset-4 hover:text-cyan-200"
                    >
                      Chính sách quyền riêng tư
                    </Link>
                    .
                  </span>
                </label>

                {hasAcknowledgedPolicy && !consentAccepted && (
                  <p className="mt-2 text-[11px] leading-5 text-slate-500">
                    Thiết bị này đã từng xác nhận phiên bản {policy.consentVersion},
                    nhưng bạn vẫn chủ động xác nhận lại cho mỗi lần gửi.
                  </p>
                )}
              </div>

              {submitError && (
                <div
                  className="mt-5 rounded-2xl border border-rose-300/20 bg-rose-300/[0.07] p-4"
                  role="alert"
                >
                  <p className="text-sm font-bold leading-6 text-rose-100">
                    {submitError}
                  </p>
                  {lastSubmittedDraft && (
                    <button
                      type="button"
                      onClick={retrySubmission}
                      className="mt-3 text-xs font-black text-rose-200 underline decoration-rose-300/30 underline-offset-4"
                    >
                      Thử chấm lại
                    </button>
                  )}
                </div>
              )}

              <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="max-w-md text-xs leading-5 text-slate-600">
                  Khóa nhà cung cấp được giữ ở máy chủ. Bạn có thể xuất hoặc xóa
                  lịch sử bất cứ lúc nào trong mục Lịch sử.
                </p>
                <button
                  type="submit"
                  disabled={!canSubmit}
                  className="premium-button flex min-h-12 shrink-0 items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-cyan-300 to-sky-300 px-7 py-3 text-sm font-black text-slate-950 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {isSubmitting ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-950/20 border-r-slate-950" />
                      Đang phân tích…
                    </>
                  ) : (
                    <>Gửi và chấm bài <span aria-hidden="true">→</span></>
                  )}
                </button>
              </div>
            </div>
          </form>

          <aside
            className={`${mobilePanel === "review" ? "block" : "hidden"} overflow-hidden rounded-[1.75rem] border border-white/[0.09] bg-slate-900/75 shadow-[0_30px_90px_rgba(0,0,0,0.28)] lg:sticky lg:top-24 lg:block lg:max-h-[calc(100vh-7rem)] lg:overflow-y-auto`}
            aria-label="Kết quả chấm bài"
          >
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-white/[0.08] bg-slate-900/90 px-5 py-4 backdrop-blur-xl sm:px-7">
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-300 text-xs font-black text-slate-950">
                  {activeReview?.source === "fallback" ? "FX" : "AI"}
                </span>
                <div>
                  <p className="text-sm font-black text-white">Writing Coach</p>
                  <p className="text-[11px] text-slate-500">
                    {activeReview
                      ? sourceLabel(activeReview.source)
                      : "Rubric · CEFR · Corrections"}
                  </p>
                </div>
              </div>
              {activeReview && (
                <button
                  type="button"
                  onClick={startNewDraft}
                  className="rounded-xl border border-white/[0.08] px-3 py-2 text-[11px] font-black text-slate-400 transition hover:text-white"
                >
                  Viết bài khác
                </button>
              )}
            </div>
            <WritingReviewPanel review={activeReview} isLoading={isSubmitting} />
          </aside>
        </main>
      </div>

      {showHistory && (
        <div className="fixed inset-0 z-[70] flex justify-end" role="dialog" aria-modal="true" aria-labelledby="writing-history-title">
          <button
            type="button"
            onClick={() => setShowHistory(false)}
            className="absolute inset-0 bg-slate-950/75 backdrop-blur-sm"
            aria-label="Đóng lịch sử"
          />
          <aside className="relative z-10 flex h-full w-full max-w-md flex-col border-l border-white/10 bg-slate-950 shadow-2xl shadow-black">
            <div className="flex items-center justify-between border-b border-white/10 px-5 py-5 sm:px-6">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.18em] text-cyan-300">
                  Archive
                </p>
                <h2 id="writing-history-title" className="mt-2 text-xl font-black text-white">
                  Lịch sử chấm bài
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setShowHistory(false)}
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-xl text-slate-400 hover:text-white"
                aria-label="Đóng"
              >
                ×
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 border-b border-white/[0.08] p-4 sm:px-5">
              <button
                type="button"
                onClick={() => void exportHistory()}
                disabled={isExportingHistory || historyTotal === 0}
                className="rounded-xl border border-cyan-300/15 bg-cyan-300/[0.06] px-3 py-2.5 text-xs font-black text-cyan-200 transition hover:bg-cyan-300/10 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {isExportingHistory ? "Đang xuất…" : "Tải JSON"}
              </button>
              <button
                type="button"
                onClick={() => void deleteAllHistory()}
                disabled={isDeletingHistory || historyTotal === 0}
                className="rounded-xl border border-rose-300/15 bg-rose-300/[0.05] px-3 py-2.5 text-xs font-black text-rose-200 transition hover:bg-rose-300/10 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {isDeletingHistory ? "Đang xóa…" : "Xóa tất cả"}
              </button>
              <p className="col-span-2 text-[11px] leading-5 text-slate-600">
                {historyTotal.toLocaleString("vi-VN")} bản ghi · lưu tối đa{" "}
                {policy.retentionDays.toLocaleString("vi-VN")} ngày
              </p>
            </div>

            <div className="flex-1 overflow-y-auto p-4 sm:p-5">
              {historyActionError && (
                <p
                  role="alert"
                  className="mb-4 rounded-xl border border-rose-300/15 bg-rose-300/[0.06] p-3 text-xs leading-5 text-rose-100"
                >
                  {historyActionError}
                </p>
              )}
              {historyNotice && (
                <p
                  role="status"
                  className="mb-4 rounded-xl border border-emerald-300/15 bg-emerald-300/[0.06] p-3 text-xs leading-5 text-emerald-100"
                >
                  {historyNotice}
                </p>
              )}
              {isHistoryLoading ? (
                <div className="space-y-3" role="status" aria-label="Đang tải lịch sử">
                  {[0, 1, 2].map((item) => (
                    <div key={item} className="h-28 animate-pulse rounded-2xl bg-white/[0.04]" />
                  ))}
                </div>
              ) : historyError ? (
                <div className="rounded-2xl border border-rose-300/15 bg-rose-300/[0.05] p-5">
                  <p className="text-sm leading-6 text-rose-100">{historyError}</p>
                  <button
                    type="button"
                    onClick={() => void loadHistory(0)}
                    className="mt-4 text-xs font-black text-rose-200 underline underline-offset-4"
                  >
                    Tải lại
                  </button>
                </div>
              ) : history.length === 0 ? (
                <div className="py-20 text-center">
                  <span className="text-4xl" aria-hidden="true">◌</span>
                  <h3 className="mt-4 font-black text-white">Chưa có bài đã chấm</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    Bài đầu tiên sẽ xuất hiện ở đây sau khi hệ thống phân tích.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {history.map((review) => (
                    <article
                      key={review.id}
                      className="overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.025] transition hover:border-cyan-300/20"
                    >
                      <button
                        type="button"
                        onClick={() => void openHistoryItem(review)}
                        disabled={loadingReviewId !== null || deletingReviewId !== null}
                        className="group w-full p-4 text-left transition hover:bg-cyan-300/[0.04] disabled:cursor-wait disabled:opacity-60"
                      >
                        <span className="flex items-start justify-between gap-4">
                          <span className="min-w-0">
                            <span className="block text-[10px] font-black uppercase tracking-[0.18em] text-violet-300">
                              {review.taskType
                                ? writingTaskConfig[review.taskType].shortLabel
                                : "Writing"}
                              {review.level ? ` · ${review.level}` : ""}
                            </span>
                            <strong className="mt-2 line-clamp-2 block text-sm leading-6 text-slate-100">
                              {review.prompt || "Bài viết không có đề bài"}
                            </strong>
                          </span>
                          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-cyan-300/10 text-lg font-black text-cyan-300">
                            {loadingReviewId === review.id
                              ? "…"
                              : Math.round(review.overallScore)}
                          </span>
                        </span>
                        <span className="mt-3 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-600">
                          <span>
                            CEFR {review.cefrEstimate || "—"} ·{" "}
                            {review.wordCount.toLocaleString("vi-VN")} từ
                          </span>
                          <span>{formatHistoryDate(review.reviewedAt)}</span>
                        </span>
                      </button>
                      <div className="flex items-center justify-between border-t border-white/[0.06] px-4 py-2.5">
                        <span
                          className={`rounded-full px-2.5 py-1 text-[10px] font-black ${
                            review.source === "fallback"
                              ? "bg-amber-300/10 text-amber-200"
                              : "bg-violet-300/10 text-violet-200"
                          }`}
                        >
                          {sourceLabel(review.source)}
                        </span>
                        <button
                          type="button"
                          onClick={() => void deleteHistoryItem(review)}
                          disabled={deletingReviewId !== null}
                          className="rounded-lg px-2 py-1 text-[11px] font-black text-slate-600 transition hover:bg-rose-300/10 hover:text-rose-200 disabled:cursor-wait disabled:opacity-50"
                          aria-label={`Xóa bài chấm ngày ${formatHistoryDate(review.reviewedAt)}`}
                        >
                          {deletingReviewId === review.id ? "Đang xóa…" : "Xóa"}
                        </button>
                      </div>
                    </article>
                  ))}

                  {history.length < historyTotal && (
                    <button
                      type="button"
                      onClick={() => void loadHistory(history.length)}
                      disabled={isLoadingMore}
                      className="w-full rounded-2xl border border-white/[0.08] bg-white/[0.025] px-4 py-3 text-xs font-black text-slate-300 transition hover:border-cyan-300/20 hover:text-cyan-200 disabled:cursor-wait disabled:opacity-50"
                    >
                      {isLoadingMore
                        ? "Đang tải thêm…"
                        : `Tải thêm (${history.length}/${historyTotal})`}
                    </button>
                  )}
                </div>
              )}
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}

function WritingPage() {
  const { user } = useAuth();

  return <WritingWorkspace key={user?.id ?? "guest"} />;
}

export { WritingPage };
export default WritingPage;
