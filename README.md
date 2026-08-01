# MTD Lingo Pro

Nền tảng học tiếng Anh toàn diện từ A1 đến C2, gồm lộ trình học, kho từ
vựng, bài học tương tác, luyện nghe – nói – đọc – viết – ngữ pháp, kiểm tra
và khu vực quản trị người dùng.

## Điểm nổi bật

- Giao diện responsive phong cách premium, có animation, trạng thái loading,
  feedback tương tác và hỗ trợ `prefers-reduced-motion`.
- Kho học liệu A1–C2 đã chuẩn hóa: **6 khóa học, 22 bài học, 320 từ vựng,
  505 bài tập**.
- A2 gồm Plans & Weekend Activities, Travel Problems & Solutions, Healthy
  Routines & Community.
- B1 gồm Workplace Collaboration, Media & Digital Habits, Environment & Local
  Action.
- B2 gồm Negotiation & Conflict Resolution, Global Issues & Public Policy,
  Innovation, Risk & Ethics.
- C1 gồm Research, Evidence & Academic Argument, Leadership, Strategy &
  Nuanced Communication, Culture, Identity & Interpretation.
- C2 gồm Precision, Nuance & Stance, Synthesis, Evidence & Critique, Style,
  Rhetoric & Adaptation.
- Phòng luyện kỹ năng theo cấp độ A1–C2: từ vựng, nghe, nói, đọc, viết, ngữ
  pháp và kiểm tra.
- Thư viện luyện tập offline gồm **24 bộ bài / 136 lượt tương tác**, phủ 7
  dạng: chọn đáp án, nghe–chọn, điền từ, chính tả, xếp câu, viết có hướng dẫn
  và nói đuổi; kết quả được lưu theo từng bộ để làm kế hoạch hằng ngày.
- Sách **TOEIC 7 Parts** có 11 bộ / 84 câu: Part 1 ảnh, Part 2 hỏi–đáp,
  Part 3 hội thoại, Part 4 bài nói, Part 5 ngữ pháp–từ vựng, Part 6 điền đoạn,
  Part 7 đọc hiểu và hai phiên mini mock. Lộ trình chương được khai báo tại
  `src/features/practice/data/knowledgeBooks.ts`.
- Trang chủ có khu vực thử bài tập không cần đăng nhập; dashboard có Daily Mix
  đa kỹ năng và thư viện offline để vẫn học được khi API tạm thời gián đoạn.
- Quiz có chế độ Nền tảng/Tổng hợp/Nâng cao, câu hỏi B2–C1 và giải thích sau
  mỗi đáp án.
- Kế hoạch học mỗi ngày tự chọn từ mới và mục cần ôn đến hạn; lưu streak, điểm,
  số lần làm và interval ôn cho từng mục.
- Bài học lấy từ API, phát âm bằng Web Speech API, chấm đáp án phía server và
  lưu tiến độ riêng theo tài khoản.
- Đăng ký, đăng nhập, refresh token, ghi nhớ đăng nhập, cập nhật hồ sơ, đổi
  mật khẩu và đặt lại mật khẩu.
- Khu vực admin có thống kê, tìm kiếm, lọc, sắp xếp, phân trang và quản lý vai
  trò học viên/giảng viên/quản trị viên.
- API có JWT, bcrypt, RBAC, rate limit, Helmet, CORS allowlist, validation
  whitelist, token reset dạng hash và thu hồi phiên sau khi đổi mật khẩu.
- Swagger API tại `http://localhost:3001/api/docs`.

## Công nghệ

- Frontend: React 19, TypeScript, Vite 8, Tailwind CSS 4.
- Backend: NestJS 11, Prisma 7, PostgreSQL, Redis.
- Kiểm thử: Jest, Supertest, Node test runner, Oxlint.

## Chạy dự án

Yêu cầu Node.js 22+, npm, Docker và Docker Compose.

```bash
docker compose up -d
```

Frontend:

```bash
npm install
cp .env.example .env
npm run dev
```

Backend (mở terminal khác):

```bash
cd server
npm install
cp .env.example .env
npx prisma migrate deploy
npm run content:import
npm run start:dev
```

Mặc định frontend chạy tại `http://localhost:5173`, API tại
`http://localhost:3001/api`.

## Biến môi trường

Frontend:

