import { useEffect, useMemo, useRef, useState } from "react";

import Button from "../../../components/ui/Button/Button";

type ListeningQuestion = {
  question: string;
  answers: string[];
  correct: number;
};

type ListeningLesson = {
  id: number;
  title: string;
  description: string;
  level: "A1" | "A2" | "B1" | "B2" | "C1" | "C2";
  duration: number;
  progress: number;
  category: string;
  icon: string;
  estimatedSeconds: number;
  speechRate: number;
  transcript: string;
  focusWords: string[];
  questions: ListeningQuestion[];
};

const listeningLessons: ListeningLesson[] = [
  {
    id: 1,
    title: "Greetings and Introductions",
    description:
      "Luyện nghe các đoạn hội thoại chào hỏi và giới thiệu bản thân.",
    level: "A1",
    duration: 8,
    progress: 100,
    category: "Giao tiếp",
    icon: "👋",
    estimatedSeconds: 58,
    speechRate: 0.78,
    transcript:
      "Good morning. My name is Anna. I am from Canada, and I am studying English for work. Nice to meet you. Hi Anna, I am Minh. I live in Da Nang. I work at a small hotel near the beach. Nice to meet you too. What do you like doing after work? I like listening to music and walking with my friends. That sounds great.",
    focusWords: ["nice to meet you", "from", "work", "after work", "sounds"],
    questions: [
      {
        question: "Where is Anna from?",
        answers: ["Canada", "Da Nang", "A hotel"],
        correct: 0,
      },
      {
        question: "Where does Minh work?",
        answers: ["At a school", "At a small hotel", "At the airport"],
        correct: 1,
      },
      {
        question: "What does Anna like doing after work?",
        answers: ["Cooking dinner", "Walking with friends", "Reading news"],
        correct: 1,
      },
    ],
  },
  {
    id: 2,
    title: "Daily Activities",
    description: "Nghe và nhận biết các hoạt động thường ngày.",
    level: "A2",
    duration: 12,
    progress: 72,
    category: "Cuộc sống",
    icon: "☀️",
    estimatedSeconds: 76,
    speechRate: 0.82,
    transcript:
      "Every weekday, Daniel gets up at six thirty. He checks his messages, makes coffee, and reads the plan for the day. At eight o'clock, he takes the bus to the office. Today is different because he has a team meeting at nine. After work, he usually goes to the gym, but tonight he is meeting his sister for dinner.",
    focusWords: ["weekday", "gets up", "takes the bus", "meeting", "usually"],
    questions: [
      {
        question: "What time does Daniel get up?",
        answers: ["At six thirty", "At eight o'clock", "At nine o'clock"],
        correct: 0,
      },
      {
        question: "What time does the meeting begin?",
        answers: ["At nine o'clock", "In the meeting room", "With his sister"],
        correct: 0,
      },
      {
        question: "What is Daniel doing tonight?",
        answers: [
          "Going to the gym",
          "Meeting his sister for dinner",
          "Taking the bus home",
        ],
        correct: 1,
      },
    ],
  },
  {
    id: 3,
    title: "At the Office",
    description: "Hội thoại trong môi trường làm việc và văn phòng.",
    level: "A2",
    duration: 15,
    progress: 45,
    category: "Công sở",
    icon: "💼",
    estimatedSeconds: 82,
    speechRate: 0.84,
    transcript:
      "Hello, this is Rachel from customer support. I am calling about the printer on the third floor. It is not working again. Could someone check it before lunch? We have to print the contracts for the new clients. Of course. I will ask the technician to come at eleven fifteen. Please send me the room number by email.",
    focusWords: ["customer support", "printer", "third floor", "contracts"],
    questions: [
      {
        question: "Why did Rachel call?",
        answers: [
          "To report a printer problem",
          "To order lunch",
          "To change a meeting room",
        ],
        correct: 0,
      },
      {
        question: "What needs to be printed?",
        answers: ["Tickets", "Contracts", "Reports"],
        correct: 1,
      },
      {
        question: "When will the technician come?",
        answers: ["Before nine", "At eleven fifteen", "After work"],
        correct: 1,
      },
    ],
  },
  {
    id: 4,
    title: "Travel Announcements",
    description: "Luyện nghe thông báo tại sân bay, nhà ga và khách sạn.",
    level: "B1",
    duration: 18,
    progress: 20,
    category: "Du lịch",
    icon: "✈️",
    estimatedSeconds: 88,
    speechRate: 0.88,
    transcript:
      "Attention passengers on flight 482 to Singapore. Boarding will begin in approximately twenty minutes at gate B twelve. Because of heavy rain, the departure time has been delayed by thirty minutes. Passengers with small children or those needing assistance may board first. Please keep your passport and boarding pass ready for inspection.",
    focusWords: ["boarding", "approximately", "delayed", "assistance"],
    questions: [
      {
        question: "Where is the flight going?",
        answers: ["Singapore", "Sydney", "Seoul"],
        correct: 0,
      },
      {
        question: "Why is the departure delayed?",
        answers: ["Heavy rain", "A missing passport", "A gate change"],
        correct: 0,
      },
      {
        question: "Who may board first?",
        answers: [
          "Business travelers",
          "Passengers needing assistance",
          "People without luggage",
        ],
        correct: 1,
      },
    ],
  },
  {
    id: 5,
    title: "News and Interviews",
    description: "Nghe các bản tin ngắn và cuộc phỏng vấn bằng tiếng Anh.",
    level: "B2",
    duration: 22,
    progress: 0,
    category: "Nâng cao",
    icon: "🎙️",
    estimatedSeconds: 98,
    speechRate: 0.9,
    transcript:
      "A new community library opened downtown this morning after two years of planning. The project was funded by local businesses and volunteers. In an interview, the director said the library is not only a place to borrow books, but also a learning hub where residents can attend workshops, practise digital skills, and meet language partners.",
    focusWords: ["community", "funded", "volunteers", "learning hub"],
    questions: [
      {
        question: "What opened downtown?",
        answers: ["A community library", "A train station", "A hospital"],
        correct: 0,
      },
      {
        question: "Who helped fund the project?",
        answers: ["Only the government", "Local businesses", "Tourists"],
        correct: 1,
      },
      {
        question: "What can residents practise there?",
        answers: ["Digital skills", "Driving", "Cooking"],
        correct: 0,
      },
    ],
  },
  {
    id: 6,
    title: "Question and Response",
    description: "Luyện phản xạ với dạng câu hỏi và câu trả lời ngắn.",
    level: "B1",
    duration: 16,
    progress: 60,
    category: "TOEIC",
    icon: "❓",
    estimatedSeconds: 72,
    speechRate: 0.88,
    transcript:
      "Where should I put these documents? Please leave them on my desk. When will the client arrive? Around two thirty, if the train is on time. Did you send the updated invoice? Yes, I emailed it this morning. Who is leading the presentation? I think Sarah is, but we should confirm with her.",
    focusWords: ["documents", "client", "invoice", "presentation"],
    questions: [
      {
        question: "Where should the documents be placed?",
        answers: ["On the desk", "In the kitchen", "At reception"],
        correct: 0,
      },
      {
        question: "When will the client arrive?",
        answers: ["Around two thirty", "This morning", "Next week"],
        correct: 0,
      },
      {
        question: "Who may lead the presentation?",
        answers: ["Sarah", "The client", "The receptionist"],
        correct: 0,
      },
    ],
  },
  {
    id: 7,
    title: "Shopping and Returns",
    description:
      "Nghe tình huống mua sắm, đổi trả hàng và hỏi thông tin sản phẩm.",
    level: "A2",
    duration: 14,
    progress: 35,
    category: "Mua sắm",
    icon: "🛍️",
    estimatedSeconds: 74,
    speechRate: 0.82,
    transcript:
      "Excuse me, I bought this jacket yesterday, but the size is too small. Do you have a medium in blue? Let me check. Yes, we have one left. Would you like to exchange it or get a refund? I would like to exchange it, please. No problem. May I see your receipt?",
    focusWords: ["jacket", "medium", "exchange", "refund", "receipt"],
    questions: [
      {
        question: "What did the customer buy?",
        answers: ["A jacket", "A receipt", "A blue bag"],
        correct: 0,
      },
      {
        question: "What size does the customer want?",
        answers: ["Small", "Medium", "Large"],
        correct: 1,
      },
      {
        question: "What does the shop assistant ask to see?",
        answers: ["A passport", "A receipt", "A credit card"],
        correct: 1,
      },
    ],
  },
  {
    id: 8,
    title: "Doctor Appointment",
    description: "Nghe hội thoại đặt lịch khám và mô tả triệu chứng cơ bản.",
    level: "B1",
    duration: 17,
    progress: 15,
    category: "Sức khỏe",
    icon: "🩺",
    estimatedSeconds: 86,
    speechRate: 0.86,
    transcript:
      "Good afternoon. I would like to make an appointment with Dr. Evans. I have had a sore throat and a mild fever since Monday. The earliest appointment is tomorrow at ten forty-five. Does that work for you? Yes, that is fine. Please arrive ten minutes early and bring your health insurance card.",
    focusWords: ["appointment", "sore throat", "mild fever", "insurance"],
    questions: [
      {
        question: "What symptoms does the caller have?",
        answers: ["A sore throat and fever", "A broken arm", "Back pain"],
        correct: 0,
      },
      {
        question: "When is the appointment?",
        answers: [
          "Today at ten",
          "Tomorrow at ten forty-five",
          "Monday morning",
        ],
        correct: 1,
      },
      {
        question: "What should the caller bring?",
        answers: ["A report", "A receipt", "An insurance card"],
        correct: 2,
      },
    ],
  },
  {
    id: 9,
    title: "University Seminar",
    description: "Nghe thông báo học thuật, lịch seminar và yêu cầu chuẩn bị.",
    level: "B2",
    duration: 24,
    progress: 0,
    category: "Giáo dục",
    icon: "🎓",
    estimatedSeconds: 110,
    speechRate: 0.9,
    transcript:
      "This Friday's seminar will focus on sustainable urban design. Students are expected to read the assigned article before attending and prepare two questions for discussion. The guest speaker is an architect who has worked on public transport projects in three countries. Attendance will count toward your participation grade.",
    focusWords: ["seminar", "sustainable", "assigned", "attendance"],
    questions: [
      {
        question: "What is the seminar about?",
        answers: ["Urban design", "Ancient history", "Online marketing"],
        correct: 0,
      },
      {
        question: "What should students prepare?",
        answers: ["Two questions", "A full essay", "A presentation slide"],
        correct: 0,
      },
      {
        question: "What will attendance affect?",
        answers: [
          "The final exam date",
          "Participation grade",
          "Library access",
        ],
        correct: 1,
      },
    ],
  },
  {
    id: 10,
    title: "Product Strategy Meeting",
    description: "Nghe thảo luận công việc có nhiều ý kiến, ưu tiên và rủi ro.",
    level: "C1",
    duration: 28,
    progress: 0,
    category: "Công việc",
    icon: "📊",
    estimatedSeconds: 126,
    speechRate: 0.93,
    transcript:
      "Before we commit to the new release date, we need to consider two constraints. First, the engineering team is still resolving a security issue that affects account recovery. Second, customer support needs at least one week to update the help centre and train agents. If we launch too early, we may create more confusion than momentum.",
    focusWords: ["commit", "constraints", "account recovery", "momentum"],
    questions: [
      {
        question: "What issue is engineering resolving?",
        answers: ["A security issue", "A hiring issue", "A payment delay"],
        correct: 0,
      },
      {
        question: "Why does support need one week?",
        answers: [
          "To update help materials and train agents",
          "To hire new designers",
          "To translate the website into French",
        ],
        correct: 0,
      },
      {
        question: "What risk does the speaker mention?",
        answers: [
          "Creating confusion",
          "Losing the office",
          "Missing a flight",
        ],
        correct: 0,
      },
    ],
  },
  {
    id: 11,
    title: "Climate Policy Interview",
    description: "Nghe phỏng vấn nâng cao về chính sách khí hậu và kinh tế.",
    level: "C1",
    duration: 30,
    progress: 0,
    category: "Môi trường",
    icon: "🌿",
    estimatedSeconds: 132,
    speechRate: 0.94,
    transcript:
      "The challenge is not simply persuading people that climate change is real. The harder question is how to design policies that are both effective and politically durable. A carbon tax, for example, may reduce emissions, but without careful redistribution it can place a disproportionate burden on lower income households.",
    focusWords: ["durable", "carbon tax", "emissions", "redistribution"],
    questions: [
      {
        question: "What does the speaker say is the harder question?",
        answers: [
          "Designing effective and durable policies",
          "Finding colder weather",
          "Building more airports",
        ],
        correct: 0,
      },
      {
        question: "What can a carbon tax reduce?",
        answers: ["Emissions", "Education", "Household size"],
        correct: 0,
      },
      {
        question: "Who may be affected without redistribution?",
        answers: [
          "Lower income households",
          "Only tourists",
          "University professors",
        ],
        correct: 0,
      },
    ],
  },
  {
    id: 12,
    title: "Cultural Commentary",
    description:
      "Nghe bình luận C2 với lập luận trừu tượng và sắc thái ngôn ngữ.",
    level: "C2",
    duration: 34,
    progress: 0,
    category: "Xã hội",
    icon: "🧠",
    estimatedSeconds: 145,
    speechRate: 0.96,
    transcript:
      "What makes a city memorable is rarely its skyline alone. It is the accumulation of small rituals: the vendor who remembers your order, the square where strangers linger without suspicion, the library that becomes a refuge during rain. Urban identity is produced less by monuments than by repeated acts of belonging.",
    focusWords: ["accumulation", "rituals", "refuge", "belonging"],
    questions: [
      {
        question: "What does the speaker say makes a city memorable?",
        answers: ["Small rituals", "Only its skyline", "Expensive apartments"],
        correct: 0,
      },
      {
        question: "What is the library described as?",
        answers: ["A refuge during rain", "A private office", "A monument"],
        correct: 0,
      },
      {
        question: "Urban identity is produced mostly by what?",
        answers: [
          "Repeated acts of belonging",
          "Traffic rules",
          "Tall buildings",
        ],
        correct: 0,
      },
    ],
  },
  {
    id: 13,
    title: "Academic Debate",
    description:
      "Nghe tranh luận học thuật C2 về công nghệ, tri thức và xã hội.",
    level: "C2",
    duration: 36,
    progress: 0,
    category: "Công nghệ",
    icon: "🔬",
    estimatedSeconds: 152,
    speechRate: 0.96,
    transcript:
      "The question is not whether artificial intelligence can produce fluent language; it plainly can. The more consequential issue is whether institutions can cultivate the judgement required to evaluate that fluency. Without such judgement, eloquence may be mistaken for evidence and speed for understanding.",
    focusWords: ["consequential", "cultivate", "judgement", "eloquence"],
    questions: [
      {
        question: "What can artificial intelligence plainly produce?",
        answers: ["Fluent language", "Physical buildings", "Weather patterns"],
        correct: 0,
      },
      {
        question: "What must institutions cultivate?",
        answers: ["Judgement", "Silence", "More traffic"],
        correct: 0,
      },
      {
        question: "What may be mistaken for evidence?",
        answers: ["Eloquence", "Rain", "A calendar"],
        correct: 0,
      },
    ],
  },
];

