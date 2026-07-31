import type {
  Flashcard,
  Lesson,
  QuizQuestion,
} from "../types/learning";

export const lessons: Lesson[] = [
  {
    id: "lesson-001",
    title: "Greetings and Introductions",
    category: "Giao tiếp",
    level: "A1",
    duration: 18,
    description:
      "Học cách chào hỏi, giới thiệu bản thân và bắt đầu một cuộc trò chuyện bằng tiếng Anh.",
    sections: [
      {
        id: "introduction",
        title: "1. Cách chào hỏi thông dụng",
        content: [
          "Hello và Hi đều có nghĩa là xin chào. Hi thường được sử dụng trong những tình huống thân mật.",
          "Good morning được sử dụng vào buổi sáng. Good afternoon dùng vào buổi chiều và Good evening dùng vào buổi tối.",
          "Khi gặp một người lần đầu, bạn có thể nói: Nice to meet you.",
        ],
        vocabulary: [
          {
            word: "hello",
            phonetic: "/həˈləʊ/",
            meaning: "xin chào",
          },
          {
            word: "morning",
            phonetic: "/ˈmɔːnɪŋ/",
            meaning: "buổi sáng",
          },
          {
            word: "meet",
            phonetic: "/miːt/",
            meaning: "gặp gỡ",
          },
        ],
      },
      {
        id: "self-introduction",
        title: "2. Giới thiệu bản thân",
        content: [
          "Để giới thiệu tên, sử dụng: My name is... hoặc I'm...",
          "Để nói nơi bạn sinh sống, sử dụng: I live in...",
          "Để nói nghề nghiệp, sử dụng: I work as... hoặc I'm a/an...",
        ],
        vocabulary: [
          {
            word: "name",
            phonetic: "/neɪm/",
            meaning: "tên",
          },
          {
            word: "live",
            phonetic: "/lɪv/",
            meaning: "sinh sống",
          },
          {
            word: "work",
            phonetic: "/wɜːk/",
            meaning: "làm việc",
          },
        ],
      },
      {
        id: "conversation",
        title: "3. Hội thoại mẫu",
        content: [
          "Anna: Hello! My name is Anna. What's your name?",
          "David: Hi Anna. I'm David. Nice to meet you.",
          "Anna: Nice to meet you too. Where are you from?",
          "David: I'm from Vietnam.",
        ],
      },
    ],
  },
  {
    id: "lesson-002",
    title: "Daily Activities",
    category: "Cuộc sống",
    level: "A2",
    duration: 22,
    description:
      "Mô tả lịch trình và những hoạt động thường ngày bằng thì hiện tại đơn.",
    sections: [
      {
        id: "daily-verbs",
        title: "1. Động từ chỉ hoạt động hằng ngày",
        content: [
          "Wake up có nghĩa là thức dậy.",
          "Have breakfast có nghĩa là ăn sáng.",
          "Go to work hoặc go to school được dùng để nói về việc đi làm hoặc đi học.",
        ],
        vocabulary: [
          {
            word: "wake up",
            phonetic: "/weɪk ʌp/",
            meaning: "thức dậy",
          },
          {
            word: "breakfast",
            phonetic: "/ˈbrekfəst/",
            meaning: "bữa sáng",
          },
          {
            word: "usually",
            phonetic: "/ˈjuːʒuəli/",
            meaning: "thường xuyên",
          },
        ],
      },
      {
        id: "present-simple",
        title: "2. Thì hiện tại đơn",
        content: [
          "Sử dụng thì hiện tại đơn để nói về thói quen hoặc sự việc lặp lại.",
          "Với chủ ngữ I, You, We, They, sử dụng động từ nguyên mẫu.",
          "Với He, She, It, động từ thường thêm s hoặc es.",
        ],
      },
    ],
  },
  {
    id: "lesson-003",
    title: "Office Communication",
    category: "Công sở",
    level: "B1",
    duration: 25,
    description:
      "Luyện các mẫu câu thường sử dụng trong email, cuộc họp và môi trường văn phòng.",
    sections: [
      {
        id: "office-phrases",
        title: "1. Cụm từ công sở",
        content: [
          "Could you send me the report? được dùng để yêu cầu ai đó gửi báo cáo.",
          "Let's schedule a meeting được dùng khi muốn sắp xếp một cuộc họp.",
          "I'll get back to you có nghĩa là tôi sẽ phản hồi lại sau.",
        ],
        vocabulary: [
          {
            word: "report",
            phonetic: "/rɪˈpɔːt/",
            meaning: "báo cáo",
          },
          {
            word: "schedule",
            phonetic: "/ˈʃedjuːl/",
            meaning: "lên lịch",
          },
          {
            word: "deadline",
            phonetic: "/ˈdedlaɪn/",
            meaning: "hạn chót",
          },
        ],
      },
    ],
  },
];

