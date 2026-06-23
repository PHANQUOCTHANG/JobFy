# JobFy - Nền tảng Tuyển dụng & Tìm kiếm Việc làm Thông minh

JobFy là một ứng dụng Full-stack hiện đại được thiết kế để kết nối Ứng viên (Candidates) và Nhà tuyển dụng (Employers) một cách dễ dàng. Dự án tích hợp các công nghệ tối ưu nhất hiện nay cùng các tính năng Trí tuệ Nhân tạo (AI) giúp nâng cao trải nghiệm ứng tuyển.

![Tech Stack](https://img.shields.io/badge/Stack-React%20%7C%20Node.js%20%7C%20PostgreSQL-blue?style=for-the-badge)
![Status](https://img.shields.io/badge/Status-Production_Ready-success?style=for-the-badge)

---

## 🚀 Các Tính Năng Nổi Bật

### 🧑‍🎓 Dành cho Ứng viên (Candidate)
- **Tạo và Quản lý CV đa dạng:** Cung cấp trình chỉnh sửa CV chuyên nghiệp (CV Builder), hỗ trợ xuất file PDF.
- **Tối ưu CV bằng AI:** Tích hợp AI (LLM) để phân tích, chuẩn hóa văn phong và làm nổi bật kinh nghiệm làm việc.
- **Tìm kiếm Việc làm Nâng cao:** Lọc công việc theo Keyword, Tỉnh/Thành, Miền (Bắc/Trung/Nam), Mức lương và Cấp bậc.
- **Gợi ý Việc làm Thông minh:** Thuật toán đề xuất các công việc "Hấp dẫn" và phù hợp với kỹ năng của ứng viên.
- **Lưu trữ & Cảnh báo Việc làm (Job Alerts):** Tự động gửi thông báo khi có công việc mới phù hợp với tiêu chí.

### 👔 Dành cho Nhà Tuyển Dụng (Employer) & Admin
- **Quản lý Tổ chức:** Tạo trang Profile công ty chuẩn SEO, hiển thị danh sách công việc đang mở.
- **Tuyển dụng:** Đăng tải tin tuyển dụng, quản lý trạng thái hồ sơ ứng viên (Pending, Interviewing, Rejected).
- **Hệ thống Đánh giá:** Xử lý luồng đánh giá công ty (Company Reviews).
- **Dashboard Quản trị:** Thống kê lượt xem, quản lý danh mục và người dùng toàn hệ thống.

---

## 💻 Tech Stack (Công Nghệ Sử Dụng)

### Frontend (Client-side)
- **Framework:** React 18 + Vite
- **Ngôn ngữ:** TypeScript
- **Giao diện & UI:** Tailwind CSS, Radix UI, Framer Motion
- **Quản lý Trạng thái:** Redux Toolkit, React Query (TanStack)
- **Routing:** React Router v7
- **Kết nối Real-time:** Socket.io-client

### Backend (Server-side)
- **Môi trường:** Node.js + Express.js
- **Ngôn ngữ:** TypeScript
- **Cơ sở dữ liệu (Database):** PostgreSQL (Quản lý qua Prisma ORM)
- **Bộ nhớ đệm (Cache/Queue):** Redis & BullMQ
- **Bảo mật & Xác thực:** JWT (Access/Refresh Tokens), Bcrypt
- **Lưu trữ File:** Cloudinary (Avatar, CV)
- **Email Service:** Nodemailer

---

## 🛠 Hướng dẫn Cài đặt Local (Local Setup)

Bạn có thể chạy dự án thông qua Docker (Khuyên dùng) hoặc cài đặt thủ công.

### Phương án 1: Dùng Docker Compose (Tự động toàn bộ)
1. Cài đặt Docker & Docker Compose.
2. Tại thư mục gốc của dự án, chạy lệnh:
   ```bash
   docker compose up --build
   ```
3. Docker sẽ tự động dựng Frontend, Backend, PostgreSQL và Redis. Truy cập Frontend tại `http://localhost:5173` và Backend tại `http://localhost:5000`.

### Phương án 2: Cài đặt Thủ công
**Yêu cầu:** Node.js (v18+), PostgreSQL và Redis đang chạy trên máy.

**Cài đặt Backend:**
```bash
cd backend
npm install
# Khởi tạo schema và đẩy vào DB
npx prisma generate
npx prisma db push
# Chạy Backend (Chế độ Dev)
npm run dev
```

**Cài đặt Frontend:**
```bash
cd frontend
npm install
npm run dev
```

---

## 🌱 Khởi tạo Dữ liệu Mẫu (Database Seeding)

Để test hệ thống nhanh chóng, dự án cung cấp script tạo dữ liệu tự động (Admin, Nhà tuyển dụng, Ứng viên, CV, Việc làm):

```bash
cd backend

# Chạy Seed tạo 1 tài khoản Admin duy nhất (admin@jobfy.vn / 12345678)
npx ts-node -r tsconfig-paths/register prisma/seed-admin.ts

# Hoặc chạy Seed toàn bộ dữ liệu mẫu (Sẽ tạo ra 100 ứng viên, 50 jobs...)
npm run seed
```

---

## ☁️ Hướng dẫn Triển khai (Deployment)

Dự án đã được thiết lập sẵn file `render.yaml` và `vercel.json` để tự động hóa quá trình đẩy lên mạng.

### 1. Backend (Triển khai lên Render)
- Đăng nhập [Render.com](https://render.com), chọn **New > Blueprint**.
- Kết nối với kho lưu trữ GitHub của bạn.
- Render sẽ tự động đọc file `render.yaml`, khởi tạo **PostgreSQL**, **Redis** và **Web Service (Node.js)**.
- Bổ sung các biến môi trường nhạy cảm trong tab Environment (Cloudinary API, JWT Secret...).

### 2. Frontend (Triển khai lên Vercel)
- Đăng nhập [Vercel.com](https://vercel.com), chọn **Add New > Project**.
- Cấu hình thư mục gốc (Root Directory) là `frontend`. Vercel sẽ tự nhận diện đây là dự án Vite.
- Thêm biến môi trường `VITE_API_URL` và gán giá trị URL của Backend (ví dụ: `https://jobfy-backend.onrender.com/api/v1`).
- Bấm **Deploy**.

Sau khi Frontend có Domain chính thức (Ví dụ `https://jobfy.vercel.app`), hãy quay lại Render cập nhật biến `FRONTEND_URL` và `CLIENT_URL` để mở CORS cho Backend.

---

## 📂 Cấu trúc Thư mục

```text
jobfy/
├── backend/          # Backend Source Code
│   ├── prisma/       # Prisma Schema & Migration/Seed files
│   ├── src/          # Controllers, Services, Repositories, Routes
│   └── .env.example  # Biến môi trường mẫu cho Backend
├── frontend/         # Frontend Source Code
│   ├── src/          # React Components, Pages, Redux store, Hooks
│   └── vercel.json   # Cấu hình rewrite rules cho Vercel (SPA)
├── render.yaml       # Blueprint CI/CD cho Render
├── docker-compose.yml# Cấu hình chạy toàn bộ dịch vụ ảo hóa
└── README.md         # File tài liệu bạn đang đọc
```