const levels = ["Tất cả", "A1", "A2", "B1", "B2", "C1", "C2"];

function formatTime(seconds: number): string {
  const safeSeconds = Math.max(0, Math.floor(seconds));
  const minutes = Math.floor(safeSeconds / 60);
  const remainingSeconds = safeSeconds % 60;

  return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
    .toString()
    .padStart(2, "0")}`;
}

function createUtterance(lesson: ListeningLesson): SpeechSynthesisUtterance {
  const utterance = new SpeechSynthesisUtterance(lesson.transcript);
  utterance.lang = "en-US";
  utterance.rate = lesson.speechRate;
  utterance.pitch = 1;
  utterance.volume = 1;

  const voices = window.speechSynthesis.getVoices();
  const preferredVoice = voices.find(
    (voice) =>
      voice.lang.toLowerCase().startsWith("en") &&
      /samantha|victoria|daniel|google us english|microsoft/i.test(voice.name),
  );

  if (preferredVoice) {
    utterance.voice = preferredVoice;
  }

  return utterance;
}

function ListeningPage() {
  const [selectedLevel, setSelectedLevel] = useState("Tất cả");
  const [activeLesson, setActiveLesson] = useState<ListeningLesson>(
    listeningLessons[1],
  );
  const [isPlaying, setIsPlaying] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [checkedAnswer, setCheckedAnswer] = useState<number | null>(null);
  const [isTranscriptVisible, setIsTranscriptVisible] = useState(false);
  const [audioMessage, setAudioMessage] = useState("");
  const progressTimerRef = useRef<number | null>(null);

  const filteredLessons = useMemo(() => {
    if (selectedLevel === "Tất cả") {
      return listeningLessons;
    }

    return listeningLessons.filter((lesson) => lesson.level === selectedLevel);
  }, [selectedLevel]);

  const completedLessons = listeningLessons.filter(
    (lesson) => lesson.progress === 100,
  ).length;

  const totalMinutes = listeningLessons.reduce(
    (total, lesson) => total + lesson.duration,
    0,
  );
  const totalQuestions = listeningLessons.reduce(
    (total, lesson) => total + lesson.questions.length,
    0,
  );
  const levelCount = new Set(listeningLessons.map((lesson) => lesson.level))
    .size;

  const activeProgressPercent = Math.min(
    100,
    Math.round((elapsedSeconds / activeLesson.estimatedSeconds) * 100),
  );
  const activeQuestion = activeLesson.questions[currentQuestion];
  const isCorrect =
    checkedAnswer !== null && checkedAnswer === activeQuestion.correct;

  useEffect(() => {
    const loadVoices = () => {
      if ("speechSynthesis" in window) {
        window.speechSynthesis.getVoices();
      }
    };

    loadVoices();
    window.speechSynthesis?.addEventListener?.("voiceschanged", loadVoices);

    return () => {
      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
        window.speechSynthesis.removeEventListener?.(
          "voiceschanged",
          loadVoices,
        );
      }
    };
  }, []);

  useEffect(() => {
    if (!isPlaying) {
      if (progressTimerRef.current !== null) {
        window.clearInterval(progressTimerRef.current);
        progressTimerRef.current = null;
      }
      return;
    }

    progressTimerRef.current = window.setInterval(() => {
      setElapsedSeconds((current) => {
        if (current >= activeLesson.estimatedSeconds) {
          return activeLesson.estimatedSeconds;
        }

        return current + 1;
      });
    }, 1000);

    return () => {
      if (progressTimerRef.current !== null) {
        window.clearInterval(progressTimerRef.current);
        progressTimerRef.current = null;
      }
    };
  }, [activeLesson.estimatedSeconds, isPlaying]);

  const stopAudio = (resetProgress = false) => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }

    setIsPlaying(false);

    if (resetProgress) {
      setElapsedSeconds(0);
    }
  };

  const playAudio = () => {
    if (!("speechSynthesis" in window)) {
      setAudioMessage(
        "Trình duyệt này chưa hỗ trợ phát giọng đọc. Hãy thử Chrome/Safari mới nhất.",
      );
      return;
    }

    window.speechSynthesis.cancel();
    setAudioMessage("");

    const utterance = createUtterance(activeLesson);

    utterance.onstart = () => {
      setIsPlaying(true);
    };
    utterance.onend = () => {
      setIsPlaying(false);
      setElapsedSeconds(activeLesson.estimatedSeconds);
    };
    utterance.onerror = () => {
      setIsPlaying(false);
      setAudioMessage(
        "Chưa phát được âm thanh. Hãy bấm lại nút Play hoặc kiểm tra âm lượng/tab đang bị mute.",
      );
    };

    if (elapsedSeconds >= activeLesson.estimatedSeconds) {
      setElapsedSeconds(0);
    }

    window.speechSynthesis.speak(utterance);

    window.setTimeout(() => {
      if (!window.speechSynthesis.speaking && !window.speechSynthesis.pending) {
        setAudioMessage(
          "Trình duyệt đang chặn giọng đọc. Hãy bấm Play thêm một lần sau khi đã tương tác với trang.",
        );
      }
    }, 400);
  };

  const handleToggleAudio = () => {
    if (isPlaying) {
      stopAudio(true);
      return;
    }

    playAudio();
  };

  const handleSelectLesson = (lesson: ListeningLesson) => {
    stopAudio();
    setActiveLesson(lesson);
    setElapsedSeconds(0);
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setCheckedAnswer(null);
    setAudioMessage("");
  };

  const handleNextQuestion = () => {
    setCurrentQuestion(
      (current) => (current + 1) % activeLesson.questions.length,
    );
    setSelectedAnswer(null);
    setCheckedAnswer(null);
  };

  return (
    <div className="mx-auto max-w-[1500px] px-5 py-7 sm:px-8 sm:py-9">
      <section className="premium-surface relative overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br from-cyan-500/15 via-slate-950 to-violet-500/15 p-6 shadow-2xl shadow-cyan-950/20 sm:p-8">
        <div
          aria-hidden="true"
          className="absolute -right-16 -top-20 h-72 w-72 rounded-full bg-cyan-400/20 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="absolute -bottom-24 left-1/3 h-72 w-72 rounded-full bg-violet-500/20 blur-3xl"
        />

        <div className="relative flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <p className="text-sm font-black uppercase tracking-[0.2em] text-cyan-300">
                Listening Lab
              </p>
              <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-[11px] font-black uppercase tracking-wider text-emerald-300">
                Real browser audio
              </span>
            </div>

            <h1 className="mt-4 max-w-4xl text-3xl font-black tracking-tight text-white sm:text-5xl">
              Nghe hiểu tiếng Anh tự nhiên, từ A1 đến C2
            </h1>

            <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-400">
              Luyện nghe theo cấp độ, phát âm trực tiếp trong trình duyệt, có
              transcript, từ khóa, câu hỏi kiểm tra và phản hồi đúng/sai sau mỗi
              bài.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 xl:min-w-[360px]">
            <Button
              type="button"
              size="large"
              className="w-full"
              onClick={() => handleSelectLesson(listeningLessons[1])}
            >
              Tiếp tục luyện nghe →
            </Button>
            <Button
              type="button"
              variant="secondary"
              size="large"
              className="w-full"
              onClick={() => setIsTranscriptVisible(true)}
            >
              Mở transcript
            </Button>
          </div>
        </div>
      </section>

      <section className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <article className="rounded-3xl border border-white/10 bg-slate-900/60 p-5 shadow-xl shadow-black/10">
          <p className="text-sm text-slate-400">Bài nghe</p>
          <p className="mt-2 text-3xl font-black">{listeningLessons.length}</p>
          <p className="mt-5 text-xs font-semibold text-cyan-300">
            Đủ {levelCount} cấp độ
          </p>
        </article>

        <article className="rounded-3xl border border-white/10 bg-slate-900/60 p-5 shadow-xl shadow-black/10">
          <p className="text-sm text-slate-400">Đã hoàn thành</p>
          <p className="mt-2 text-3xl font-black">{completedLessons}</p>
          <p className="mt-5 text-xs font-semibold text-emerald-300">
            Tiếp tục duy trì
          </p>
        </article>

        <article className="rounded-3xl border border-white/10 bg-slate-900/60 p-5 shadow-xl shadow-black/10">
          <p className="text-sm text-slate-400">Tổng thời lượng</p>
          <p className="mt-2 text-3xl font-black">{totalMinutes} phút</p>
          <p className="mt-5 text-xs font-semibold text-violet-300">
            Nội dung luyện tập
          </p>
        </article>

        <article className="rounded-3xl border border-white/10 bg-gradient-to-br from-cyan-500/15 via-slate-900 to-blue-500/10 p-5 shadow-xl shadow-cyan-950/10">
          <p className="text-sm text-slate-400">Câu hỏi luyện tập</p>
          <p className="mt-2 text-3xl font-black">{totalQuestions}</p>
          <p className="mt-5 text-xs font-semibold text-amber-300">
            Nghe · hiểu ý · bắt chi tiết
          </p>
        </article>
      </section>

      <section className="mt-6 grid gap-4 lg:grid-cols-3">
        {[
          {
            title: "1. Nghe lấy ý chính",
            detail:
              "Bấm Play, chưa nhìn transcript, cố gắng nắm ai đang nói và mục đích là gì.",
            tone: "cyan",
          },
          {
            title: "2. Bắt từ khóa",
            detail:
              "Nghe lại và đánh dấu các cụm quan trọng trong phần từ khóa cần nghe.",
            tone: "violet",
          },
          {
            title: "3. Kiểm tra chi tiết",
            detail:
              "Trả lời câu hỏi, mở transcript để đối chiếu và nghe lại phần bị hụt.",
            tone: "emerald",
          },
        ].map((step) => (
          <article
            key={step.title}
            className="group rounded-3xl border border-white/10 bg-white/[0.035] p-5 transition duration-300 hover:-translate-y-0.5 hover:border-cyan-400/25 hover:bg-white/[0.055]"
          >
            <span
              className={`inline-flex rounded-full border px-3 py-1 text-[11px] font-black uppercase tracking-wider ${
                step.tone === "cyan"
                  ? "border-cyan-400/20 bg-cyan-400/10 text-cyan-300"
                  : step.tone === "violet"
                    ? "border-violet-400/20 bg-violet-400/10 text-violet-300"
                    : "border-emerald-400/20 bg-emerald-400/10 text-emerald-300"
              }`}
            >
              Practice flow
            </span>
            <h2 className="mt-4 text-lg font-black text-white">{step.title}</h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              {step.detail}
            </p>
          </article>
        ))}
      </section>

      <section className="mt-6 grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <article className="rounded-3xl border border-white/10 bg-slate-900/60 p-5 sm:p-6">
          <div>
            <h2 className="text-xl font-black">Danh sách bài nghe</h2>
            <p className="mt-1 text-sm text-slate-500">
              Chọn bài phù hợp với trình độ của bạn
            </p>
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            {levels.map((level) => (
              <button
                key={level}
                type="button"
                onClick={() => setSelectedLevel(level)}
                className={`rounded-xl border px-4 py-2 text-sm font-bold transition ${
                  selectedLevel === level
                    ? "border-cyan-400 bg-cyan-400 text-slate-950"
                    : "border-white/10 bg-white/[0.03] text-slate-400 hover:border-white/20 hover:text-white"
                }`}
              >
                {level}
              </button>
            ))}
          </div>

          <div className="mt-6 space-y-3">
            {filteredLessons.map((lesson) => (
              <button
                key={lesson.id}
                type="button"
                onClick={() => handleSelectLesson(lesson)}
                className={`w-full rounded-2xl border p-4 text-left transition ${
                  activeLesson.id === lesson.id
                    ? "border-cyan-400/40 bg-cyan-400/[0.07]"
                    : "border-white/10 bg-white/[0.025] hover:border-white/20"
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/5 text-xl">
                    {lesson.icon}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-black">{lesson.title}</p>

                      <span className="rounded-lg bg-white/5 px-2 py-1 text-xs font-bold text-cyan-300">
                        {lesson.level}
                      </span>
                    </div>

                    <p className="mt-2 text-sm leading-6 text-slate-400">
                      {lesson.description}
                    </p>

                    <div className="mt-3 flex items-center justify-between gap-4">
                      <span className="text-xs text-slate-500">
                        {lesson.duration} phút · {lesson.category}
                      </span>

                      <span className="text-xs font-bold text-cyan-300">
                        {lesson.progress}%
                      </span>
                    </div>

                    <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-800">
                      <div
                        className="h-full rounded-full bg-cyan-400"
                        style={{ width: `${lesson.progress}%` }}
                      />
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </article>

        <article className="h-fit rounded-3xl border border-white/10 bg-gradient-to-br from-cyan-500/10 via-slate-900 to-violet-500/10 p-5 sm:p-7">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-cyan-300">
                Đang luyện tập
              </p>

              <h2 className="mt-3 text-2xl font-black">{activeLesson.title}</h2>

              <p className="mt-2 text-sm leading-6 text-slate-400">
                {activeLesson.description}
              </p>
            </div>

            <span className="w-fit rounded-xl border border-cyan-400/20 bg-cyan-400/10 px-3 py-2 text-xs font-bold text-cyan-300">
              {activeLesson.level}
            </span>
          </div>

          <div className="mt-7 rounded-3xl border border-white/10 bg-slate-950/60 p-6">
            <div className="flex items-center justify-center">
              <button
                type="button"
                onClick={handleToggleAudio}
                aria-label={isPlaying ? "Dừng bài nghe" : "Phát bài nghe"}
                className={`flex h-20 w-20 items-center justify-center rounded-full text-3xl text-slate-950 transition hover:scale-105 ${
                  isPlaying
                    ? "animate-pulse bg-amber-300 hover:bg-amber-200"
                    : "bg-cyan-400 hover:bg-cyan-300"
                }`}
              >
                {isPlaying ? "■" : "▶"}
              </button>
            </div>

            <div className="mt-7">
              <div
                role="progressbar"
                aria-label="Tiến độ bài nghe"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={activeProgressPercent}
                className="h-2 overflow-hidden rounded-full bg-slate-800"
              >
                <div
                  className="h-full rounded-full bg-cyan-400 transition-all duration-500"
                  style={{ width: `${activeProgressPercent}%` }}
                />
              </div>

              <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
                <span>{formatTime(elapsedSeconds)}</span>
                <span>{formatTime(activeLesson.estimatedSeconds)}</span>
              </div>
            </div>

            {audioMessage && (
              <p
                role="alert"
                className="mt-4 rounded-2xl border border-amber-400/20 bg-amber-400/10 px-4 py-3 text-xs font-semibold leading-5 text-amber-200"
              >
                {audioMessage}
              </p>
            )}

            <div className="mt-5 flex flex-wrap gap-2">
              <Button
                type="button"
                variant="secondary"
                size="small"
                onClick={() => {
                  stopAudio(true);
                  setElapsedSeconds(0);
                }}
              >
                Nghe lại từ đầu
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="small"
                onClick={() => setIsTranscriptVisible((current) => !current)}
              >
                {isTranscriptVisible ? "Ẩn transcript" : "Hiện transcript"}
              </Button>
            </div>
          </div>

          <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <p className="text-xs font-black uppercase tracking-[0.16em] text-violet-300">
              Từ khóa cần nghe
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {activeLesson.focusWords.map((word) => (
                <span
                  key={word}
                  className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-bold text-slate-300"
                >
                  {word}
                </span>
              ))}
            </div>
          </div>

          {isTranscriptVisible && (
            <div className="mt-5 rounded-2xl border border-cyan-400/20 bg-cyan-400/[0.06] p-5">
              <p className="text-xs font-black uppercase tracking-[0.16em] text-cyan-300">
                Transcript
              </p>
              <p className="mt-3 text-sm leading-7 text-slate-300">
                {activeLesson.transcript}
              </p>
            </div>
          )}

          <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <div className="flex items-center justify-between gap-4">
              <p className="text-sm font-black">
                Câu hỏi {currentQuestion + 1}/{activeLesson.questions.length}
              </p>

              <button
                type="button"
                onClick={handleNextQuestion}
                className="text-xs font-bold text-cyan-300"
              >
                Câu tiếp theo →
              </button>
            </div>

            <p className="mt-5 text-lg font-bold">{activeQuestion.question}</p>

            <div className="mt-5 space-y-3">
              {activeQuestion.answers.map((answer, index) => {
                const isSelected = selectedAnswer === index;
                const isChecked = checkedAnswer !== null;
                const isRightAnswer = activeQuestion.correct === index;

                return (
                  <button
                    key={answer}
                    type="button"
                    onClick={() => {
                      setSelectedAnswer(index);
                      setCheckedAnswer(null);
                    }}
                    className={`flex w-full items-center gap-3 rounded-xl border p-4 text-left text-sm transition ${
                      isChecked && isRightAnswer
                        ? "border-emerald-400/50 bg-emerald-400/10 text-emerald-100"
                        : isChecked && isSelected
                          ? "border-red-400/40 bg-red-400/10 text-red-100"
                          : isSelected
                            ? "border-cyan-400/40 bg-cyan-400/[0.08] text-cyan-100"
                            : "border-white/10 bg-white/[0.025] hover:border-cyan-400/30 hover:bg-cyan-400/[0.05]"
                    }`}
                  >
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white/5 text-xs font-black">
                      {String.fromCharCode(65 + index)}
                    </span>

                    {answer}
                  </button>
                );
              })}
            </div>

            <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <Button
                type="button"
                size="small"
                disabled={selectedAnswer === null}
                onClick={() => setCheckedAnswer(selectedAnswer)}
              >
                Kiểm tra đáp án
              </Button>

              {checkedAnswer !== null && (
                <p
                  role="status"
                  className={`text-sm font-bold ${
                    isCorrect ? "text-emerald-300" : "text-red-300"
                  }`}
                >
                  {isCorrect
                    ? "Chính xác — tai bạn bắt key khá ổn đó."
                    : `Chưa đúng. Đáp án là ${String.fromCharCode(
                        65 + activeQuestion.correct,
                      )}.`}
                </p>
              )}
            </div>
          </div>
        </article>
      </section>
    </div>
  );
}

export default ListeningPage;