export const flashcards: Flashcard[] = [
  {
    id: "flashcard-001",
    word: "achievement",
    phonetic: "/əˈtʃiːvmənt/",
    meaning: "thành tựu, thành tích",
    example: "Completing the course was a great achievement.",
    topic: "Giáo dục",
  },
  {
    id: "flashcard-002",
    word: "appointment",
    phonetic: "/əˈpɔɪntmənt/",
    meaning: "cuộc hẹn",
    example: "I have an appointment with the manager.",
    topic: "Công sở",
  },
  {
    id: "flashcard-003",
    word: "available",
    phonetic: "/əˈveɪləbl/",
    meaning: "có sẵn, rảnh",
    example: "The meeting room is available this afternoon.",
    topic: "Công sở",
  },
  {
    id: "flashcard-004",
    word: "destination",
    phonetic: "/ˌdestɪˈneɪʃn/",
    meaning: "điểm đến",
    example: "Paris is a popular tourist destination.",
    topic: "Du lịch",
  },
  {
    id: "flashcard-005",
    word: "environment",
    phonetic: "/ɪnˈvaɪrənmənt/",
    meaning: "môi trường",
    example: "We should protect the natural environment.",
    topic: "Cuộc sống",
  },
  {
    id: "flashcard-006",
    word: "improve",
    phonetic: "/ɪmˈpruːv/",
    meaning: "cải thiện",
    example: "Daily practice will improve your English.",
    topic: "Giáo dục",
  },
];

export const quizQuestions: QuizQuestion[] = [
  {
    id: "question-001",
    question: 'Câu nào có nghĩa là "Rất vui được gặp bạn"?',
    answers: [
      "How are you?",
      "Nice to meet you.",
      "Where are you from?",
      "See you tomorrow.",
    ],
    correctAnswer: 1,
    explanation:
      "Nice to meet you được sử dụng khi gặp một người lần đầu.",
  },
  {
    id: "question-002",
    question: "Chọn câu đúng với chủ ngữ She.",
    answers: [
      "She work in an office.",
      "She working in an office.",
      "She works in an office.",
      "She to work in an office.",
    ],
    correctAnswer: 2,
    explanation:
      "Trong thì hiện tại đơn, động từ với chủ ngữ She thường thêm s hoặc es.",
  },
  {
    id: "question-003",
    question: 'Từ "appointment" có nghĩa là gì?',
    answers: ["Báo cáo", "Cuộc họp", "Cuộc hẹn", "Hạn chót"],
    correctAnswer: 2,
    explanation: "Appointment có nghĩa là cuộc hẹn.",
  },
  {
    id: "question-004",
    question: "Câu nào dùng để hỏi người khác đến từ đâu?",
    answers: [
      "What do you do?",
      "Where are you from?",
      "What time is it?",
      "How old are you?",
    ],
    correctAnswer: 1,
    explanation:
      "Where are you from? được dùng để hỏi quê quán hoặc quốc gia của một người.",
  },
  {
    id: "question-005",
    question: 'Cụm từ "get back to you" có nghĩa là gì?',
    answers: [
      "Quay trở về nhà",
      "Gọi điện ngay",
      "Phản hồi lại sau",
      "Hủy cuộc họp",
    ],
    correctAnswer: 2,
    explanation:
      "I'll get back to you có nghĩa là tôi sẽ phản hồi lại cho bạn sau.",
  },
  {
    id: "question-advanced-001",
    question:
      "Which sentence best preserves a formal, cautious tone in a project update?",
    answers: [
      "The figures are wrong, so fix them now.",
      "The figures appear to require further verification before publication.",
      "You messed up the figures again.",
      "I don't know what happened to the figures.",
    ],
    correctAnswer: 1,
    explanation:
      "“Appear to require further verification” communicates uncertainty precisely and keeps a professional tone.",
    difficulty: "advanced",
    level: "B2",
    topic: "Công sở",
  },
  {
    id: "question-advanced-002",
    question:
      "Choose the best connector: “The pilot was expensive; _____, it produced valuable data.”",
    answers: ["in contrast", "nevertheless", "as a result", "for instance"],
    correctAnswer: 1,
    explanation:
      "Nevertheless introduces a contrast between the cost and the useful outcome.",
    difficulty: "advanced",
    level: "B2",
    topic: "Ngữ pháp",
  },
  {
    id: "question-advanced-003",
    question:
      "What can be inferred from: “Maya postponed the launch until the accessibility audit was complete”?",
    answers: [
      "The launch had already failed.",
      "Maya considered inclusive design important enough to delay the schedule.",
      "The audit was cancelled.",
      "The product was only for auditors.",
    ],
    correctAnswer: 1,
    explanation:
      "Postponing a launch until an audit is complete signals that accessibility was treated as a release requirement.",
    difficulty: "advanced",
    level: "C1",
    topic: "Đọc hiểu",
  },
  {
    id: "question-advanced-004",
    question:
      "Select the most natural collocation: “The new evidence _____ doubt on the original conclusion.”",
    answers: ["puts", "does", "makes", "takes"],
    correctAnswer: 0,
    explanation:
      "The established collocation is “put doubt on something.”",
    difficulty: "advanced",
    level: "C1",
    topic: "Từ vựng",
  },
  {
    id: "question-advanced-005",
    question:
      "Which response demonstrates active listening in a difficult meeting?",
    answers: [
      "That is not my problem.",
      "So you are concerned that the deadline leaves no time for testing—is that right?",
      "You should have said this earlier.",
      "Let's ignore the issue and move on.",
    ],
    correctAnswer: 1,
    explanation:
      "Paraphrasing the concern and checking understanding is a strong active-listening strategy.",
    difficulty: "advanced",
    level: "C1",
    topic: "Luyện nghe",
  },
];

export function getLessonById(lessonId: string) {
  return lessons.find((lesson) => lesson.id === lessonId);
}
