# 💼 JobFy - Giao diện nền tảng tuyển dụng

Đây là giao diện người dùng của nền tảng tuyển dụng JobFy, được xây dựng với mục tiêu mang lại trải nghiệm tìm kiếm việc làm mượt mà, tối ưu hóa cho cả Ứng viên (Candidate) và Nhà tuyển dụng (Employer).

---

## ⚡ Tech Stack & Core Libraries

- **Framework:** React 18 + Vite (TypeScript)
- **State Management:** 
  - **Redux Toolkit:** Quản lý trạng thái xác thực và thông tin user toàn cục.
  - **TanStack Query (React Query):** Quản lý server-state, caching dữ liệu API.
- **Styling:** 
  - **Tailwind CSS:** Thiết kế giao diện responsive linh hoạt.
  - **Shadcn/UI:** Hệ thống component chuẩn mực.
- **Routing:** React Router v6

---

## ✨ Tính năng nổi bật

### 👤 Candidate Portal
- Quản lý hồ sơ ứng viên (Profile, CV, Cover Letter).
- Tìm kiếm việc làm và lưu công việc yêu thích.
- Theo dõi lịch sử ứng tuyển và trạng thái phản hồi từ nhà tuyển dụng.

### 🏢 Employer Portal
- Quản lý thông tin công ty.
- Đăng tuyển việc làm mới và quản lý tin tuyển dụng.
- Quản lý hồ sơ ứng viên ứng tuyển, thay đổi trạng thái (Tiếp nhận, Đã xem, Phù hợp...).

---

## 🏗️ Cấu trúc thư mục

Dự án tuân thủ cấu trúc **Feature-based**:

```text
src/
├── features/           # Các tính năng lớn (auth, jobs, applications, user, companies)
├── store/              # Cấu hình Redux Toolkit & Slices
├── components/         # Shared UI components (Button, Table, Input...)
├── lib/                # Cấu hình Axios, Utils
├── layouts/            # Layouts cho Client, Candidate, Employer
└── pages/              # Các trang giao diện chính
```

## Khởi chạy

Cài đặt các gói phụ thuộc:
```bash
npm install
```

Khởi động môi trường phát triển:
```bash
npm run dev
```
