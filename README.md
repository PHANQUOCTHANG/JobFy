# JobFy - Nền Tảng Tuyển Dụng Thông Minh

JobFy là một hệ thống website tuyển dụng hiện đại được xây dựng để kết nối ứng viên và nhà tuyển dụng. Nền tảng được tối ưu hóa cho cả người tìm việc và các công ty, tích hợp các công nghệ AI tiên tiến giúp đánh giá CV, lọc ứng viên và tạo bài kiểm tra phỏng vấn tự động.

## 🚀 Công Nghệ Sử Dụng

### Frontend
- **React.js (Vite)**: Framework chính cho giao diện người dùng, đảm bảo tốc độ và hiệu suất cao.
- **TypeScript**: Giúp code chặt chẽ và an toàn với kiểu dữ liệu.
- **Tailwind CSS**: Dùng để xây dựng giao diện nhanh chóng, Responsive design.
- **Axios & React Query**: Xử lý gọi API và quản lý state server.
- **Zustand**: Quản lý state toàn cục gọn nhẹ.
- **React Router DOM**: Quản lý điều hướng giữa các trang.

### Backend
- **Node.js & Express.js**: Xây dựng RESTful API server.
- **TypeScript**: Đồng bộ kiểu dữ liệu với Frontend.
- **Prisma ORM**: Làm việc với database an toàn, dễ bảo trì.
- **PostgreSQL**: Hệ quản trị cơ sở dữ liệu quan hệ mạnh mẽ.
- **Google Gemini AI**: Tích hợp phân tích CV, tạo câu hỏi phỏng vấn tự động.
- **Cloudinary**: Lưu trữ hình ảnh, CV dạng PDF, tối ưu băng thông.
- **Redis (Upstash)**: Caching dữ liệu, Rate Limiting để bảo vệ API và tối ưu hiệu suất.
- **Nodemailer**: Gửi email tự động (xác thực OTP, hẹn phỏng vấn, ...).
- **Zod**: Xác thực dữ liệu đầu vào.
- **JWT**: Xác thực và phân quyền người dùng an toàn.

## 📁 Cấu Trúc Thư Mục

Dự án được chia làm 2 thư mục chính:

1. `/frontend`: Chứa toàn bộ source code của giao diện người dùng (Client, Employer, Admin).
2. `/backend`: Chứa toàn bộ source code của API Server và Database schema.

## ⚙️ Hướng Dẫn Cài Đặt

### 1. Yêu Cầu Môi Trường
- Node.js (phiên bản >= 18.x)
- PostgreSQL (hoặc chuỗi kết nối đến db online như Supabase/Neon)
- Redis (có thể dùng Upstash Redis)

### 2. Cài Đặt Backend
Mở terminal và trỏ vào thư mục `backend`:
```bash
cd backend
npm install
```

Tạo file `.env` dựa trên file `.env.example` và điền các thông tin cần thiết:
```env
PORT=5000
DATABASE_URL="postgresql://user:pass@localhost:5432/jobfy"
JWT_SECRET="your-secret-key"
REDIS_URL="your-redis-url"
GEMINI_API_KEY="your-gemini-key"
CLOUDINARY_URL="cloudinary://key:secret@cloud_name"
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_USER="your-email"
SMTP_PASS="your-app-password"
```

Chạy migration và seed dữ liệu mẫu:
```bash
npx prisma generate
npx prisma migrate dev --name init
npm run seed
```
> **Ghi chú:** Quá trình seed sẽ tạo sẵn các tài khoản với mật khẩu mặc định là `12345678` (8 ký tự).
> - Tài khoản Admin: `admin@jobfy.vn`
> - Tài khoản Employer: `employer1@jobfy.vn`
> - Tài khoản Candidate: `candidate1@jobfy.vn`

Chạy server backend:
```bash
npm run dev
```

### 3. Cài Đặt Frontend
Mở một terminal khác và trỏ vào thư mục `frontend`:
```bash
cd frontend
npm install
```

Tạo file `.env` và điền thông tin:
```env
VITE_API_URL=http://localhost:5000/api/v1
```

Chạy giao diện frontend:
```bash
npm run dev
```
Mở trình duyệt ở địa chỉ `http://localhost:5173`.

## 🖥️ Hướng Dẫn Sử Dụng Nhanh

Sau khi khởi chạy thành công cả Backend và Frontend, bạn có thể truy cập các phân hệ theo đường dẫn sau:

### 1. Phân hệ Ứng viên (Candidate)
- **Đường dẫn**: `http://localhost:5173/` (Trang chủ chính)
- **Chức năng**: Xem tin tuyển dụng, nộp CV, quản lý hồ sơ ứng viên, v.v.
- **Tài khoản demo**: `candidate1@jobfy.vn` / `12345678`

### 2. Phân hệ Nhà Tuyển Dụng (Employer)
- **Đường dẫn**: `http://localhost:5173/employer`
- **Chức năng**: Đăng tin tuyển dụng, duyệt hồ sơ ứng viên theo cột (Kanban), tạo bài test AI.
- **Tài khoản demo**: `employer1@jobfy.vn` / `12345678`

### 3. Phân hệ Quản Trị Viên (Admin)
- **Đường dẫn**: `http://localhost:5173/admin`
- **Chức năng**: Bảng điều khiển (Dashboard) theo dõi tổng quan, quản lý người dùng, duyệt tin tuyển dụng, thiết lập dữ liệu hệ thống (Ngành nghề, Kỹ năng, Danh mục...).
- **Tài khoản demo**: `admin@jobfy.vn` (hoặc `admin@jobfy.com`) / `12345678`

## 📦 Hướng Dẫn Triển Khai (Deployment)

### Triển Khai Backend (Render)
1. Push code backend lên GitHub.
2. Tạo **Web Service** trên Render (render.com).
3. Connect repo chứa backend.
4. Chọn môi trường là `Node`.
5. Build Command: `npm install && npx prisma generate && npm run build`
6. Start Command: `npm start`
7. Thêm đầy đủ các biến môi trường (Environment Variables) từ file `.env` local lên Render.

### Triển Khai Frontend (Vercel)
1. Push code frontend lên GitHub.
2. Tạo project mới trên Vercel.
3. Import repo frontend.
4. Build settings mặc định của Vite (Build command: `npm run build`, Output: `dist`).
5. Thêm Environment Variable: `VITE_API_URL` trỏ tới link domain của Backend trên Render.
6. Nhấn **Deploy**.

## ✨ Các Tính Năng Nổi Bật

- **Dành cho Ứng viên:** Tạo CV trực tuyến với nhiều mẫu đẹp mắt (AI gợi ý kỹ năng, tóm tắt bản thân), tìm kiếm việc làm nâng cao, theo dõi trạng thái đơn ứng tuyển, nhận thông báo đẩy khi trạng thái ứng tuyển thay đổi.
- **Dành cho Nhà Tuyển Dụng:** Quản lý quy trình tuyển dụng theo dạng phễu (Kanban), phân tích CV ứng viên bằng AI (tự động chấm điểm, highlight kỹ năng), tạo bài Test phỏng vấn bằng AI tự động dựa trên JD. Quản lý công ty, lịch sử tuyển dụng và tự động tạo/gửi email hẹn phỏng vấn.
- **Dành cho Admin:** Bảng thống kê toàn diện, duyệt tin tuyển dụng, xác thực tính pháp lý của doanh nghiệp (Verified Badge), quản lý hệ thống dữ liệu cốt lõi.

---
© 2026 JobFy. All rights reserved.
