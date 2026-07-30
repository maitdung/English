export type CourseLevel = "Cơ bản" | "Trung cấp" | "Nâng cao";

export type CourseLesson = {
  id: number;
  title: string;
  duration: number;
  type: "Video" | "Từ vựng" | "Ngữ pháp" | "Bài tập" | "Kiểm tra";
  completed: boolean;
  locked: boolean;
};

export type CourseModule = {
  id: number;
  title: string;
  description: string;
  lessons: CourseLesson[];
};

export type Course = {
  id: string;
  title: string;
  shortDescription: string;
  description: string;
  category: string;
  level: CourseLevel;
  icon: string;
  duration: number;
  totalLessons: number;
  students: number;
  rating: number;
  progress: number;
  featured: boolean;
  skills: string[];
  modules: CourseModule[];
};

export const courses: Course[] = [
  {
    id: "english-foundation",
    title: "Nền tảng tiếng Anh toàn diện",
    shortDescription:
      "Xây dựng nền tảng phát âm, từ vựng và ngữ pháp dành cho người mới.",
    description:
      "Khóa học giúp bạn xây dựng nền tảng tiếng Anh chắc chắn từ đầu. Bạn sẽ được học cách phát âm, cấu trúc câu, các thì cơ bản và vốn từ vựng thiết yếu để sử dụng trong giao tiếp hằng ngày.",
    category: "Nền tảng",
    level: "Cơ bản",
    icon: "🌱",
    duration: 18,
    totalLessons: 24,
    students: 1248,
    rating: 4.9,
    progress: 100,
    featured: true,
    skills: ["Phát âm", "Từ vựng cơ bản", "Ngữ pháp nền tảng", "Giao tiếp"],
    modules: [
      {
        id: 1,
        title: "Làm quen với tiếng Anh",
        description: "Bắt đầu với bảng chữ cái và các âm cơ bản.",
        lessons: [
          {
            id: 1,
            title: "Bảng chữ cái tiếng Anh",
            duration: 12,
            type: "Video",
            completed: true,
            locked: false,
          },
          {
            id: 2,
            title: "Nguyên âm và phụ âm",
            duration: 18,
            type: "Video",
            completed: true,
            locked: false,
          },
          {
            id: 3,
            title: "Bài tập nhận biết âm",
            duration: 10,
            type: "Bài tập",
            completed: true,
            locked: false,
          },
        ],
      },
      {
        id: 2,
        title: "Cấu trúc câu cơ bản",
        description: "Hiểu cách xây dựng câu tiếng Anh hoàn chỉnh.",
        lessons: [
          {
            id: 4,
            title: "Chủ ngữ và động từ",
            duration: 16,
            type: "Ngữ pháp",
            completed: true,
            locked: false,
          },
          {
            id: 5,
            title: "Câu khẳng định và phủ định",
            duration: 20,
            type: "Ngữ pháp",
            completed: true,
            locked: false,
          },
          {
            id: 6,
            title: "Kiểm tra cuối chương",
            duration: 15,
            type: "Kiểm tra",
            completed: true,
            locked: false,
          },
        ],
      },
    ],
  },
  {
    id: "daily-communication",
    title: "Giao tiếp tiếng Anh hằng ngày",
    shortDescription:
      "Luyện phản xạ với các tình huống giao tiếp phổ biến trong cuộc sống.",
    description:
      "Khóa học tập trung vào khả năng nghe và nói trong các tình huống thực tế như chào hỏi, mua sắm, hỏi đường, gọi món và trò chuyện tại nơi làm việc.",
    category: "Giao tiếp",
    level: "Cơ bản",
    icon: "💬",
    duration: 22,
    totalLessons: 30,
    students: 986,
    rating: 4.8,
    progress: 64,
    featured: true,
    skills: ["Nghe hiểu", "Phản xạ", "Hội thoại", "Phát âm"],
    modules: [
      {
        id: 1,
        title: "Chào hỏi và giới thiệu",
        description: "Học cách bắt đầu một cuộc trò chuyện tự nhiên.",
        lessons: [
          {
            id: 1,
            title: "Chào hỏi thông dụng",
            duration: 14,
            type: "Video",
            completed: true,
            locked: false,
          },
          {
            id: 2,
            title: "Giới thiệu bản thân",
            duration: 18,
            type: "Video",
            completed: true,
            locked: false,
          },
          {
            id: 3,
            title: "Từ vựng về thông tin cá nhân",
            duration: 12,
            type: "Từ vựng",
            completed: true,
            locked: false,
          },
        ],
      },
      {
        id: 2,
        title: "Giao tiếp nơi công cộng",
        description: "Sử dụng tiếng Anh trong các tình huống thường ngày.",
        lessons: [
          {
            id: 4,
            title: "Hỏi và chỉ đường",
            duration: 20,
            type: "Video",
            completed: true,
            locked: false,
          },
          {
            id: 5,
            title: "Mua sắm và thanh toán",
            duration: 22,
            type: "Video",
            completed: false,
            locked: false,
          },
          {
            id: 6,
            title: "Thực hành hội thoại",
            duration: 15,
            type: "Bài tập",
            completed: false,
            locked: false,
          },
        ],
      },
      {
        id: 3,
        title: "Giao tiếp nâng cao",
        description: "Phát triển hội thoại dài và tự nhiên hơn.",
        lessons: [
          {
            id: 7,
            title: "Bày tỏ quan điểm",
            duration: 24,
            type: "Video",
            completed: false,
            locked: true,
          },
          {
            id: 8,
            title: "Đồng ý và phản đối",
            duration: 18,
            type: "Video",
            completed: false,
            locked: true,
          },
          {
            id: 9,
            title: "Kiểm tra giao tiếp",
            duration: 20,
            type: "Kiểm tra",
            completed: false,
            locked: true,
          },
        ],
      },
    ],
  },
  {
    id: "office-vocabulary",
    title: "Từ vựng tiếng Anh công sở",
    shortDescription:
      "Mở rộng vốn từ vựng cần thiết cho môi trường làm việc chuyên nghiệp.",
    description:
      "Học từ vựng và cụm từ thường gặp trong email, cuộc họp, tuyển dụng, báo cáo và giao tiếp giữa đồng nghiệp.",
    category: "Từ vựng",
    level: "Trung cấp",
    icon: "💼",
    duration: 14,
    totalLessons: 20,
    students: 735,
    rating: 4.7,
    progress: 35,
    featured: false,
    skills: ["Từ vựng", "Email", "Hội họp", "Công việc"],
    modules: [
      {
        id: 1,
        title: "Môi trường văn phòng",
        description: "Từ vựng về con người và thiết bị văn phòng.",
        lessons: [
          {
            id: 1,
            title: "Vị trí công việc",
            duration: 12,
            type: "Từ vựng",
            completed: true,
            locked: false,
          },
          {
            id: 2,
            title: "Thiết bị văn phòng",
            duration: 14,
            type: "Từ vựng",
            completed: true,
            locked: false,
          },
          {
            id: 3,
            title: "Bài tập ghi nhớ",
            duration: 10,
            type: "Bài tập",
            completed: false,
            locked: false,
          },
        ],
      },
      {
        id: 2,
        title: "Email và cuộc họp",
        description: "Các cụm từ quan trọng khi trao đổi công việc.",
        lessons: [
          {
            id: 4,
            title: "Viết email công việc",
            duration: 20,
            type: "Video",
            completed: false,
            locked: false,
          },
          {
            id: 5,
            title: "Từ vựng trong cuộc họp",
            duration: 18,
            type: "Từ vựng",
            completed: false,
            locked: true,
          },
        ],
      },
    ],
  },
  {
    id: "listening-mastery",
    title: "Luyện nghe tiếng Anh chuyên sâu",
    shortDescription:
      "Cải thiện khả năng nghe hiểu qua hội thoại, thông báo và bài nói dài.",
    description:
      "Khóa học phát triển khả năng nghe hiểu ở tốc độ tự nhiên với nhiều dạng giọng đọc và chủ đề khác nhau.",
    category: "Luyện nghe",
    level: "Trung cấp",
    icon: "🎧",
    duration: 26,
    totalLessons: 32,
    students: 642,
    rating: 4.8,
    progress: 20,
    featured: true,
    skills: ["Nghe chi tiết", "Nghe ý chính", "Ghi chú", "Phản xạ"],
    modules: [
      {
        id: 1,
        title: "Nghe hội thoại",
        description: "Nhận biết thông tin trong các đoạn hội thoại.",
        lessons: [
          {
            id: 1,
            title: "Nghe ý chính",
            duration: 18,
            type: "Video",
            completed: true,
            locked: false,
          },
          {
            id: 2,
            title: "Nghe thông tin chi tiết",
            duration: 22,
            type: "Bài tập",
            completed: false,
            locked: false,
          },
        ],
      },
      {
        id: 2,
        title: "Nghe bài nói dài",
        description: "Luyện tập với thông báo và bài thuyết trình.",
        lessons: [
          {
            id: 3,
            title: "Thông báo công cộng",
            duration: 20,
            type: "Video",
            completed: false,
            locked: true,
          },
          {
            id: 4,
            title: "Bài thuyết trình ngắn",
            duration: 25,
            type: "Bài tập",
            completed: false,
            locked: true,
          },
        ],
      },
    ],
  },
  {
    id: "toeic-750",
    title: "TOEIC mục tiêu 750+",
    shortDescription:
      "Lộ trình luyện thi TOEIC toàn diện dành cho mục tiêu từ 750 điểm.",
    description:
      "Luyện đầy đủ 7 phần của đề thi TOEIC, học chiến thuật làm bài và thực hành với các đề thi mô phỏng.",
    category: "TOEIC",
    level: "Nâng cao",
    icon: "🏆",
    duration: 48,
    totalLessons: 60,
    students: 1520,
    rating: 4.9,
    progress: 0,
    featured: true,
    skills: ["Listening", "Reading", "Chiến thuật", "Luyện đề"],
    modules: [
      {
        id: 1,
        title: "TOEIC Listening",
        description: "Luyện tập Part 1 đến Part 4.",
        lessons: [
          {
            id: 1,
            title: "Part 1: Mô tả hình ảnh",
            duration: 28,
            type: "Video",
            completed: false,
            locked: false,
          },
          {
            id: 2,
            title: "Part 2: Hỏi và đáp",
            duration: 35,
            type: "Video",
            completed: false,
            locked: false,
          },
          {
            id: 3,
            title: "Mini Test Listening",
            duration: 45,
            type: "Kiểm tra",
            completed: false,
            locked: true,
          },
        ],
      },
      {
        id: 2,
        title: "TOEIC Reading",
        description: "Luyện tập Part 5 đến Part 7.",
        lessons: [
          {
            id: 4,
            title: "Part 5: Hoàn thành câu",
            duration: 30,
            type: "Ngữ pháp",
            completed: false,
            locked: true,
          },
          {
            id: 5,
            title: "Part 7: Đọc hiểu",
            duration: 40,
            type: "Bài tập",
            completed: false,
            locked: true,
          },
        ],
      },
    ],
  },
];

export function getCourseById(courseId: string) {
  return courses.find((course) => course.id === courseId);
}