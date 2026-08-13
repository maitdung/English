import {
  type FormEvent,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { useAuth } from "../../auth/context/AuthContext";
import {
  getSpeakingCoachChatRequest,
  getSpeakingCoachFeedbackRequest,
  type SpeakingCoachChatMode,
  type SpeakingCoachChatResponse,
} from "../../../lib/api/speaking-coach-api";

type SpeechRecognitionAlternativeLike = {
  transcript: string;
  confidence: number;
};

type SpeechRecognitionResultLike = {
  isFinal: boolean;
  length: number;
  item(index: number): SpeechRecognitionAlternativeLike | null;
};

type SpeechRecognitionResultListLike = {
  length: number;
  item(index: number): SpeechRecognitionResultLike | null;
};

type SpeechRecognitionEventLike = {
  resultIndex?: number;
  results?: SpeechRecognitionResultListLike;
};

type SpeechRecognitionLike = {
  continuous: boolean;
  interimResults: boolean;
  maxAlternatives: number;
  lang: string;
  onstart: (() => void) | null;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  onerror: ((event: { error: string }) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
};

type WindowWithSpeechRecognition = Window & {
  webkitSpeechRecognition?: new () => SpeechRecognitionLike;
  SpeechRecognition?: new () => SpeechRecognitionLike;
};

type Message = {
  id: string;
  role: "assistant" | "user";
  content: string;
  translatedText?: string;
  correctedText?: string;
  source?: SpeakingCoachChatResponse["source"];
  mode?: SpeakingCoachChatMode;
  isStarter?: boolean;
};

type ModeOption = {
  id: SpeakingCoachChatMode;
  label: string;
  shortLabel: string;
  description: string;
  inputLabel: string;
  placeholder: string;
  speechLanguage: "en-US" | "vi-VN";
};

type TopicOption = {
  id: string;
  title: string;
  badge: string;
  prompt: string;
  focus: string;
};

type SpeakingHistoryEntry = {
  id: string;
  topic: string;
  score: number;
  feedback: string;
  response: string;
  createdAt: string;
};

const topicOptions: TopicOption[] = [
  {
    id: "career",
    title: "Công việc & thăng tiến",
    badge: "Career",
    prompt: "Hãy kể cho tôi về một dự án bạn từng làm và điều bạn học được.",
    focus: "Câu trả lời có cấu trúc rõ ràng và từ vựng chuyên môn.",
  },
  {
    id: "travel",
    title: "Du lịch & khám phá",
    badge: "Travel",
    prompt: "Mô tả chuyến đi gần đây của bạn bằng tiếng Anh.",
    focus: "Sử dụng câu đơn giản, tự nhiên và nhiều động từ chỉ chuyển động.",
  },
  {
    id: "daily",
    title: "Cuộc sống hàng ngày",
    badge: "Daily",
    prompt: "Hãy nói về thói quen buổi sáng của bạn.",
    focus: "Trả lời tự nhiên, mạch lạc và dùng nhiều cụm từ thông dụng.",
  },
];

const modeOptions: ModeOption[] = [
  {
    id: "coach",
    label: "Hội thoại với AI",
    shortLabel: "Hội thoại",
    description: "Luyện phản xạ, sửa câu và nhận câu hỏi tiếp nối bằng tiếng Anh.",
    inputLabel: "Trả lời bằng tiếng Anh",
    placeholder: "Ví dụ: I usually start my day with a coffee and a short walk.",
    speechLanguage: "en-US",
  },
  {
    id: "translate_en_vi",
    label: "Dịch Anh sang Việt",
    shortLabel: "Anh → Việt",
    description: "Nhập hoặc nói tiếng Anh để nhận bản dịch tiếng Việt tự nhiên.",
    inputLabel: "Nội dung tiếng Anh",
    placeholder: "Nhập hoặc nói câu tiếng Anh cần dịch…",
    speechLanguage: "en-US",
  },
  {
    id: "translate_vi_en",
    label: "Dịch Việt sang Anh",
    shortLabel: "Việt → Anh",
    description: "Chuyển ý tiếng Việt thành câu tiếng Anh tự nhiên, đúng ngữ cảnh.",
    inputLabel: "Nội dung tiếng Việt",
    placeholder: "Nhập hoặc nói câu tiếng Việt cần dịch…",
    speechLanguage: "vi-VN",
  },
];

const MAX_CLIENT_MESSAGES = 20;
const MAX_API_CONTEXT_MESSAGES = 8;
const FEEDBACK_DEADLINE_MS = 8_000;
const DEFAULT_FEEDBACK = "Gửi câu trả lời đầu tiên để nhận nhận xét riêng từ coach.";
const DEFAULT_IMPROVEMENT = "Coach sẽ đề xuất một bước cải thiện sau khi chấm điểm.";

function parseSpeakingHistory(value: unknown): SpeakingHistoryEntry[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .filter(
      (entry): entry is SpeakingHistoryEntry =>
        typeof entry === "object" &&
        entry !== null &&
        typeof (entry as { id?: unknown }).id === "string" &&
        typeof (entry as { topic?: unknown }).topic === "string" &&
        typeof (entry as { score?: unknown }).score === "number" &&
        Number.isFinite((entry as { score: number }).score) &&
        typeof (entry as { feedback?: unknown }).feedback === "string" &&
        typeof (entry as { response?: unknown }).response === "string" &&
        typeof (entry as { createdAt?: unknown }).createdAt === "string",
    )
    .slice(0, 8);
}

function getStarterMessages(mode: SpeakingCoachChatMode): Message[] {
  if (mode === "translate_en_vi") {
    return [
      {
        id: "starter-translate-en-vi",
        role: "assistant",
        content:
          "Chế độ dịch Anh → Việt đã sẵn sàng. Bạn có thể nhập văn bản hoặc dùng microphone để bắt đầu.",
        isStarter: true,
      },
    ];
  }

  if (mode === "translate_vi_en") {
    return [
      {
        id: "starter-translate-vi-en",
        role: "assistant",
        content:
          "Chế độ dịch Việt → Anh đã sẵn sàng. Mình sẽ ưu tiên cách diễn đạt tự nhiên thay vì dịch từng chữ.",
        isStarter: true,
      },
    ];
  }

  return [
    {
      id: "starter-coach-welcome",
      role: "assistant",
      content:
        "Xin chào! Hôm nay chúng ta sẽ luyện nói tiếng Anh theo chủ đề bạn chọn. Hãy trả lời ngắn gọn nhưng tự nhiên nhé.",
      isStarter: true,
    },
    {
      id: "starter-coach-example",
      role: "assistant",
      content: "Ví dụ: 'I usually start my day with a coffee and a short walk.'",
      isStarter: true,
    },
  ];
}

function createMessageId(role: Message["role"]): string {
  return `${role}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function getSourceLabel(source: SpeakingCoachChatResponse["source"]): string {
  if (source === "xai") {
    return "xAI / Grok";
  }

  if (source === "gemini") {
    return "Gemini";
  }

  if (source === "openai") {
    return "OpenAI";
  }

  return "Fallback";
}

function SpeakingCoachPage() {
  const { session } = useAuth();
  const historyStorageKey = `mtd-lingo-speaking-history:${session?.user?.id ?? "guest"}`;
  const [selectedTopicId, setSelectedTopicId] = useState(topicOptions[0].id);
  const [chatMode, setChatMode] = useState<SpeakingCoachChatMode>("coach");
  const [response, setResponse] = useState("");
  const [messages, setMessages] = useState<Message[]>(() => getStarterMessages("coach"));
  const [score, setScore] = useState<number | null>(null);
  const [feedback, setFeedback] = useState(DEFAULT_FEEDBACK);
  const [improvement, setImprovement] = useState(DEFAULT_IMPROVEMENT);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [feedbackWarning, setFeedbackWarning] = useState<string | null>(null);
  const [lastFailedInput, setLastFailedInput] = useState<string | null>(null);
  const [history, setHistory] = useState<SpeakingHistoryEntry[]>([]);
  const [isListening, setIsListening] = useState(false);
  const [speechError, setSpeechError] = useState<string | null>(null);
  const [speechSupported, setSpeechSupported] = useState(true);
  const [liveTranscript, setLiveTranscript] = useState("");
  const [speechLanguage, setSpeechLanguage] = useState("en-US");
  const [feedbackSource, setFeedbackSource] = useState<SpeakingCoachChatResponse["source"] | null>(null);
  const [loadedHistoryKey, setLoadedHistoryKey] = useState<string | null>(null);
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const currentHistoryKeyRef = useRef(historyStorageKey);
  const activeChatControllerRef = useRef<AbortController | null>(null);
  const activeFeedbackControllerRef = useRef<AbortController | null>(null);

  const selectedTopic = useMemo(
    () => topicOptions.find((topic) => topic.id === selectedTopicId) ?? topicOptions[0],
    [selectedTopicId],
  );
  const selectedMode = useMemo(
    () => modeOptions.find((mode) => mode.id === chatMode) ?? modeOptions[0],
    [chatMode],
  );

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ block: "nearest" });
  }, [isSubmitting, messages]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const speechConstructor =
      (window as WindowWithSpeechRecognition).SpeechRecognition ??
      (window as WindowWithSpeechRecognition).webkitSpeechRecognition;

    if (!speechConstructor) {
      setSpeechSupported(false);
      return;
    }

    const recognition = new speechConstructor();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;
    recognition.lang = speechLanguage;
    recognition.onstart = () => {
      setSpeechError(null);
      setLiveTranscript("");
    };
    recognition.onresult = (event) => {
      const results = event.results;
      const resultIndex = typeof event.resultIndex === "number" ? event.resultIndex : 0;

      if (!results || resultIndex < 0) {
        return;
      }

      const result =
        results.item(resultIndex) ??
        (results as unknown as ArrayLike<SpeechRecognitionResultLike>)[resultIndex] ??
        null;
      const alternative =
        result?.item(0) ??
        (result as unknown as ArrayLike<SpeechRecognitionAlternativeLike> | null)?.[0] ??
        null;
      const transcript = alternative?.transcript?.trim();

      if (!transcript) {
        return;
      }

      if (result?.isFinal) {
        setResponse((currentValue) => {
          const trimmedCurrentValue = currentValue.trim();
          if (!trimmedCurrentValue) {
            return transcript;
          }

          return `${trimmedCurrentValue} ${transcript}`;
        });
        setLiveTranscript("");
        return;
      }

      setLiveTranscript(transcript);
    };
    recognition.onerror = (event) => {
      const errorCode = event.error;
      if (errorCode === "not-allowed") {
        setSpeechError("Bạn cần cho phép micróphone để dùng tính năng giọng nói.");
      } else {
        setSpeechError("Không thể nhận diện giọng nói lúc này. Hãy thử lại.");
      }
      setIsListening(false);
    };
    recognition.onend = () => {
      setIsListening(false);
      setLiveTranscript("");
    };

    recognitionRef.current = recognition;

    return () => {
      recognition.stop();
    };
  }, [speechLanguage]);

  useLayoutEffect(() => {
    activeChatControllerRef.current?.abort();
    activeChatControllerRef.current = null;
    activeFeedbackControllerRef.current?.abort();
    activeFeedbackControllerRef.current = null;
    recognitionRef.current?.stop();
    currentHistoryKeyRef.current = historyStorageKey;
    setLoadedHistoryKey(null);
    setSelectedTopicId(topicOptions[0].id);
    setChatMode("coach");
    setMessages(getStarterMessages("coach"));
    setResponse("");
    setScore(null);
    setFeedback(DEFAULT_FEEDBACK);
    setImprovement(DEFAULT_IMPROVEMENT);
    setFeedbackSource(null);
    setIsSubmitting(false);
    setSubmissionError(null);
    setFeedbackWarning(null);
    setLastFailedInput(null);
    setIsListening(false);
    setLiveTranscript("");
    setSpeechError(null);
    setSpeechLanguage("en-US");

    let nextHistory: SpeakingHistoryEntry[] = [];
    try {
      const storedValue = window.localStorage.getItem(historyStorageKey);
      if (storedValue) {
        nextHistory = parseSpeakingHistory(JSON.parse(storedValue) as unknown);
      }
    } catch {
      nextHistory = [];
    }

    setHistory(nextHistory);
    setLoadedHistoryKey(historyStorageKey);

    return () => {
      activeChatControllerRef.current?.abort();
      activeChatControllerRef.current = null;
      activeFeedbackControllerRef.current?.abort();
      activeFeedbackControllerRef.current = null;
      recognitionRef.current?.stop();
    };
  }, [historyStorageKey]);

  useEffect(() => {
    if (loadedHistoryKey !== historyStorageKey) {
      return;
    }

    try {
      window.localStorage.setItem(historyStorageKey, JSON.stringify(history));
    } catch {
      // Ignore storage quota issues.
    }
  }, [history, historyStorageKey, loadedHistoryKey]);

  const handleToggleVoice = () => {
    if (!recognitionRef.current) {
      setSpeechError("Trình duyệt của bạn chưa hỗ trợ nhận diện giọng nói.");
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
      setLiveTranscript("");
      return;
    }

    setSpeechError(null);
    setLiveTranscript("");
    try {
      recognitionRef.current.start();
      setIsListening(true);
    } catch (error) {
      setSpeechError(error instanceof Error ? error.message : "Không thể bật ghi âm.");
      setIsListening(false);
    }
  };

  const cancelBackgroundFeedback = () => {
    const activeController = activeFeedbackControllerRef.current;
    activeFeedbackControllerRef.current = null;
    activeController?.abort();
    setFeedbackWarning(null);
  };

  const requestFeedbackInBackground = (
    input: string,
    topic: string,
    accessToken: string | null | undefined,
    requestHistoryKey: string,
  ) => {
    cancelBackgroundFeedback();

    const feedbackController = new AbortController();
    let reachedDeadline = false;
    activeFeedbackControllerRef.current = feedbackController;
    setFeedbackWarning("Đang chấm điểm lượt nói này ở chế độ nền…");

    const deadlineId = window.setTimeout(() => {
      reachedDeadline = true;
      feedbackController.abort();
    }, FEEDBACK_DEADLINE_MS);

    void getSpeakingCoachFeedbackRequest(
      { topic, response: input },
      accessToken,
      feedbackController.signal,
    )
      .then((nextFeedback) => {
        if (
          activeFeedbackControllerRef.current !== feedbackController ||
          currentHistoryKeyRef.current !== requestHistoryKey
        ) {
          return;
        }

        setHistory((currentHistory) => {
          const nextEntry: SpeakingHistoryEntry = {
            id: createMessageId("user"),
            topic,
            score: nextFeedback.score,
            feedback: nextFeedback.feedback,
            response: input,
            createdAt: new Date().toISOString(),
          };

          return [nextEntry, ...currentHistory].slice(0, 8);
        });
        setScore(nextFeedback.score);
        setFeedback(nextFeedback.feedback);
        setImprovement(nextFeedback.improvement);
        setFeedbackSource(nextFeedback.source);
        setFeedbackWarning(null);
      })
      .catch(() => {
        if (
          activeFeedbackControllerRef.current !== feedbackController ||
          currentHistoryKeyRef.current !== requestHistoryKey
        ) {
          return;
        }

        setFeedbackWarning(
          reachedDeadline
            ? "Hội thoại đã tiếp tục, nhưng lượt này chưa chấm điểm vì quá thời gian 8 giây."
            : "Hội thoại đã tiếp tục, nhưng lượt này chưa chấm điểm do kết nối gián đoạn.",
        );
      })
      .finally(() => {
        window.clearTimeout(deadlineId);
        if (activeFeedbackControllerRef.current === feedbackController) {
          activeFeedbackControllerRef.current = null;
        }
      });
  };

  const handleModeChange = (nextMode: SpeakingCoachChatMode) => {
    if (nextMode === chatMode || isSubmitting) {
      return;
    }

    recognitionRef.current?.stop();
    cancelBackgroundFeedback();
    const nextModeOption = modeOptions.find((mode) => mode.id === nextMode) ?? modeOptions[0];
    setChatMode(nextMode);
    setMessages(getStarterMessages(nextMode));
    setResponse("");
    setSpeechLanguage(nextModeOption.speechLanguage);
    setIsListening(false);
    setLiveTranscript("");
    setSpeechError(null);
    setSubmissionError(null);
    setFeedbackWarning(null);
    setLastFailedInput(null);
  };

  const submitInput = async (input: string) => {
    const trimmedResponse = input.trim();
    if (!trimmedResponse || isSubmitting) {
      return;
    }

    recognitionRef.current?.stop();
    cancelBackgroundFeedback();
    setIsListening(false);
    setLiveTranscript("");
    setIsSubmitting(true);
    setSubmissionError(null);
    setFeedbackWarning(null);

    const requestHistoryKey = historyStorageKey;
    const requestTopic = selectedTopic.title;
    const requestMode = chatMode;
    const requestAccessToken = session?.accessToken;
    activeChatControllerRef.current?.abort();
    const chatController = new AbortController();
    activeChatControllerRef.current = chatController;

    try {
      const contextMessages = messages
        .filter((message) => !message.isStarter)
        .slice(-MAX_API_CONTEXT_MESSAGES)
        .map(({ role, content }) => ({ role, content }));
      const nextChatReply = await getSpeakingCoachChatRequest(
        {
          topic: requestTopic,
          input: trimmedResponse,
          messages: contextMessages,
          mode: requestMode,
        },
        requestAccessToken,
        chatController.signal,
      );

      if (
        activeChatControllerRef.current !== chatController ||
        currentHistoryKeyRef.current !== requestHistoryKey
      ) {
        return;
      }

      setMessages((currentMessages) =>
        [
          ...currentMessages,
          {
            id: createMessageId("user"),
            role: "user" as const,
            content: trimmedResponse,
          },
          {
            id: createMessageId("assistant"),
            role: "assistant" as const,
            content: nextChatReply.reply,
            translatedText: nextChatReply.translatedText,
            correctedText: nextChatReply.correctedText,
            source: nextChatReply.source,
            mode: nextChatReply.mode,
          },
        ].slice(-MAX_CLIENT_MESSAGES),
      );
      setResponse("");
      setLastFailedInput(null);

      if (requestMode === "coach") {
        requestFeedbackInBackground(
          trimmedResponse,
          requestTopic,
          requestAccessToken,
          requestHistoryKey,
        );
      }
    } catch (error) {
      if (
        chatController.signal.aborted ||
        activeChatControllerRef.current !== chatController ||
        currentHistoryKeyRef.current !== requestHistoryKey
      ) {
        return;
      }

      const fallbackMessage =
        error instanceof Error ? error.message : "Không thể kết nối AI lúc này.";
      setSubmissionError(fallbackMessage);
      setLastFailedInput(trimmedResponse);
    } finally {
      if (activeChatControllerRef.current === chatController) {
        activeChatControllerRef.current = null;
        setIsSubmitting(false);
      }
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void submitInput([response.trim(), liveTranscript.trim()].filter(Boolean).join(" "));
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.14),_transparent_42%),linear-gradient(135deg,_rgba(15,23,42,0.98),_rgba(2,8,23,1))] px-5 py-8 text-slate-100 sm:px-8 lg:px-10">
      <div className="mx-auto flex max-w-7xl flex-col gap-6">
        <section className="overflow-hidden rounded-[32px] border border-cyan-400/20 bg-slate-900/70 shadow-2xl shadow-cyan-950/30">
          <div className="grid gap-8 px-6 py-8 lg:grid-cols-[1.2fr_0.8fr] lg:px-8">
            <div>
              <div className="inline-flex items-center rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 text-sm font-semibold text-cyan-300">
                ✨ Speaking Coach
              </div>
              <h1 className="mt-4 text-3xl font-black sm:text-4xl">
                Luyện nói tiếng Anh với phản hồi tức thì
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-7 text-slate-400 sm:text-lg">
                Chọn chủ đề bạn thích, trả lời theo cách tự nhiên và nhận phản hồi để cải thiện khả năng giao tiếp mỗi ngày.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                    Phiên luyện hôm nay
                  </p>
                  <p className="mt-1 text-xl font-black text-white">3 buổi</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                    Điểm gần nhất
                  </p>
                  <p className="mt-1 text-xl font-black text-white">
                    {score === null ? "—" : `${score}%`}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-[28px] border border-white/10 bg-gradient-to-br from-cyan-500/20 via-slate-900 to-violet-500/20 p-5">
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-300">
                Mục tiêu luyện tập
              </p>
              <ul className="mt-4 space-y-3 text-sm text-slate-300">
                <li>• Nói tự nhiên hơn thay vì chỉ học mẫu câu.</li>
                <li>• Dùng từ vựng phù hợp với từng chủ đề.</li>
                <li>• Tự tin khi trả lời trong tình huống thật.</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
          <div className="rounded-[28px] border border-white/10 bg-slate-900/70 p-5 shadow-xl shadow-black/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-cyan-300">Chủ đề</p>
                <h2 className="text-xl font-black text-white">Chọn chủ đề bạn muốn luyện</h2>
              </div>
            </div>

            <div className="mt-5 space-y-3">
              {topicOptions.map((topic) => (
                <button
                  key={topic.id}
                  type="button"
                  disabled={isSubmitting}
                  aria-pressed={selectedTopic.id === topic.id}
                  onClick={() => {
                    cancelBackgroundFeedback();
                    setSelectedTopicId(topic.id);
                    setMessages(getStarterMessages(chatMode));
                    setResponse("");
                    setSubmissionError(null);
                    setLastFailedInput(null);
                    setFeedback(DEFAULT_FEEDBACK);
                    setImprovement(DEFAULT_IMPROVEMENT);
                    setFeedbackSource(null);
                    setScore(null);
                  }}
                  className={`w-full rounded-2xl border px-4 py-4 text-left transition motion-reduce:transition-none disabled:cursor-not-allowed disabled:opacity-60 ${
                    selectedTopic.id === topic.id
                      ? "border-cyan-400/40 bg-cyan-400/10"
                      : "border-white/10 bg-white/5 hover:border-white/20"
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-black text-white">{topic.title}</p>
                      <p className="mt-1 text-sm text-slate-400">{topic.focus}</p>
                    </div>
                    <span className="rounded-full border border-white/10 bg-slate-950/70 px-3 py-1 text-xs font-semibold text-cyan-300">
                      {topic.badge}
                    </span>
                  </div>
                </button>
              ))}
            </div>

            <div className="mt-5 rounded-2xl border border-amber-400/20 bg-amber-400/10 p-4">
              <p className="text-sm font-semibold text-amber-300">Mẫu prompt hôm nay</p>
              <p className="mt-2 text-sm leading-7 text-slate-300">{selectedTopic.prompt}</p>
            </div>

            <div className="mt-5 rounded-2xl border border-white/10 bg-slate-950/60 p-4">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-white">Lịch sử gần đây</p>
                <span className="text-xs uppercase tracking-[0.2em] text-slate-500">
                  {history.length} mục
                </span>
              </div>
              <div className="mt-4 space-y-3">
                {history.length === 0 ? (
                  <p className="text-sm text-slate-400">
                    Chưa có buổi luyện nào. Hãy gửi câu trả lời đầu tiên để bắt đầu.
                  </p>
                ) : (
                  history.slice(0, 3).map((entry) => (
                    <div key={entry.id} className="rounded-2xl border border-white/10 bg-white/5 p-3">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-sm font-semibold text-white">{entry.topic}</p>
                        <span className="text-sm font-black text-cyan-300">{entry.score}%</span>
                      </div>
                      <p className="mt-2 text-sm text-slate-400">{entry.feedback}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-slate-900/70 p-5 shadow-xl shadow-black/20">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-cyan-300">AI Language Studio</p>
                <h2 className="text-xl font-black text-white">{selectedMode.label}</h2>
              </div>
              {chatMode === "coach" ? (
                <div className="rounded-2xl border border-cyan-400/20 bg-cyan-400/10 px-3 py-2 text-right">
                  <p className="text-xs uppercase tracking-[0.25em] text-cyan-300">Điểm số</p>
                  <p className="text-lg font-black text-white">
                    {score === null ? "—" : `${score}%`}
                  </p>
                </div>
              ) : (
                <span className="rounded-full border border-violet-400/20 bg-violet-400/10 px-3 py-2 text-xs font-bold text-violet-200">
                  Dịch tức thì
                </span>
              )}
            </div>

            <div
              className="mt-5 grid grid-cols-1 gap-2 rounded-[22px] border border-white/10 bg-slate-950/60 p-2 sm:grid-cols-3"
              role="group"
              aria-label="Chọn chế độ AI"
            >
              {modeOptions.map((mode) => (
                <button
                  key={mode.id}
                  type="button"
                  aria-pressed={chatMode === mode.id}
                  disabled={isSubmitting}
                  onClick={() => handleModeChange(mode.id)}
                  className={`rounded-2xl px-3 py-3 text-left transition motion-reduce:transition-none disabled:cursor-not-allowed disabled:opacity-60 ${
                    chatMode === mode.id
                      ? "bg-gradient-to-r from-cyan-400 to-sky-400 text-slate-950 shadow-lg shadow-cyan-950/30"
                      : "text-slate-300 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <span className="block text-sm font-black">{mode.shortLabel}</span>
                </button>
              ))}
            </div>
            <p className="mt-3 text-sm leading-6 text-slate-400">{selectedMode.description}</p>

            <div
              className="mt-5 max-h-[34rem] overflow-y-auto rounded-[24px] border border-white/10 bg-slate-950/70 p-3 sm:p-4"
              aria-live="polite"
              aria-busy={isSubmitting}
            >
              <div className="space-y-3">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`max-w-[92%] rounded-2xl px-4 py-3 text-sm leading-7 sm:max-w-[86%] ${
                      message.role === "assistant"
                        ? "mr-auto border border-cyan-400/10 bg-cyan-400/10 text-slate-200"
                        : "ml-auto bg-gradient-to-br from-slate-700 to-slate-800 text-slate-100"
                    }`}
                  >
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                      {message.role === "assistant"
                        ? message.mode === "coach" || !message.mode
                          ? "AI Coach"
                          : "AI Translator"
                        : "Bạn"}
                    </p>
                    <p className="mt-2 whitespace-pre-wrap">{message.content}</p>
                    {message.role === "assistant" && message.translatedText ? (
                      <div className="mt-3 rounded-xl border border-white/10 bg-slate-950/40 px-3 py-2">
                        <p className="text-[0.68rem] font-bold uppercase tracking-[0.18em] text-cyan-300">
                          {message.mode === "coach" ? "Bản dịch tiếng Việt" : "Bản dịch"}
                        </p>
                        <p className="mt-1 text-sm text-slate-300">{message.translatedText}</p>
                      </div>
                    ) : null}
                    {message.role === "assistant" && message.correctedText ? (
                      <div className="mt-2 rounded-xl border border-emerald-400/10 bg-emerald-400/5 px-3 py-2">
                        <p className="text-[0.68rem] font-bold uppercase tracking-[0.18em] text-emerald-300">
                          Câu đã hiệu chỉnh
                        </p>
                        <p className="mt-1 text-sm text-slate-300">{message.correctedText}</p>
                      </div>
                    ) : null}
                    {message.source ? (
                      <p className="mt-2 text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-slate-500">
                        Nguồn: {getSourceLabel(message.source)}
                      </p>
                    ) : null}
                  </div>
                ))}
                {isSubmitting ? (
                  <div className="mr-auto flex max-w-[86%] items-center gap-2 rounded-2xl border border-cyan-400/10 bg-cyan-400/10 px-4 py-3 text-sm text-cyan-100">
                    <span className="h-2 w-2 animate-pulse rounded-full bg-cyan-300 motion-reduce:animate-none" />
                    AI đang suy nghĩ…
                  </div>
                ) : null}
                <div ref={messagesEndRef} />
              </div>
            </div>

            <form className="mt-5 space-y-3" onSubmit={handleSubmit}>
              <label className="block text-sm font-semibold text-slate-300" htmlFor="speaking-response">
                {selectedMode.inputLabel}
              </label>
              <textarea
                id="speaking-response"
                rows={4}
                maxLength={2_000}
                disabled={isSubmitting}
                value={response}
                onChange={(event) => {
                  setResponse(event.target.value);
                  if (submissionError) {
                    setSubmissionError(null);
                    setLastFailedInput(null);
                  }
                }}
                placeholder={selectedMode.placeholder}
                aria-describedby="speaking-input-help"
                className="w-full resize-y rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-base text-slate-100 outline-none ring-0 placeholder:text-slate-500 focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/20 disabled:cursor-not-allowed disabled:opacity-70 sm:text-sm"
              />
              <div id="speaking-input-help" className="flex items-center justify-between gap-3 text-xs text-slate-500">
                <span>Bạn có thể nhập văn bản hoặc dùng microphone.</span>
                <span>{response.length}/2000</span>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
                <button
                  type="button"
                  onClick={handleToggleVoice}
                  disabled={!speechSupported || isSubmitting}
                  aria-pressed={isListening}
                  className="rounded-2xl border border-cyan-400/20 bg-cyan-400/10 px-3 py-2 text-sm font-semibold text-cyan-300 transition hover:bg-cyan-400/20 disabled:cursor-not-allowed disabled:opacity-50 motion-reduce:transition-none"
                >
                  {isListening ? "⏹ Dừng ghi âm" : "🎤 Dùng giọng nói"}
                </button>
                <select
                  value={speechLanguage}
                  onChange={(event) => setSpeechLanguage(event.target.value)}
                  disabled={isSubmitting || isListening}
                  aria-label="Ngôn ngữ nhận diện giọng nói"
                  className="rounded-2xl border border-white/10 bg-slate-950/70 px-3 py-2 text-sm text-slate-100 outline-none disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="en-US">English (US)</option>
                  <option value="en-GB">English (UK)</option>
                  <option value="vi-VN">Tiếng Việt</option>
                </select>
                {!speechSupported ? (
                  <span className="text-sm text-slate-400">Voice input không hỗ trợ trên trình duyệt này.</span>
                ) : null}
              </div>
              {isListening && liveTranscript ? (
                <div className="rounded-2xl border border-cyan-400/20 bg-cyan-400/10 p-3 text-sm text-cyan-200" role="status">
                  Đang nghe: {liveTranscript}
                </div>
              ) : null}
              {speechError ? (
                <div className="rounded-2xl border border-amber-400/20 bg-amber-400/10 p-3 text-sm text-amber-200" role="alert">
                  {speechError}
                </div>
              ) : null}
              {chatMode === "coach" ? (
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-sm font-semibold text-white">Phản hồi coach</p>
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    {feedbackSource ? (
                      <span className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-2.5 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300">
                        {getSourceLabel(feedbackSource)}
                      </span>
                    ) : null}
                    <span className="text-sm leading-7 text-slate-400">{feedback}</span>
                  </div>
                  <div className="mt-3 border-t border-white/10 pt-3">
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-300">
                      Gợi ý cải thiện
                    </p>
                    <p className="mt-1 text-sm leading-7 text-slate-400">{improvement}</p>
                  </div>
                </div>
              ) : null}
              {feedbackWarning ? (
                <div className="rounded-2xl border border-amber-400/20 bg-amber-400/10 p-3 text-sm text-amber-200" role="status">
                  {feedbackWarning}
                </div>
              ) : null}
              {submissionError ? (
                <div className="flex flex-col gap-3 rounded-2xl border border-red-400/20 bg-red-400/10 p-3 text-sm text-red-200 sm:flex-row sm:items-center sm:justify-between" role="alert">
                  <span>{submissionError}</span>
                  {lastFailedInput ? (
                    <button
                      type="button"
                      disabled={isSubmitting}
                      onClick={() => void submitInput(lastFailedInput)}
                      className="shrink-0 rounded-xl border border-red-300/30 bg-red-300/10 px-3 py-2 font-bold text-red-100 transition hover:bg-red-300/20 disabled:opacity-50 motion-reduce:transition-none"
                    >
                      Thử lại
                    </button>
                  ) : null}
                </div>
              ) : null}
              <button
                type="submit"
                disabled={isSubmitting || !response.trim() && !liveTranscript.trim()}
                className="w-full rounded-2xl bg-cyan-400 px-4 py-3 text-sm font-black text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-70 motion-reduce:transition-none"
              >
                {isSubmitting
                  ? "AI đang xử lý…"
                  : chatMode === "coach"
                    ? "Gửi và tiếp tục hội thoại"
                    : "Dịch ngay"}
              </button>
            </form>
          </div>
        </section>
      </div>
    </div>
  );
}

export default SpeakingCoachPage;
