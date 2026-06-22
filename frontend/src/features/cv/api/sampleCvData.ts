import { CvData } from '../types';

/**
 * Dữ liệu mẫu đầy đủ để template hiển thị đẹp ngay khi người dùng chọn.
 * Người dùng có thể chỉnh sửa/xóa nội dung này để thay bằng thông tin thật.
 */
export const sampleCvData: Omit<CvData, 'id' | 'templateId' | 'title' | 'createdAt' | 'updatedAt' | 'fileUrl'> = {
  personalInfo: {
    fullName: 'Nguyễn Văn An',
    jobTitle: 'Frontend Developer',
    email: 'nguyenvanan@email.com',
    phone: '0912 345 678',
    address: 'Quận 1, TP. Hồ Chí Minh',
    summary: 'Lập trình viên Frontend với 3+ năm kinh nghiệm phát triển ứng dụng web sử dụng React, TypeScript và Next.js. Đam mê xây dựng giao diện người dùng đẹp, hiệu suất cao và trải nghiệm tốt nhất cho người dùng cuối. Luôn cập nhật các công nghệ mới và áp dụng best practices trong phát triển phần mềm.',
    avatarUrl: '',
    website: 'github.com/nguyenvanan',
    linkedin: 'linkedin.com/in/nguyenvanan',
  },
  experiences: [
    {
      id: 'exp-1',
      companyName: 'Công ty Công nghệ ABC',
      jobTitle: 'Senior Frontend Developer',
      startDate: '01/2023',
      endDate: 'Hiện tại',
      isCurrent: true,
      description: '• Phát triển và duy trì hệ thống quản lý doanh nghiệp với React + TypeScript\n• Tối ưu hiệu suất trang web, giảm 40% thời gian tải trang\n• Mentoring 3 junior developers, code review hàng tuần\n• Triển khai CI/CD pipeline với GitHub Actions',
    },
    {
      id: 'exp-2',
      companyName: 'Startup XYZ',
      jobTitle: 'Frontend Developer',
      startDate: '06/2021',
      endDate: '12/2022',
      isCurrent: false,
      description: '• Xây dựng giao diện ứng dụng e-commerce từ đầu với Next.js\n• Tích hợp API RESTful và GraphQL\n• Phát triển component library tái sử dụng\n• Cải thiện SEO, tăng 60% lượng traffic tự nhiên',
    },
  ],
  educations: [
    {
      id: 'edu-1',
      schoolName: 'Đại học Bách Khoa TP.HCM',
      fieldOfStudy: 'Khoa học Máy tính',
      startDate: '09/2017',
      endDate: '06/2021',
      isCurrent: false,
      description: 'Tốt nghiệp loại Giỏi - GPA: 3.5/4.0\nĐồ án tốt nghiệp: Xây dựng hệ thống quản lý học tập trực tuyến',
    },
  ],
  skills: [
    { id: 'skill-1', name: 'React / Next.js', level: 90, description: 'Thành thạo React Hooks, Redux, Server Components' },
    { id: 'skill-2', name: 'TypeScript', level: 85, description: 'Sử dụng thành thạo trong các dự án lớn' },
    { id: 'skill-3', name: 'HTML / CSS / Tailwind', level: 90, description: 'Responsive design, CSS-in-JS, animations' },
    { id: 'skill-4', name: 'Node.js / Express', level: 70, description: 'Xây dựng REST API, middleware' },
    { id: 'skill-5', name: 'Git / CI-CD', level: 80, description: 'GitHub Actions, Docker basics' },
  ],
  certificates: [
    { id: 'cert-1', name: 'AWS Certified Cloud Practitioner', issuer: 'Amazon Web Services', issueDate: '2023' },
    { id: 'cert-2', name: 'Meta Frontend Developer', issuer: 'Meta (Coursera)', issueDate: '2022' },
  ],
};
