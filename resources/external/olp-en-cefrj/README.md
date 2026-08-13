# Open Language Profiles — hồ sơ CEFR-J tiếng Anh

MTD Lingo Pro lưu cục bộ ba hồ sơ từ repository
[`openlanguageprofiles/olp-en-cefrj`](https://github.com/openlanguageprofiles/olp-en-cefrj):
từ vựng CEFR-J A1–B2, phần mở rộng C1/C2 của Octanove và hồ sơ ngữ pháp
CEFR-J. Các file được ghim theo revision và checksum để bản dùng trong ứng
dụng có thể kiểm tra và tái tạo.

## Provenance

| Trường           | Giá trị                                                |
| ---------------- | ------------------------------------------------------ |
| Upstream         | <https://github.com/openlanguageprofiles/olp-en-cefrj> |
| Revision đã ghim | `d4e45b75b38f27b30dfc5c44d8c571aec7e7092f`             |
| Ngày rà soát     | 2026-08-01                                             |
| Điều khoản gốc   | [`TERMS.md`](./TERMS.md)                               |

| File                                                                                                                                                                                      | Dòng dữ liệu | SHA-256                                                            |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -----------: | ------------------------------------------------------------------ |
| [`cefrj-vocabulary-profile-1.5.csv`](https://github.com/openlanguageprofiles/olp-en-cefrj/blob/d4e45b75b38f27b30dfc5c44d8c571aec7e7092f/cefrj-vocabulary-profile-1.5.csv)                 |        7.799 | `b0dd3c635f1c9a4fdf1490c7e5b7c48e8bbe55b652ad0c9860a95f98e10ae498` |
| [`octanove-vocabulary-profile-c1c2-1.0.csv`](https://github.com/openlanguageprofiles/olp-en-cefrj/blob/d4e45b75b38f27b30dfc5c44d8c571aec7e7092f/octanove-vocabulary-profile-c1c2-1.0.csv) |        2.136 | `18c33a407f2f89f7b8de9671c6d45fe3ea0bce45e7d2d7dcaab48d73e0f7b380` |
| [`cefrj-grammar-profile-20180315.csv`](https://github.com/openlanguageprofiles/olp-en-cefrj/blob/d4e45b75b38f27b30dfc5c44d8c571aec7e7092f/cefrj-grammar-profile-20180315.csv)             |          500 | `94953af376c1336166257e56c78d2139697b40ad8cf6f1235d8f9e89c2efc428` |

Các bản sao chạy trong ứng dụng nằm tại
[`public/data/cefrj`](../../../public/data/cefrj).

## Phạm vi dữ liệu

- Hồ sơ từ vựng CEFR-J cung cấp `headword`, từ loại, cấp CEFR và các cột ánh
  xạ inventory; phần Octanove bổ sung các từ C1/C2.
- Hồ sơ ngữ pháp có 500 mục nhưng chỉ 170 mục được gắn nhãn CEFR-J A1–B2:
  A1 có 63, A2 có 32, B1 có 41 và B2 có 34. Còn 330 mục để trống cột cấp độ;
  không được suy diễn chúng thành C1/C2 hoặc xem hồ sơ này là coverage ngữ
  pháp A1–C2 hoàn chỉnh.
- Các cột metadata có dữ liệu gồm Core Inventory (270 mục), EGP (469 mục),
  GSELO (215 mục) và Notes (394 mục). Ứng dụng hiển thị đúng giá trị nguồn,
  kể cả ghi chú chưa được dịch.
- Nguồn không cung cấp nghĩa tiếng Việt, định nghĩa hay câu ví dụ. Một phần
  nội dung/ghi chú của hồ sơ ngữ pháp vẫn bằng tiếng Nhật, đúng như cảnh báo
  của upstream.

Các cấp độ là nhãn từ hồ sơ CEFR-J/Octanove, không phải kết quả đánh giá năng
lực cá nhân của người học.

## Điều khoản sử dụng và ghi công

Theo điều khoản upstream, bộ từ vựng và ngữ pháp CEFR-J có thể dùng miễn phí
cho nghiên cứu lẫn thương mại với điều kiện trích dẫn dữ liệu đúng cách. Bản
quyền thuộc **Tono Laboratory at TUFS (Tokyo University of Foreign Studies)**.
CEFR-J và Open Language Profiles không chịu trách nhiệm về sai sót của dữ liệu
hoặc thiệt hại phát sinh từ việc sử dụng dữ liệu.

Hồ sơ từ vựng C1/C2 của Octanove được cung cấp theo
[Creative Commons Attribution-ShareAlike 4.0 International](https://creativecommons.org/licenses/by-sa/4.0/).
Khi phân phối bản sửa đổi của phần C1/C2, phải giữ ghi công và áp dụng điều
kiện ShareAlike tương ứng. Toàn văn lời giới thiệu, điều khoản và tài liệu tham
khảo của upstream được lưu nguyên văn trong [`TERMS.md`](./TERMS.md).

Khi hiển thị hoặc xuất dữ liệu CEFR-J, giữ các trích dẫn sau:

- _The CEFR-J Wordlist Version 1.5. Compiled by Yukio Tono, Tokyo University
  of Foreign Studies. Retrieved from http://www.cefr-j.org/download.html on
  1/20/2020._
- _The CEFR-J Grammar Profile Version 20180315. Retrieved from
  http://www.cefr-j.org/download.html on 1/20/2020._

Với phần C1/C2, ghi công **Octanove Labs**, liên kết nguồn và giấy phép CC
BY-SA 4.0.

## Đồng bộ và kiểm tra

Từ thư mục gốc của dự án:

```bash
# Tải đúng ba file ở revision đã ghim, xác minh rồi cập nhật bản cục bộ
node scripts/sync-cefrj-profiles.mjs

# Chỉ kiểm tra các file đang lưu; không cần mạng
node scripts/sync-cefrj-profiles.mjs --check
```

Script kiểm tra header chính xác, số dòng dữ liệu và SHA-256 của từng file.
Muốn nâng revision cần rà soát lại nội dung cùng điều khoản, cập nhật commit,
header/số dòng/checksum trong script và tài liệu này, rồi chạy lại cả hai lệnh.
