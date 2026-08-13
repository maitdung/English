# m98/fluent — methodology reference

MTD Lingo Pro tham khảo có chọn lọc các nguyên tắc thiết kế phiên học từ
[`m98/fluent`](https://github.com/m98/fluent), một bộ hướng dẫn học ngôn ngữ
dành cho Claude Code. Đây là tài liệu tham khảo bên ngoài; dự án này không cài
Fluent như một plugin, không chạy Claude Code và không sao chép dữ liệu người
học của upstream.

## Provenance

| Trường | Giá trị |
| --- | --- |
| Upstream | <https://github.com/m98/fluent> |
| Revision đã rà soát | `650188a9cfe4606294da0648a26e58429a7bd62f` (nhánh `main`) |
| Ngày rà soát | 2026-08-01 |
| Tài liệu tham chiếu | [`LEARNING_SYSTEM.md`](https://github.com/m98/fluent/blob/650188a9cfe4606294da0648a26e58429a7bd62f/LEARNING_SYSTEM.md), [`README.md`](https://github.com/m98/fluent/blob/650188a9cfe4606294da0648a26e58429a7bd62f/README.md) |
| Giấy phép upstream | MIT — xem [`LICENSE`](./LICENSE) |

## Phần được chọn để áp dụng

Các mục dưới đây là bản tóm lược/diễn giải cho sản phẩm, không phải bản sao
của tài liệu upstream:

1. **Active recall trước khi xem đáp án.** Mỗi lượt luyện nên yêu cầu người học
   trả lời trước, rồi mới hiển thị đáp án và giải thích.
2. **Phản hồi ngay sau mỗi lượt.** Phản hồi cần chỉ rõ đúng/sai, lý do và phiên
   bản đúng để người học sửa được lỗi ngay trong ngữ cảnh.
3. **Ôn lặp lại theo lịch.** Kết quả của từng item được lưu cùng số lần làm,
   điểm và ngày ôn tiếp theo; các item đến hạn được ưu tiên trong kế hoạch ngày.
4. **Trộn kỹ năng và chủ đề.** Một phiên ngắn có thể xen kẽ từ vựng, ngữ pháp,
   nghe, đọc, viết hoặc nói để tránh chỉ luyện một dạng bài.
5. **Điều chỉnh độ khó theo kết quả.** Dùng điểm gần đây và cấp độ CEFR để chọn
   thử thách tiếp theo; khoảng 60–70% đúng được dùng như một heuristic sản phẩm,
   không phải cam kết khoa học hay y tế.
6. **Theo dõi lỗi và tiến bộ.** Lưu kết quả theo kỹ năng/bộ bài để dashboard có
   thể đề xuất việc cần làm tiếp theo thay vì chỉ hiển thị tổng điểm.

## Ánh xạ vào MTD Lingo Pro

| Nguyên tắc | Điểm tích hợp hiện tại |
| --- | --- |
| Active recall + feedback | `src/features/practice/pages/PracticeSessionPage.tsx` |
| Bộ bài đa dạng | `src/features/practice/data/practiceCatalog.ts` |
| Lịch ôn và điểm theo item | `src/features/learning-engine/hooks/useLearningProgress.ts` |
| Kế hoạch học hằng ngày | `src/features/learning-engine/data/dailyLearning.ts` |
| Hiển thị tiến bộ | `src/features/dashboard/pages/DashboardPage.tsx` |

Registry dữ liệu tối thiểu cho tham chiếu này nằm tại
[`src/features/learning-engine/data/knowledgeRegistry.ts`](../../../src/features/learning-engine/data/knowledgeRegistry.ts).
Registry chỉ mô tả nguồn và các nguyên tắc đã chọn; nó không tự thay đổi thuật
toán chấm điểm hay lịch ôn.

## Ranh giới tích hợp

- Không đưa các lệnh `/fluent-*`, hook Bash/Python, sáu file JSON cá nhân hoặc
  dữ liệu trong `data/` của upstream vào ứng dụng.
- Không coi các tuyên bố về hiệu quả học tập trong tài liệu upstream là kết quả
  đã được kiểm chứng cho MTD Lingo Pro; nội dung ở đây chỉ là quyết định thiết
  kế có thể kiểm thử.
- Không thay thế tiến độ theo tài khoản và backend hiện có bằng cơ chế lưu cục
  bộ của upstream.
- Khi cập nhật nguồn tham khảo, cần đổi revision ở README và registry, rồi rà
  soát lại các nguyên tắc được chọn.

## Attribution

Phần methodology được diễn giải từ **m98/fluent** của **Fluent Contributors**,
phát hành theo MIT License. Copyright notice và toàn văn giấy phép được giữ
trong [`LICENSE`](./LICENSE). Mọi mã nguồn, hook và dữ liệu người học của MTD
Lingo Pro vẫn thuộc phạm vi giấy phép và quy trình của repository này.
