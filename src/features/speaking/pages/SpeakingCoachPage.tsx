import { type FormEvent, useEffect, useMemo, useRef, useState } from "react";

import { useAuth } from "../../auth/context/AuthContext";
import { getSpeakingCoachFeedbackRequest } from "../../../lib/api/speaking-coach-api";

type SpeechRecognitionResultLike = {
  transcript: string;
  confidence: number;
  isFinal: boolean;
};

type SpeechRecognitionResultListLike = {
  length: number;
  item(index: number): SpeechRecognitionResultLike | null;
};

type SpeechRecognitionEventLike = {
  results?: SpeechRecognitionResultListLike;
};

type SpeechRecognitionLike = {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
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
  role: "assistant" | "user";
  content: string;
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

const starterMessages: Message[] = [
  {
    role: "assistant",
    content:
      "Xin chào! Hôm nay chúng ta sẽ luyện nói tiếng Anh theo chủ đề bạn chọn. Hãy trả lời ngắn gọn nhưng tự nhiên nhé.",
  },
  {
    role: "assistant",
    content: "Ví dụ: 'I usually start my day with a coffee and a short walk.'",
  },
];

function SpeakingCoachPage() {
  const { session } = useAuth();
  const [selectedTopicId, setSelectedTopicId] = useState(topicOptions[0].id);
  const [response, setResponse] = useState("");
  const [messages, setMessages] = useState<Message[]>(starterMessages);
  const [score, setScore] = useState(78);
  const [feedback, setFeedback] = useState(
    "Bạn đang nói khá tự tin. Hãy thêm một câu kết để làm câu trả lời trôi chảy hơn.",
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [history, setHistory] = useState<SpeakingHistoryEntry[]>([]);
  const [isListening, setIsListening] = useState(false);
  const [speechError, setSpeechError] = useState<string | null>(null);
  const [speechSupported, setSpeechSupported] = useState(true);
  const [feedbackSource, setFeedbackSource] = useState<"openai" | "xai" | "fallback">("fallback");
  const hasLoadedHistory = useRef(false);
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);

  const selectedTopic = useMemo(
    () => topicOptions.find((topic) => topic.id === selectedTopicId) ?? topicOptions[0],
    [selectedTopicId],
  );

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
    recognition.lang = "en-US";
    recognition.onresult = (event) => {
      const results = event.results;

      if (!results) {
        return;
      }

      let nextTranscript = "";
      for (let index = 0; index < results.length; index += 1) {
        const result = results.item(index);
        if (!result) {
          continue;
        }

        const alternative = result.transcript?.trim();
        if (alternative) {
          nextTranscript += `${alternative} `;
        }
      }

      const finalTranscript = nextTranscript.trim();
      if (finalTranscript) {
        setResponse((currentValue) => {
          const combinedValue = currentValue.trim()
            ? `${currentValue.trim()} ${finalTranscript}`
            : finalTranscript;
          return combinedValue;
        });
      }
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
    };

    recognitionRef.current = recognition;

    return () => {
      recognition.stop();
    };
  }, []);

  useEffect(() => {
    const storageKey = `mtd-lingo-speaking-history:${session?.user?.id ?? "guest"}`;

    try {
      const storedValue = window.localStorage.getItem(storageKey);
      if (!storedValue) {
        hasLoadedHistory.current = true;
        return;
      }

      const parsedHistory = JSON.parse(storedValue) as unknown;
      if (Array.isArray(parsedHistory)) {
        setHistory(
          parsedHistory.filter(
            (entry): entry is SpeakingHistoryEntry =>
              typeof entry === "object" &&
              entry !== null &&
              typeof (entry as { topic?: unknown }).topic === "string" &&
              typeof (entry as { feedback?: unknown }).feedback === "string" &&
              typeof (entry as { response?: unknown }).response === "string" &&
              typeof (entry as { createdAt?: unknown }).createdAt === "string",
          ),
        );
      }
    } catch {
      setHistory([]);
    } finally {
      hasLoadedHistory.current = true;
    }
  }, [session?.user?.id]);

  useEffect(() => {
    if (!hasLoadedHistory.current) {
      return;
    }

    const storageKey = `mtd-lingo-speaking-history:${session?.user?.id ?? "guest"}`;

    try {
      window.localStorage.setItem(storageKey, JSON.stringify(history));
    } catch {
      // Ignore storage quota issues.
    }
  }, [history, session?.user?.id]);

  const handleToggleVoice = () => {
    if (!recognitionRef.current) {
      setSpeechError("Trình duyệt của bạn chưa hỗ trợ nhận diện giọng nói.");
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
      return;
    }

    setSpeechError(null);
    recognitionRef.current.start();
    setIsListening(true);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedResponse = response.trim();
    if (!trimmedResponse) {
      return;
    }

    setIsSubmitting(true);
    setSubmissionError(null);

    try {
      const nextFeedback = await getSpeakingCoachFeedbackRequest(
        {
          topic: selectedTopic.title,
          response: trimmedResponse,
        },
        session?.accessToken,
      );

      setMessages((currentMessages) => [
        ...currentMessages,
        { role: "user", content: trimmedResponse },
        {
          role: "assistant",
          content: `${nextFeedback.feedback}\n\nGợi ý cải thiện: ${nextFeedback.improvement}`,
        },
      ]);
      setHistory((currentHistory) => {
        const nextEntry: SpeakingHistoryEntry = {
          id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
          topic: selectedTopic.title,
          score: nextFeedback.score,
          feedback: nextFeedback.feedback,
          response: trimmedResponse,
          createdAt: new Date().toISOString(),
        };

        return [nextEntry, ...currentHistory].slice(0, 8);
      });
      setScore(nextFeedback.score);
      setFeedback(nextFeedback.feedback);
      setFeedbackSource(nextFeedback.source);
      setResponse("");
    } catch (error) {
      const fallbackMessage =
        error instanceof Error ? error.message : "Không thể kết nối AI lúc này.";
      setSubmissionError(fallbackMessage);
    } finally {
      setIsSubmitting(false);
    }
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
                    Điểm trung bình
                  </p>
                  <p className="mt-1 text-xl font-black text-white">{score}%</p>
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
                  onClick={() => {
                    setSelectedTopicId(topic.id);
                    setMessages(starterMessages);
                    setFeedback(
                      "Bạn đang nói khá tự tin. Hãy thêm một câu kết để làm câu trả lời trôi chảy hơn.",
                    );
                    setScore(78);
                  }}
                  className={`w-full rounded-2xl border px-4 py-4 text-left transition ${
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
                <p className="text-sm font-semibold text-cyan-300">Buổi luyện</p>
                <h2 className="text-xl font-black text-white">Phản hồi của AI</h2>
              </div>
              <div className="rounded-2xl border border-cyan-400/20 bg-cyan-400/10 px-3 py-2 text-right">
                <p className="text-xs uppercase tracking-[0.25em] text-cyan-300">Điểm số</p>
                <p className="text-lg font-black text-white">{score}%</p>
              </div>
            </div>

            <div className="mt-5 rounded-[24px] border border-white/10 bg-slate-950/70 p-4">
              <div className="space-y-3">
                {messages.map((message, index) => (
                  <div
                    key={`${message.role}-${index}`}
                    className={`rounded-2xl px-4 py-3 text-sm leading-7 ${
                      message.role === "assistant"
                        ? "bg-cyan-400/10 text-slate-200"
                        : "bg-white/10 text-slate-100"
                    }`}
                  >
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                      {message.role === "assistant" ? "Coach" : "Bạn"}
                    </p>
                    <p className="mt-2">{message.content}</p>
                  </div>
                ))}
              </div>
            </div>

            <form className="mt-5 space-y-3" onSubmit={handleSubmit}>
              <label className="block text-sm font-semibold text-slate-300" htmlFor="speaking-response">
                Trả lời bằng tiếng Anh
              </label>
              <textarea
                id="speaking-response"
                rows={4}
                value={response}
                onChange={(event) => setResponse(event.target.value)}
                placeholder="Ví dụ: I usually start my day with a coffee and a short walk."
                className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-slate-100 outline-none ring-0 placeholder:text-slate-500"
              />
              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={handleToggleVoice}
                  className="rounded-2xl border border-cyan-400/20 bg-cyan-400/10 px-3 py-2 text-sm font-semibold text-cyan-300 transition hover:bg-cyan-400/20"
                >
                  {isListening ? "⏹ Dừng ghi âm" : "🎤 Dùng giọng nói"}
                </button>
                {!speechSupported ? (
                  <span className="text-sm text-slate-400">Voice input không hỗ trợ trên trình duyệt này.</span>
                ) : null}
              </div>
              {speechError ? (
                <div className="rounded-2xl border border-amber-400/20 bg-amber-400/10 p-3 text-sm text-amber-200">
                  {speechError}
                </div>
              ) : null}
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-sm font-semibold text-white">Phản hồi coach</p>
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <span className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-2.5 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300">
                    {feedbackSource === "xai"
                      ? "xAI / Grok"
                      : feedbackSource === "openai"
                        ? "OpenAI"
                        : "Fallback"}
                  </span>
                  <span className="text-sm leading-7 text-slate-400">{feedback}</span>
                </div>
              </div>
              {submissionError ? (
                <div className="rounded-2xl border border-red-400/20 bg-red-400/10 p-3 text-sm text-red-200">
                  {submissionError}
                </div>
              ) : null}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-2xl bg-cyan-400 px-4 py-3 text-sm font-black text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isSubmitting ? "Đang gửi..." : "Gửi câu trả lời"}
              </button>
            </form>
          </div>
        </section>
      </div>
    </div>
  );
}

export default SpeakingCoachPage;