```env
VITE_API_URL=http://localhost:3001/api
VITE_TELEGRAM_SUPPORT_URL=https://t.me/maituandung004
```

Dashboard và landing có nút chat Telegram công khai tới `@maituandung004`. Nút này
chỉ mở cuộc trò chuyện và có thể điền sẵn nội dung; nếu cần gửi thông báo tự
động, hãy tạo bot ở backend với `TELEGRAM_BOT_TOKEN` và `TELEGRAM_CHAT_ID`,
không đưa hai giá trị đó vào biến `VITE_*` hay mã frontend.

Backend xem đầy đủ trong `server/.env.example`. Khi triển khai thật:

- Dùng hai secret JWT ngẫu nhiên, dài và khác nhau.
- Giữ `PASSWORD_RESET_EXPOSE_TOKEN=false`.
- Chỉ khai báo đúng domain frontend trong `FRONTEND_URL`; nhiều domain được
  phân tách bằng dấu phẩy.
- Bắt buộc dùng PostgreSQL/Redis có TLS và mật khẩu mạnh.
- Kết nối nhà cung cấp email giao dịch để chuyển reset link đến người dùng.

## Nội dung học

```bash
cd server
npm run content:check       # format + typecheck + test + audit
npm run content:dry-run     # mô phỏng, không ghi database
npm run content:import      # upsert bằng transaction
npm run content:verify      # so khớp source với database
npm run content:stats
```

Học liệu được quản lý trong `server/prisma/content`. Import mặc định không xóa
toàn bộ dữ liệu; mỗi khóa học được upsert và mỗi bài được cập nhật trong
transaction. Làm giàu từ vựng qua API công cộng mặc định được tắt để CI/deploy
ổn định; chỉ đặt `ENABLE_VOCABULARY_ENRICHMENT=true` khi chủ động chạy import và
chấp nhận thời gian chờ từ dịch vụ bên ngoài.

## Kiểm tra chất lượng

```bash
# Frontend
npm run build
npm run lint

# Backend
cd server
npm run typecheck
npm test -- --runInBand
npm run build
npm run test:e2e -- --runInBand
```

## Deploy nhanh

1. Copy env mẫu:

```bash
cp .env.production.example .env.production
cp server/.env.production.example server/.env.production
```

Hoặc chạy:

```bash
npm run deploy:prepare
```

2. Chạy kiểm tra trước deploy:

```bash
npm run deploy:check
```

3. Frontend:

- Deploy lên Cloudflare Pages
- Build command: `npm run build`
- Output directory: `dist`
- Env: `VITE_API_URL=https://english-3t66.onrender.com/api`

4. Backend:

- Deploy riêng trên Render / Railway / Fly / VPS
- Chạy `npx prisma migrate deploy`
- Chạy `npm run seed:content`
- Start: `npm run start:prod`

5. Nút triển khai trong trang quản trị:

- Trong Cloudflare Pages, tạo Deploy Hook cho nhánh `develop`.
- Lưu URL hook vào biến bí mật `CLOUDFLARE_PAGES_DEPLOY_HOOK_URL` trên Render.
- Không đặt URL hook trong biến `VITE_*` hoặc mã frontend.
- Sau đó ADMIN có thể vào phần **Cấu hình website** và bấm
  **Triển khai lên english-c0h.pages.dev** để build lại commit mới nhất đã được
  push lên `develop`.

Xem checklist đầy đủ trong [`docs/DEPLOYMENT_FINAL.md`](/Users/mtd/Downloads/englishpro/mtd-lingo-pro/docs/DEPLOYMENT_FINAL.md).

## Phân quyền

- `STUDENT`: học, luyện kỹ năng, làm bài, xem tiến độ và quản lý hồ sơ.
- `TEACHER`: tài khoản đội ngũ, sẵn sàng mở rộng nghiệp vụ giảng dạy.
- `ADMIN`: truy cập `/dashboard/admin` và gọi API quản trị có `JwtAuthGuard` +
  `RolesGuard`.

Không đưa file `.env`, token, mật khẩu hay khóa dịch vụ lên Git.

## Theo dõi bàn giao

Xem `TIEN_DO_NANG_CAP.txt` để biết trạng thái nâng cấp, kết quả kiểm tra và các
việc cần cấu hình ngoài mã nguồn.
