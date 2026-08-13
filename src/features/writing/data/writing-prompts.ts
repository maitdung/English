import type {
  CefrLevel,
  WritingTaskType,
} from "../../../lib/api/writing-api";

export type WritingPreset = {
  id: string;
  taskType: WritingTaskType;
  title: string;
  prompt: string;
  targetWords: number;
  levelHint: CefrLevel;
  tag: string;
};

export type WritingTaskConfig = {
  label: string;
  shortLabel: string;
  description: string;
  icon: string;
  framework: string[];
};

export const writingTaskConfig: Record<WritingTaskType, WritingTaskConfig> = {
  general: {
    label: "Viết tổng quát",
    shortLabel: "General",
    description: "Nhật ký, mô tả và kể chuyện tự nhiên.",
    icon: "✦",
    framework: ["Mở bằng ý chính", "Thêm chi tiết cụ thể", "Kết bằng cảm nhận"],
  },
  email: {
    label: "Email",
    shortLabel: "Email",
    description: "Thư công việc và giao tiếp đời sống.",
    icon: "@",
    framework: ["Lời chào phù hợp", "Mục đích rõ ràng", "Lời kết có hành động"],
  },
  essay: {
    label: "Bài luận",
    shortLabel: "Essay",
    description: "Lập luận học thuật có cấu trúc.",
    icon: "¶",
    framework: ["Luận đề rõ", "Mỗi đoạn một ý", "Dẫn chứng và kết luận"],
  },
  toeic: {
    label: "TOEIC Writing",
    shortLabel: "TOEIC",
    description: "Phản hồi tình huống theo chuẩn bài thi.",
    icon: "T",
    framework: ["Trả lời đủ yêu cầu", "Giọng văn chuyên nghiệp", "Thông tin chính xác"],
  },
  ielts: {
    label: "IELTS Writing",
    shortLabel: "IELTS",
    description: "Task 1 và Task 2 theo tiêu chí IELTS.",
    icon: "I",
    framework: ["Task response", "Coherence & cohesion", "Lexical & grammar range"],
  },
};

export const cefrLevelDescriptions: Record<CefrLevel, string> = {
  A1: "Câu đơn và từ vựng quen thuộc",
  A2: "Đoạn ngắn về đời sống hàng ngày",
  B1: "Ý rõ ràng, có liên kết cơ bản",
  B2: "Lập luận chi tiết và linh hoạt",
  C1: "Diễn đạt học thuật, sắc thái tốt",
  C2: "Chính xác, tự nhiên và tinh tế",
};

