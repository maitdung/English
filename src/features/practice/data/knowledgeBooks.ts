import { practiceSets } from "./practiceCatalog";
import type { PracticeLevel, PracticeSkill } from "../types/practice";

/** A chapter is a small, finishable reading in a larger learning book. */
export type KnowledgeChapter = {
  id: string;
  title: string;
  summary: string;
  level: PracticeLevel;
  setIds: string[];
  estimatedMinutes: number;
  outcomes: string[];
  checkpoint?: string;
};

export type KnowledgeBook = {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  skill: PracticeSkill;
  icon: string;
  accent: "cyan" | "blue" | "violet" | "emerald" | "amber" | "rose" | "orange";
  levelRange: string;
  chapters: KnowledgeChapter[];
  outcomes: string[];
};

/**
 * Curriculum map for the offline library.
 *
 * The exercise catalog stores individual practice sets; this registry gives
 * them a book/chapter narrative so learners always have a next chapter to
 * return to. A chapter can contain one or more sets and can later be backed by
 * API content without changing the UI contract.
 */
export const knowledgeBooks: KnowledgeBook[] = [
  {
    id: "book-vocabulary",
    title: "Từ vựng dùng được ngay",
    subtitle: "Từ đơn → collocation → phản xạ",
    description:
      "Một lộ trình từ các từ thiết yếu đến cụm từ công sở, giúp người học nhớ bằng ngữ cảnh thay vì học danh sách rời rạc.",
    skill: "vocabulary",
    icon: "📖",
    accent: "cyan",
    levelRange: "A1–B1",
    outcomes: [
      "Gọi tên và dùng từ trong tình huống hằng ngày",
      "Nhận ra collocation trong email và cuộc họp",
      "Tự kiểm tra bằng truy hồi chủ động",
    ],
    chapters: [
      {
        id: "vocabulary-chapter-01",
        title: "Chương 1 · Everyday essentials",
        summary: "Những từ nền tảng để hỏi, đáp và mô tả sinh hoạt hằng ngày.",
        level: "A1",
        setIds: ["vocabulary-everyday-essentials"],
        estimatedMinutes: 25,
        outcomes: ["Gọi món và nhờ giúp đỡ lịch sự", "Nhớ 20 từ lõi theo ngữ cảnh"],
        checkpoint: "Nói một lời nhờ và dùng đúng borrow / have breakfast.",
      },
      {
        id: "vocabulary-chapter-02",
        title: "Chương 2 · Workplace collocations",
        summary: "Cụm động từ và danh từ xuất hiện thường xuyên trong môi trường công sở.",
        level: "B1",
        setIds: ["vocabulary-workplace-collocations"],
        estimatedMinutes: 28,
        outcomes: ["Viết email rõ ý hơn", "Nhận diện collocation khi nghe họp"],
        checkpoint: "Viết ba câu với extend a deadline, raise a concern và give an update.",
      },
      {
        id: "vocabulary-chapter-03",
        title: "Chương 3 · Ôn và chuyển hóa",
        summary: "Quay lại hai bộ từ bằng bài xếp câu và truy hồi nhanh.",
        level: "B1",
        setIds: ["vocabulary-everyday-essentials", "vocabulary-workplace-collocations"],
        estimatedMinutes: 20,
        outcomes: ["Nhớ lại không cần nhìn đáp án", "Chuyển từ nhận biết sang tự dùng"],
        checkpoint: "Đạt ít nhất 80% ở cả hai bộ trước khi sang sách kế tiếp.",
      },
    ],
  },
  {
    id: "book-listening",
    title: "Nghe để bắt ý",
    subtitle: "Chi tiết → quyết định → hội thoại",
    description:
      "Luyện tai theo tầng: nhận diện chi tiết nhỏ, hiểu ý định và chọn hành động tiếp theo trong hội thoại công việc.",
    skill: "listening",
    icon: "🎧",
    accent: "blue",
    levelRange: "A2–B2",
    outcomes: [
      "Bắt từ khóa mà không dịch từng chữ",
      "Theo dõi người nói và mục đích hội thoại",
      "Ghi nhớ thông tin nghe bằng tóm tắt ngắn",
    ],
    chapters: [
      {
        id: "listening-chapter-01",
        title: "Chương 1 · Daily details",
        summary: "Nghe số, thời gian, địa điểm và yêu cầu trong tình huống quen thuộc.",
        level: "A2",
        setIds: ["listening-daily-details"],
        estimatedMinutes: 26,
        outcomes: ["Bắt thông tin cụ thể", "Phân biệt câu hỏi When / Where / Who"],
        checkpoint: "Tóm tắt được một thông báo bằng hai câu tiếng Anh.",
      },
      {
        id: "listening-chapter-02",
        title: "Chương 2 · Workplace decisions",
        summary: "Theo dõi vấn đề, nguyên nhân và quyết định trong các cuộc trao đổi công sở.",
        level: "B1",
        setIds: ["listening-workplace-decisions"],
        estimatedMinutes: 30,
        outcomes: ["Nhận diện ý định người nói", "Dự đoán hành động tiếp theo"],
        checkpoint: "Ghi lại problem → reason → next action cho mỗi hội thoại.",
      },
      {
        id: "listening-chapter-03",
        title: "Chương 3 · Nghe liền mạch",
        summary: "Trộn chi tiết đời thường và quyết định công việc thành một phiên nghe dài hơn.",
        level: "B2",
        setIds: ["listening-daily-details", "listening-workplace-decisions"],
        estimatedMinutes: 24,
        outcomes: ["Giữ mạch ý qua nhiều lượt nói", "Không phụ thuộc vào một từ khóa"],
        checkpoint: "Đạt 80% hai lần liên tiếp.",
      },
    ],
  },
  {
    id: "book-speaking",
    title: "Nói tự tin từng câu",
    subtitle: "Shadowing → nhịp điệu → hội thoại",
    description:
      "Một quyển sách nói theo mẫu, tập trung vào cụm từ, trọng âm và khả năng trả lời tự nhiên.",
    skill: "speaking",
    icon: "🗣️",
    accent: "violet",
    levelRange: "A2–B2",
    outcomes: [
      "Nói trọn cụm thay vì ghép từng từ",
      "Giữ trọng âm ở từ mang thông tin",
      "Phản hồi lịch sự trong bối cảnh thật",
    ],
    chapters: [
      {
        id: "speaking-chapter-01",
        title: "Chương 1 · Social confidence",
        summary: "Chào hỏi, hỏi lại và duy trì cuộc trò chuyện ngắn.",
        level: "A2",
        setIds: ["speaking-social-confidence"],
        estimatedMinutes: 25,
        outcomes: ["Dùng mẫu mở đầu hội thoại", "Hỏi lại khi chưa nghe rõ"],
        checkpoint: "Shadowing đủ 3 lượt, không bỏ cụm nối.",
      },
      {
        id: "speaking-chapter-02",
        title: "Chương 2 · Professional shadowing",
        summary: "Nói theo email, cuộc họp và cập nhật dự án với nhịp tự nhiên.",
        level: "B1",
        setIds: ["speaking-professional-shadowing"],
        estimatedMinutes: 30,
        outcomes: ["Tóm tắt tiến độ", "Đề xuất và phản hồi lịch sự"],
        checkpoint: "Ghi âm một bản 45 giây và tự đánh dấu ba trọng âm.",
      },
      {
        id: "speaking-chapter-03",
        title: "Chương 3 · Nói liền mạch",
        summary: "Kết hợp giao tiếp xã hội và công việc trong một vai diễn ngắn.",
        level: "B2",
        setIds: ["speaking-social-confidence", "speaking-professional-shadowing"],
        estimatedMinutes: 22,
        outcomes: ["Chuyển giọng theo bối cảnh", "Nói không cần đọc từng chữ"],
        checkpoint: "Hoàn thành shadowing và tự chấm đủ 4 focus points.",
      },
    ],
  },
  {
    id: "book-reading",
    title: "Đọc nhanh, hiểu sâu",
    subtitle: "Thông báo → suy luận → tổng hợp",
    description:
      "Đi từ thông tin rõ ràng đến ý ẩn và quan hệ giữa nhiều đoạn văn, đúng cách đọc cần cho học tập và công việc.",
    skill: "reading",
    icon: "🔎",
    accent: "emerald",
    levelRange: "A2–B2",
    outcomes: [
      "Quét nhanh ngày, số và địa điểm",
      "Suy luận ý định từ ngữ cảnh",
      "Tóm tắt một văn bản bằng ý chính",
    ],
    chapters: [
      {
        id: "reading-chapter-01",
        title: "Chương 1 · Everyday notices",
        summary: "Đọc biển báo, email ngắn và hướng dẫn dịch vụ.",
        level: "A2",
        setIds: ["reading-everyday-notices"],
        estimatedMinutes: 25,
        outcomes: ["Tìm thông tin trực tiếp", "Nhận diện từ chỉ thời hạn"],
        checkpoint: "Trả lời 4W1H mà không dịch toàn bài.",
      },
      {
        id: "reading-chapter-02",
        title: "Chương 2 · Ideas and inference",
        summary: "Đọc đoạn văn công việc và suy luận điều không nói thẳng.",
        level: "B1",
        setIds: ["reading-ideas-and-inference"],
        estimatedMinutes: 30,
        outcomes: ["Phân biệt fact và inference", "Theo dõi đại từ tham chiếu"],
        checkpoint: "Nêu bằng chứng cho mỗi đáp án suy luận.",
      },
      {
        id: "reading-chapter-03",
        title: "Chương 3 · Đọc đa văn bản",
        summary: "Kết nối thông báo và đoạn giải thích để chọn quyết định đúng.",
        level: "B2",
        setIds: ["reading-everyday-notices", "reading-ideas-and-inference"],
        estimatedMinutes: 24,
        outcomes: ["Đối chiếu hai nguồn", "Tóm tắt lập luận ngắn"],
        checkpoint: "Hoàn thành hai văn bản trong thời gian giới hạn.",
      },
    ],
  },
  {
    id: "book-writing",
    title: "Viết để được hiểu",
    subtitle: "Tin nhắn → email → lập luận",
    description:
      "Từng bước xây câu, đoạn và bài viết có mục đích, kèm checklist để tự sửa ngay sau khi nộp.",
    skill: "writing",
    icon: "✍️",
    accent: "rose",
    levelRange: "A2–C1",
    outcomes: [
      "Viết thông điệp ngắn, rõ hành động",
      "Sắp xếp email theo mục đích và giọng điệu",
      "Đưa lý do và ví dụ vào đoạn lập luận",
    ],
    chapters: [
      {
        id: "writing-chapter-01",
        title: "Chương 1 · Practical messages",
        summary: "Viết tin nhắn ngắn có bối cảnh, hành động và thời hạn.",
        level: "A2",
        setIds: ["writing-practical-messages"],
        estimatedMinutes: 25,
        outcomes: ["Viết yêu cầu lịch sự", "Nêu đủ ai / việc gì / khi nào"],
        checkpoint: "Đạt đủ checklist trong một tin nhắn dưới 60 từ.",
      },
      {
        id: "writing-chapter-02",
        title: "Chương 2 · Argument and synthesis",
        summary: "Viết đoạn có quan điểm, lý do và kết luận ngắn gọn.",
        level: "B2",
        setIds: ["writing-argument-and-synthesis"],
        estimatedMinutes: 34,
        outcomes: ["Nối ý bằng từ chuyển tiếp", "Tổng hợp hai thông tin"],
        checkpoint: "Viết đủ số từ và có ít nhất một ví dụ cụ thể.",
      },
      {
        id: "writing-chapter-03",
        title: "Chương 3 · Biên tập trước khi gửi",
        summary: "Viết lại cùng một ý cho tin nhắn nhanh và email chuyên nghiệp.",
        level: "C1",
        setIds: ["writing-practical-messages", "writing-argument-and-synthesis"],
        estimatedMinutes: 26,
        outcomes: ["Điều chỉnh giọng điệu", "Tự sửa theo checklist"],
        checkpoint: "Nêu được ít nhất hai thay đổi giữa bản nháp và bản cuối.",
      },
    ],
  },
  {
    id: "book-grammar",
    title: "Ngữ pháp thành phản xạ",
    subtitle: "Nền tảng → thì → mệnh đề",
    description:
      "Học ngữ pháp qua câu dùng được, sau đó kéo vào đoạn văn và hội thoại để tránh học quy tắc rời rạc.",
    skill: "grammar",
    icon: "⚙️",
    accent: "amber",
    levelRange: "A1–B2",
    outcomes: [
      "Chọn cấu trúc đúng trong câu thật",
      "Kể việc đã xảy ra và kế hoạch sắp tới",
      "Nối ý bằng điều kiện và mệnh đề quan hệ",
    ],
    chapters: [
      {
        id: "grammar-chapter-01",
        title: "Chương 1 · Present basics",
        summary: "Thì hiện tại, be/do và trật tự câu căn bản.",
        level: "A1",
        setIds: ["grammar-present-basics"],
        estimatedMinutes: 25,
        outcomes: ["Mô tả thói quen", "Đặt câu hỏi đúng trật tự"],
        checkpoint: "Xếp đúng 4 câu và giải thích vì sao dùng do/does.",
      },
      {
        id: "grammar-chapter-02",
        title: "Chương 2 · Past and plans",
        summary: "Kể lại sự việc và nói về kế hoạch bằng các mốc thời gian rõ ràng.",
        level: "A2",
        setIds: ["grammar-past-and-plans"],
        estimatedMinutes: 28,
        outcomes: ["Phân biệt past simple và be going to", "Dùng time markers"],
        checkpoint: "Viết một timeline ngắn với ba mốc thời gian.",
      },
      {
        id: "grammar-chapter-03",
        title: "Chương 3 · Conditionals and clauses",
        summary: "Diễn đạt giả định và bổ sung thông tin bằng mệnh đề quan hệ.",
        level: "B2",
        setIds: ["grammar-conditionals-and-clauses"],
        estimatedMinutes: 32,
        outcomes: ["Nói về kết quả giả định", "Gộp hai câu thành một câu rõ ý"],
        checkpoint: "Tạo được một câu điều kiện và một câu quan hệ.",
      },
    ],
  },
  {
    id: "book-toeic",
    title: "TOEIC 7 Parts · Từ nền đến phòng thi",
    subtitle: "Một quyển sách, bảy chương, luyện từng kỹ năng",
    description:
      "Lộ trình TOEIC offline bám đủ Part 1–7: nghe ảnh, phản xạ, hội thoại, bài nói, ngữ pháp, điền đoạn và đọc hiểu.",
    skill: "toeic",
    icon: "🏆",
    accent: "orange",
    levelRange: "A2–B2",
    outcomes: [
      "Biết chiến thuật riêng cho từng Part",
      "Luyện hơn 80 câu offline có transcript và giải thích",
      "Kết thúc bằng mini mock tổng hợp có phản hồi tức thì",
    ],
    chapters: [
      {
        id: "toeic-chapter-01",
        title: "Chương 1 · Part 1 — Photo scenes",
        summary: "Nhận diện người, hành động, vị trí và trạng thái trong ảnh.",
        level: "A2",
        setIds: ["toeic-part-1-photo-scenes"],
        estimatedMinutes: 20,
        outcomes: ["Bắt present continuous", "Loại mô tả sai chủ thể"],
        checkpoint: "Đạt 75% và ghi lại ba từ chỉ vị trí.",
      },
      {
        id: "toeic-chapter-02",
        title: "Chương 2 · Part 2 — Question response",
        summary: "Phản xạ với Wh-, Yes/No, đề nghị và phát biểu gián tiếp.",
        level: "B1",
        setIds: ["toeic-part-2-question-response", "toeic-part-2-reflex"],
        estimatedMinutes: 30,
        outcomes: ["Nghe từ để hỏi", "Không mắc bẫy lặp từ khóa"],
        checkpoint: "Đạt 80% hai lượt liên tiếp.",
      },
      {
        id: "toeic-chapter-03",
        title: "Chương 3 · Part 3 — Conversations",
        summary: "Theo dõi vấn đề, lý do, chi tiết và hành động tiếp theo trong hội thoại.",
        level: "B1",
        setIds: ["toeic-part-3-conversations"],
        estimatedMinutes: 28,
        outcomes: ["Ghi nhớ người nói", "Dự đoán next action"],
        checkpoint: "Tóm tắt mỗi hội thoại theo problem → action.",
      },
      {
        id: "toeic-chapter-04",
        title: "Chương 4 · Part 4 — Talks",
        summary: "Nghe thông báo, tin nhắn thoại và hướng dẫn một người.",
        level: "B1",
        setIds: ["toeic-part-4-talks"],
        estimatedMinutes: 28,
        outcomes: ["Bắt purpose và location", "Theo dõi thay đổi lịch"],
        checkpoint: "Đúng ít nhất 6/8 câu trước khi tăng tốc.",
      },
      {
        id: "toeic-chapter-05",
        title: "Chương 5 · Part 5 — Grammar & vocabulary",
        summary: "Từ loại, thì, giới từ, liên từ và collocation công sở.",
        level: "B1",
        setIds: ["toeic-part-5-grammar-vocabulary", "toeic-part-5-sprint"],
        estimatedMinutes: 30,
        outcomes: ["Xác định từ loại trong 3 giây", "Dùng dấu hiệu ngữ pháp"],
        checkpoint: "Hoàn thành 14 câu trong thời gian mục tiêu.",
      },
      {
        id: "toeic-chapter-06",
        title: "Chương 6 · Part 6 — Text completion",
        summary: "Đọc toàn đoạn để chọn từ đúng nghĩa, từ loại và mạch liên kết.",
        level: "B2",
        setIds: ["toeic-part-6-text-completion"],
        estimatedMinutes: 28,
        outcomes: ["Không chọn theo một câu đơn lẻ", "Theo dõi từ nối"],
        checkpoint: "Giải thích lý do cho mỗi đáp án, không chỉ nhớ đáp án.",
      },
      {
        id: "toeic-chapter-07",
        title: "Chương 7 · Part 7 — Reading inbox",
        summary: "Đọc email, tin nhắn, quảng cáo và thông báo để tìm chi tiết và suy luận.",
        level: "B2",
        setIds: ["toeic-part-7-reading-inbox"],
        estimatedMinutes: 34,
        outcomes: ["Skim tiêu đề và câu hỏi", "Đối chiếu điều kiện và thời hạn"],
        checkpoint: "Đạt 8/10 và gạch được bằng chứng trong văn bản.",
      },
      {
        id: "toeic-chapter-08",
        title: "Chương 8 · Mini mock — Mixed Parts",
        summary: "Mô phỏng ngắn từ Part 1 đến Part 7 trước khi vào đề dài hơn.",
        level: "B2",
        setIds: ["toeic-full-mock-01", "toeic-mini-mix"],
        estimatedMinutes: 38,
        outcomes: ["Chuyển kỹ năng giữa các Part", "Tự xem lại lỗi theo nhóm"],
        checkpoint: "Lưu điểm, chọn hai Part cần quay lại và làm lại sau 48 giờ.",
      },
    ],
  },
];

export const knowledgeBookById = Object.fromEntries(
  knowledgeBooks.map((book) => [book.id, book]),
) as Record<string, KnowledgeBook>;

export const knowledgeChapterById = Object.fromEntries(
  knowledgeBooks.flatMap((book) =>
    book.chapters.map((chapter) => [chapter.id, chapter]),
  ),
) as Record<string, KnowledgeChapter>;

/** Resolve chapter IDs to their actual offline exercises for a chapter view. */
export function getPracticeSetsForChapter(chapterId: string) {
  const chapter = knowledgeChapterById[chapterId];
  if (!chapter) return [];
  return chapter.setIds
    .map((setId) => practiceSets.find((set) => set.id === setId))
    .filter((set): set is (typeof practiceSets)[number] => Boolean(set));
}

