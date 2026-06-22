export interface CvTemplate {
  id: string;
  name: string;
  thumbnail: string;
  language: string;
  style: 'Đơn giản' | 'Hiện đại' | 'Sáng tạo' | 'Harvard' | 'Chuyên nghiệp' | 'Tối giản' | 'Công nghệ' | 'Thanh lịch';
  industry: string;
  usageCount: number;
  columns: 1 | 2;
  isHot?: boolean;
  isNew?: boolean;
  color?: string;
}

export const mockCvTemplates: CvTemplate[] = [
  { id: 'cv-1', name: 'TopCV Impressive', thumbnail: '/images/cv/modern.png', language: 'Tiếng Việt', style: 'Hiện đại', industry: 'Lập trình viên', usageCount: 12450, columns: 2, isHot: true, color: '#4F46E5' },
  { id: 'cv-2', name: 'Minimalist Tech', thumbnail: '/images/cv/simple.png', language: 'Tiếng Anh', style: 'Tối giản', industry: 'Lập trình viên', usageCount: 8320, columns: 1, color: '#111111' },
  { id: 'cv-3', name: 'Creative Designer', thumbnail: '/images/cv/creative.png', language: 'Tiếng Việt', style: 'Sáng tạo', industry: 'Thiết kế / Mỹ thuật', usageCount: 5210, columns: 2, isNew: true, color: '#ec4899' },
  { id: 'cv-4', name: 'Corporate Executive', thumbnail: '/images/cv/modern.png', language: 'Tiếng Anh', style: 'Chuyên nghiệp', industry: 'Nhân viên kế toán', usageCount: 15600, columns: 2, isHot: true, color: '#1e293b' },
  { id: 'cv-5', name: 'Elegant Classic', thumbnail: '/images/cv/simple.png', language: 'Tiếng Nhật', style: 'Thanh lịch', industry: 'Biên phiên dịch', usageCount: 3400, columns: 1, color: '#4a4a4a' },
  { id: 'cv-6', name: 'Modern Startup', thumbnail: '/images/cv/creative.png', language: 'Tiếng Việt', style: 'Hiện đại', industry: 'Chuyên viên marketing', usageCount: 9800, columns: 2, isHot: true, color: '#f59e0b' },
  { id: 'cv-7', name: 'Harvard Standard', thumbnail: '/images/cv/harvard.png', language: 'Tiếng Anh', style: 'Harvard', industry: 'Giáo dục', usageCount: 22000, columns: 1, isHot: true, color: '#000000' },
  { id: 'cv-8', name: 'Sale Professional', thumbnail: '/images/cv/modern.png', language: 'Tiếng Việt', style: 'Đơn giản', industry: 'Nhân viên kinh doanh', usageCount: 18500, columns: 1, color: '#0ea5e9' },
  { id: 'cv-9', name: 'Creative Marketer', thumbnail: '/images/cv/creative.png', language: 'Tiếng Việt', style: 'Sáng tạo', industry: 'Chuyên viên marketing', usageCount: 4500, columns: 2, isNew: true, color: '#8b5cf6' },
  { id: 'cv-10', name: 'Tech Engineer', thumbnail: '/images/cv/modern.png', language: 'Tiếng Anh', style: 'Công nghệ', industry: 'Lập trình viên', usageCount: 11200, columns: 2, color: '#0f172a' },
  { id: 'cv-11', name: 'Executive Leader', thumbnail: '/images/cv/modern.png', language: 'Tiếng Anh', style: 'Chuyên nghiệp', industry: 'Quản lý điều hành', usageCount: 5600, columns: 2, isNew: true, color: '#0f766e' },
  { id: 'cv-12', name: 'Simple Accounting', thumbnail: '/images/cv/simple.png', language: 'Tiếng Việt', style: 'Đơn giản', industry: 'Nhân viên kế toán', usageCount: 6700, columns: 1, color: '#10b981' },
  { id: 'cv-13', name: 'Elegant Floral', thumbnail: '/images/cv/simple.png', language: 'Tiếng Pháp', style: 'Thanh lịch', industry: 'Nhà hàng / Khách sạn', usageCount: 2300, columns: 1, color: '#9d174d' },
  { id: 'cv-14', name: 'Ultra Minimal', thumbnail: '/images/cv/simple.png', language: 'Tiếng Việt', style: 'Tối giản', industry: 'Hành chính nhân sự', usageCount: 4200, columns: 1, color: '#3f3f46' },
  { id: 'cv-15', name: 'Hacker Pro', thumbnail: '/images/cv/modern.png', language: 'Tiếng Anh', style: 'Công nghệ', industry: 'An toàn thông tin', usageCount: 8900, columns: 2, isHot: true, color: '#14b8a6' },
  { id: 'cv-16', name: 'Harvard Scholar', thumbnail: '/images/cv/harvard.png', language: 'Tiếng Việt', style: 'Harvard', industry: 'Nghiên cứu khoa học', usageCount: 15600, columns: 1, color: '#172554' }
];
