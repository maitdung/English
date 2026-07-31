import type { Flashcard, Lesson, QuizQuestion } from "../types/learning";

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
    explanation: "Nice to meet you được sử dụng khi gặp một người lần đầu.",
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
    explanation: "The established collocation is “put doubt on something.”",
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
  {
    id: "question-advanced-006",
    question:
      "Choose the best meaning of the sentence: “The proposal was met with qualified support.”",
    answers: [
      "Everyone rejected it immediately.",
      "It was supported, but with reservations.",
      "It received praise for its wording only.",
      "The proposal was legally invalid.",
    ],
    correctAnswer: 1,
    explanation:
      "Qualified support means support that is not unconditional; there are reservations or limits.",
    difficulty: "advanced",
    level: "C1",
    topic: "Đọc hiểu",
  },
  {
    id: "question-advanced-007",
    question: "Which sentence is the most precise for a formal presentation?",
    answers: [
      "The data are kind of interesting.",
      "The data suggest a modest but consistent upward trend.",
      "The data are totally amazing.",
      "The data maybe show something good.",
    ],
    correctAnswer: 1,
    explanation:
      "The second option is measured, formal and specific, which suits a presentation.",
    difficulty: "advanced",
    level: "C1",
    topic: "Công sở",
  },
  {
    id: "question-advanced-008",
    question:
      "What does the phrase “in light of the evidence” most naturally signal?",
    answers: [
      "A contrast with no reason.",
      "A conclusion based on the evidence.",
      "A request to stop reading.",
      "A personal apology.",
    ],
    correctAnswer: 1,
    explanation:
      "The phrase introduces a conclusion or action that follows from the evidence.",
    difficulty: "advanced",
    level: "C2",
    topic: "Từ vựng",
  },
  {
    id: "question-advanced-009",
    question: "Which sentence best reflects a C2-style qualification?",
    answers: [
      "This is definitely the only answer.",
      "This may be true in some contexts, though the evidence remains limited.",
      "This is always false.",
      "Nobody can say anything useful.",
    ],
    correctAnswer: 1,
    explanation:
      "C2 writing often balances certainty with careful qualification.",
    difficulty: "advanced",
    level: "C2",
    topic: "Văn phong",
  },
  {
    id: "question-advanced-010",
    question: "Which reply shows the most mature response to disagreement?",
    answers: [
      "You are just wrong.",
      "I see your point, although I read the data differently.",
      "That makes no sense at all.",
      "Let's not talk about it.",
    ],
    correctAnswer: 1,
    explanation:
      "Acknowledging the other view while calmly presenting a different reading is more advanced discourse.",
    difficulty: "advanced",
    level: "C2",
    topic: "Giao tiếp",
  },
  {
    id: "question-foundation-006",
    question: 'Chọn câu đúng để nói "Tôi thường ăn sáng lúc 7 giờ."',
    answers: [
      "I usually have breakfast at seven.",
      "I have usually breakfast on seven.",
      "I am usually breakfast at seven.",
      "I usually has breakfast at seven.",
    ],
    correctAnswer: 0,
    explanation:
      "Usually đứng trước động từ chính; với I dùng have, không dùng has.",
    difficulty: "foundation",
    level: "A1",
    topic: "Ngữ pháp",
  },
  {
    id: "question-foundation-007",
    question:
      'Từ nào phù hợp với câu: "Can I have the _____, please?" tại nhà hàng.',
    answers: ["menu", "meeting", "airport", "deadline"],
    correctAnswer: 0,
    explanation: "Menu là thực đơn, phù hợp trong tình huống nhà hàng.",
    difficulty: "foundation",
    level: "A1",
    topic: "Ẩm thực",
  },
  {
    id: "question-foundation-008",
    question: "Câu nào hỏi giá tiền tự nhiên nhất?",
    answers: [
      "How much is it?",
      "How many is it?",
      "How old is it?",
      "How often is it?",
    ],
    correctAnswer: 0,
    explanation: "How much is it? dùng để hỏi giá.",
    difficulty: "foundation",
    level: "A1",
    topic: "Mua sắm",
  },
  {
    id: "question-a2-009",
    question: "Choose the best word: “I missed the bus, _____ I arrived late.”",
    answers: ["because", "so", "although", "before"],
    correctAnswer: 1,
    explanation: "So chỉ kết quả: lỡ xe buýt nên đến muộn.",
    difficulty: "foundation",
    level: "A2",
    topic: "Ngữ pháp",
  },
  {
    id: "question-a2-010",
    question: 'Cụm "make an appointment" nghĩa là gì?',
    answers: ["Đặt lịch hẹn", "Hủy hóa đơn", "Đi mua sắm", "Nộp báo cáo"],
    correctAnswer: 0,
    explanation: "Make an appointment là đặt lịch hẹn.",
    difficulty: "foundation",
    level: "A2",
    topic: "Sức khỏe",
  },
  {
    id: "question-b1-011",
    question: "Which sentence is best for politely asking for help at work?",
    answers: [
      "Help me now.",
      "Could you help me check this report when you have a moment?",
      "You must check this.",
      "Why did you not help?",
    ],
    correctAnswer: 1,
    explanation:
      "Could you... when you have a moment? là cách hỏi lịch sự trong công việc.",
    difficulty: "intermediate",
    level: "B1",
    topic: "Công việc",
  },
  {
    id: "question-b1-012",
    question:
      "Read: “The train was delayed, but passengers received regular updates.” What is implied?",
    answers: [
      "There was no communication.",
      "Passengers were informed during the delay.",
      "The train left early.",
      "All passengers cancelled their tickets.",
    ],
    correctAnswer: 1,
    explanation: "Regular updates nghĩa là hành khách được cập nhật thông tin.",
    difficulty: "intermediate",
    level: "B1",
    topic: "Đọc hiểu",
  },
  {
    id: "question-b1-013",
    question: "Choose the correct sentence in present perfect.",
    answers: [
      "I have finished the assignment.",
      "I has finished the assignment.",
      "I finished have the assignment.",
      "I have finish the assignment.",
    ],
    correctAnswer: 0,
    explanation: "Cấu trúc đúng là have/has + past participle.",
    difficulty: "intermediate",
    level: "B1",
    topic: "Ngữ pháp",
  },
  {
    id: "question-b2-014",
    question:
      "Which word best completes: “The company aims to _____ its services into rural areas.”",
    answers: ["expand", "apologise", "borrow", "whisper"],
    correctAnswer: 0,
    explanation: "Expand services nghĩa là mở rộng dịch vụ.",
    difficulty: "intermediate",
    level: "B2",
    topic: "Công việc",
  },
  {
    id: "question-b2-015",
    question: "Which sentence uses a natural academic tone?",
    answers: [
      "This thing is super good.",
      "The results indicate a significant improvement.",
      "It is nice and cool.",
      "Everybody knows this is awesome.",
    ],
    correctAnswer: 1,
    explanation:
      "Indicate a significant improvement là cách diễn đạt học thuật và chính xác hơn.",
    difficulty: "intermediate",
    level: "B2",
    topic: "Văn phong",
  },
  {
    id: "question-b2-016",
    question: "What does “despite the setback” signal?",
    answers: [
      "A contrast with a difficulty",
      "A reason for cancelling",
      "A repeated habit",
      "A direct quotation",
    ],
    correctAnswer: 0,
    explanation: "Despite giới thiệu sự tương phản dù có khó khăn/trở ngại.",
    difficulty: "intermediate",
    level: "B2",
    topic: "Đọc hiểu",
  },
  {
    id: "question-c1-017",
    question:
      "Choose the best paraphrase: “The policy may have unintended consequences.”",
    answers: [
      "The policy is perfect.",
      "The policy might cause effects that were not planned.",
      "The policy has already ended.",
      "The policy is impossible to understand.",
    ],
    correctAnswer: 1,
    explanation: "Unintended consequences là hậu quả không được dự tính trước.",
    difficulty: "advanced",
    level: "C1",
    topic: "Đọc hiểu",
  },
  {
    id: "question-c1-018",
    question:
      "Select the strongest collocation: “reach a _____ on the proposal.”",
    answers: ["consensus", "weather", "furniture", "silence"],
    correctAnswer: 0,
    explanation: "Reach a consensus là đạt được sự đồng thuận.",
    difficulty: "advanced",
    level: "C1",
    topic: "Từ vựng",
  },
  {
    id: "question-c1-019",
    question: "Which sentence sounds most diplomatic?",
    answers: [
      "Your plan is bad.",
      "I have some concerns about the timeline and would like to discuss alternatives.",
      "This will never work.",
      "You clearly did not think.",
    ],
    correctAnswer: 1,
    explanation:
      "Câu này nêu quan ngại cụ thể và mời thảo luận phương án khác.",
    difficulty: "advanced",
    level: "C1",
    topic: "Giao tiếp",
  },
  {
    id: "question-c2-020",
    question: "What does “a tenuous assumption” mean?",
    answers: [
      "A weak or poorly supported assumption",
      "A legally required assumption",
      "A very obvious fact",
      "A repeated instruction",
    ],
    correctAnswer: 0,
    explanation:
      "Tenuous nghĩa là mong manh, yếu, không được hỗ trợ chắc chắn.",
    difficulty: "advanced",
    level: "C2",
    topic: "Từ vựng",
  },
  {
    id: "question-c2-021",
    question: "Which sentence best shows nuanced evaluation?",
    answers: [
      "The argument is good.",
      "The argument is persuasive in scope, but less convincing in its treatment of counterexamples.",
      "The argument is bad and boring.",
      "The argument says things.",
    ],
    correctAnswer: 1,
    explanation:
      "Câu này đánh giá có sắc thái: ghi nhận điểm mạnh và chỉ ra giới hạn cụ thể.",
    difficulty: "advanced",
    level: "C2",
    topic: "Văn phong",
  },
  {
    id: "question-c2-022",
    question:
      "In critical reading, what does “correlation does not imply causation” warn against?",
    answers: [
      "Assuming one thing caused another only because they appear together",
      "Reading the conclusion first",
      "Using examples in an essay",
      "Comparing two definitions",
    ],
    correctAnswer: 0,
    explanation:
      "Hai hiện tượng đi cùng nhau chưa đủ chứng minh quan hệ nguyên nhân-kết quả.",
    difficulty: "advanced",
    level: "C2",
    topic: "Đọc hiểu",
  },
  {
    id: "question-c2-023",
    question:
      "Choose the best concise rewrite: “Due to the fact that demand increased, prices rose.”",
    answers: [
      "Because demand increased, prices rose.",
      "Due to demand because prices rose increased.",
      "Prices rose demand because.",
      "The demand was very demand.",
    ],
    correctAnswer: 0,
    explanation:
      "Because demand increased ngắn gọn và rõ hơn due to the fact that.",
    difficulty: "advanced",
    level: "C2",
    topic: "Viết",
  },
  {
    id: "question-mixed-024",
    question:
      "Listening skill: If you miss one detail during an audio exercise, what should you do first?",
    answers: [
      "Stop learning immediately.",
      "Replay the audio and listen for keywords before reading the transcript.",
      "Guess every answer randomly.",
      "Skip all listening tasks.",
    ],
    correctAnswer: 1,
    explanation:
      "Nghe lại để bắt keyword trước khi mở transcript giúp luyện tai tốt hơn.",
    difficulty: "intermediate",
    level: "B1",
    topic: "Luyện nghe",
  },
  {
    id: "question-mixed-025",
    question:
      "Writing skill: Which feedback is most useful for improving a paragraph?",
    answers: [
      "Bad.",
      "Make it better.",
      "Your topic sentence is clear, but the second example needs more evidence.",
      "I do not like it.",
    ],
    correctAnswer: 2,
    explanation:
      "Feedback tốt cần cụ thể: chỉ ra điểm mạnh và phần cần cải thiện.",
    difficulty: "intermediate",
    level: "B2",
    topic: "Viết",
  },
];

export function getLessonById(lessonId: string) {
  return lessons.find((lesson) => lesson.id === lessonId);
}
