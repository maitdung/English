export type KnowledgeMethod = {
  id: string;
  title: string;
  summary: string;
  application: string;
};

export type ExternalKnowledgeResource = {
  id: string;
  title: string;
  kind: "methodology" | "content" | "reference";
  url: string;
  revision: string;
  license: string;
  attribution: string;
  localDocumentation: string;
  methods: KnowledgeMethod[];
};

/**
 * Small, explicit registry for external learning references.
 *
 * Keeping the source and the adopted ideas separate lets product/content work
 * cite methodology without accidentally importing upstream learner data or
 * treating an external guide as executable application logic.
 */
export const externalKnowledgeResources: ExternalKnowledgeResource[] = [
  {
    id: "m98-fluent",
    title: "Fluent — AI language learning kit",
    kind: "methodology",
    url: "https://github.com/m98/fluent",
    revision: "650188a9cfe4606294da0648a26e58429a7bd62f",
    license: "MIT",
    attribution: "Fluent Contributors (github.com/m98/fluent)",
    localDocumentation: "resources/external/fluent/README.md",
    methods: [
      {
        id: "active-recall",
        title: "Active recall",
        summary: "Yêu cầu người học truy hồi trước khi xem đáp án.",
        application:
          "Hiển thị một câu hỏi, khóa đáp án cho đến khi người học trả lời.",
      },
      {
        id: "immediate-feedback",
        title: "Phản hồi tức thì",
        summary: "Giải thích lỗi ngay sau mỗi lượt trả lời.",
        application:
          "Practice session lưu điểm và hiển thị giải thích trước câu kế tiếp.",
      },
      {
        id: "spaced-review",
        title: "Ôn lặp lại",
        summary: "Ưu tiên item đến hạn dựa trên kết quả trước đó.",
        application:
          "Dùng reviewRecords hiện có để xây dựng kế hoạch học hằng ngày.",
      },
      {
        id: "interleaving",
        title: "Xen kẽ kỹ năng",
        summary: "Trộn chủ đề và dạng bài trong các phiên ngắn.",
        application:
          "Daily plan và practice catalog chọn từ nhiều kỹ năng CEFR.",
      },
      {
        id: "adaptive-challenge",
        title: "Thử thách thích ứng",
        summary: "Điều chỉnh cấp độ dựa trên điểm gần đây.",
        application:
          "Dùng điểm phiên trước làm tín hiệu đề xuất; không tự sinh nội dung ngoài catalog.",
      },
    ],
  },
];

export const fluentKnowledgeResource = externalKnowledgeResources[0];