export const writingPresets: WritingPreset[] = [
  {
    id: "general-perfect-weekend",
    taskType: "general",
    title: "Một cuối tuần lý tưởng",
    prompt:
      "Describe your perfect weekend. Explain where you would go, who you would spend time with, and why these activities matter to you.",
    targetWords: 120,
    levelHint: "B1",
    tag: "Miêu tả",
  },
  {
    id: "general-habit-change",
    taskType: "general",
    title: "Thói quen đã thay đổi bạn",
    prompt:
      "Write about one habit that has improved your life. Describe how you started it, what changed, and what advice you would give someone else.",
    targetWords: 150,
    levelHint: "B1",
    tag: "Kể chuyện",
  },
  {
    id: "general-future-city",
    taskType: "general",
    title: "Thành phố tương lai",
    prompt:
      "Imagine your city in 2040. Describe the most important changes in transport, work, education, and daily life.",
    targetWords: 180,
    levelHint: "B2",
    tag: "Sáng tạo",
  },
  {
    id: "email-reschedule",
    taskType: "email",
    title: "Dời lịch họp",
    prompt:
      "Write a polite email to your manager asking to reschedule tomorrow's meeting. Explain why, suggest two alternative times, and offer to send an update in advance.",
    targetWords: 110,
    levelHint: "B1",
    tag: "Công việc",
  },
  {
    id: "email-customer-complaint",
    taskType: "email",
    title: "Phản hồi khiếu nại",
    prompt:
      "You work for an online store. Reply to a customer whose order arrived late and damaged. Apologize, explain the next steps, and offer a suitable solution.",
    targetWords: 140,
    levelHint: "B2",
    tag: "Dịch vụ",
  },
  {
    id: "email-course-inquiry",
    taskType: "email",
    title: "Hỏi thông tin khóa học",
    prompt:
      "Write an email to a language center asking about an evening English course. Ask about the schedule, class size, tuition, and placement test.",
    targetWords: 100,
    levelHint: "A2",
    tag: "Đời sống",
  },
  {
    id: "essay-remote-work",
    taskType: "essay",
    title: "Làm việc từ xa",
    prompt:
      "Some people believe remote work improves productivity, while others think it harms teamwork. Discuss both views and give your own opinion.",
    targetWords: 260,
    levelHint: "B2",
    tag: "Discussion",
  },
  {
    id: "essay-ai-education",
    taskType: "essay",
    title: "AI trong giáo dục",
    prompt:
      "Artificial intelligence is becoming common in education. To what extent do its benefits outweigh its disadvantages for students and teachers?",
    targetWords: 280,
    levelHint: "C1",
    tag: "Opinion",
  },
  {
    id: "essay-public-transport",
    taskType: "essay",
    title: "Giao thông công cộng",
    prompt:
      "Governments should make public transport free to reduce traffic and pollution. Do you agree or disagree? Support your position with reasons and examples.",
    targetWords: 250,
    levelHint: "B2",
    tag: "Argument",
  },
  {
    id: "toeic-photo-description",
    taskType: "toeic",
    title: "Mô tả khung cảnh văn phòng",
    prompt:
      "Write one grammatically complete sentence about this situation: three colleagues are reviewing documents together around a conference table. Use the words 'documents' and 'discussing'.",
    targetWords: 35,
    levelHint: "A2",
    tag: "Part 1",
  },
  {
    id: "toeic-information-request",
    taskType: "toeic",
    title: "Yêu cầu thông tin",
    prompt:
      "Write an email to a conference organizer. Ask for the updated agenda and information about parking, and explain why you need the details before Friday.",
    targetWords: 120,
    levelHint: "B1",
    tag: "Part 2",
  },
  {
    id: "toeic-opinion-training",
    taskType: "toeic",
    title: "Đào tạo nhân viên",
    prompt:
      "Do you agree that companies should give employees paid time for professional training? State your opinion and support it with specific reasons and examples.",
    targetWords: 220,
    levelHint: "B2",
    tag: "Part 3",
  },
  {
    id: "ielts-task1-city-transport",
    taskType: "ielts",
    title: "Task 1 · Biểu đồ giao thông",
    prompt:
      "The chart compares the percentage of commuters using cars, buses, bicycles, and trains in a city in 2000 and 2025. Summarise the main features and make relevant comparisons. (Cars: 55%→38%, buses: 20%→24%, bicycles: 10%→18%, trains: 15%→20%.)",
    targetWords: 170,
    levelHint: "B2",
    tag: "Academic Task 1",
  },
  {
    id: "ielts-task2-success",
    taskType: "ielts",
    title: "Task 2 · Định nghĩa thành công",
    prompt:
      "Some people measure success mainly by income and possessions. What other factors can define a successful life? Which factor is the most important in your view?",
    targetWords: 270,
    levelHint: "B2",
    tag: "Academic Task 2",
  },
  {
    id: "ielts-general-letter-neighbour",
    taskType: "ielts",
    title: "General · Thư cho hàng xóm",
    prompt:
      "Your neighbour often plays loud music late at night. Write a letter explaining the problem, describing how it affects you, and suggesting a practical solution.",
    targetWords: 170,
    levelHint: "B1",
    tag: "General Task 1",
  },
];
