export interface CvTemplate {
  id: string;
  name: string;
  thumbnail: string;
  language: string;
  style: 'Đơn giản' | 'Hiện đại' | 'Sáng tạo' | 'Harvard';
  industry: string;
  usageCount: number;
  columns: 1 | 2;
  isHot?: boolean;
  isNew?: boolean;
  color?: string;
}

export const mockCvTemplates: CvTemplate[] = [
  {
    id: 'cv-1',
    name: 'TopCV Impressive',
    thumbnail: '/images/cv/modern.png',
    language: 'Tiếng Việt',
    style: 'Hiện đại',
    industry: 'Lập trình viên',
    usageCount: 12450,
    columns: 2,
    isHot: true,
    color: '#4F46E5'
  },
  {
    id: 'cv-2',
    name: 'Minimalist Tech',
    thumbnail: '/images/cv/simple.png',
    language: 'Tiếng Anh',
    style: 'Đơn giản',
    industry: 'Nhân viên kinh doanh',
    usageCount: 8320,
    columns: 1,
    color: '#3b82f6'
  },
  {
    id: 'cv-3',
    name: 'Creative Designer',
    thumbnail: '/images/cv/creative.png',
    language: 'Tiếng Việt',
    style: 'Sáng tạo',
    industry: 'Thiết kế / Mỹ thuật',
    usageCount: 5210,
    columns: 2,
    isNew: true,
    color: '#ec4899'
  },
  {
    id: 'cv-4',
    name: 'Corporate Executive',
    thumbnail: '/images/cv/modern.png',
    language: 'Tiếng Anh',
    style: 'Hiện đại',
    industry: 'Nhân viên kế toán',
    usageCount: 15600,
    columns: 2,
    isHot: true,
    color: '#1e293b'
  },
  {
    id: 'cv-5',
    name: 'Elegant Classic',
    thumbnail: '/images/cv/simple.png',
    language: 'Tiếng Nhật',
    style: 'Đơn giản',
    industry: 'Biên phiên dịch',
    usageCount: 3400,
    columns: 1,
    color: '#64748b'
  },
  {
    id: 'cv-6',
    name: 'Modern Startup',
    thumbnail: '/images/cv/creative.png',
    language: 'Tiếng Việt',
    style: 'Sáng tạo',
    industry: 'Chuyên viên marketing',
    usageCount: 9800,
    columns: 2,
    isHot: true,
    color: '#f59e0b'
  },
  {
    id: 'cv-7',
    name: 'Harvard Standard',
    thumbnail: '/images/cv/harvard.png',
    language: 'Tiếng Anh',
    style: 'Harvard',
    industry: 'Lập trình viên',
    usageCount: 22000,
    columns: 1,
    isHot: true,
    color: '#000000'
  },
  {
    id: 'cv-8',
    name: 'Sale Professional',
    thumbnail: '/images/cv/modern.png',
    language: 'Tiếng Việt',
    style: 'Hiện đại',
    industry: 'Nhân viên kinh doanh',
    usageCount: 18500,
    columns: 2,
    color: '#0ea5e9'
  },
  {
    id: 'cv-9',
    name: 'Creative Marketer',
    thumbnail: '/images/cv/creative.png',
    language: 'Tiếng Việt',
    style: 'Sáng tạo',
    industry: 'Chuyên viên marketing',
    usageCount: 4500,
    columns: 2,
    isNew: true,
    color: '#8b5cf6'
  },
  {
    id: 'cv-10',
    name: 'Basic Accounting',
    thumbnail: '/images/cv/simple.png',
    language: 'Tiếng Việt',
    style: 'Đơn giản',
    industry: 'Nhân viên kế toán',
    usageCount: 6700,
    columns: 1,
    color: '#10b981'
  },
  {
    id: 'cv-11',
    name: 'Tech Lead',
    thumbnail: '/images/cv/modern.png',
    language: 'Tiếng Anh',
    style: 'Hiện đại',
    industry: 'Lập trình viên',
    usageCount: 11200,
    columns: 2,
    color: '#334155'
  },
  {
    id: 'cv-12',
    name: 'Harvard Scholar',
    thumbnail: '/images/cv/harvard.png',
    language: 'Tiếng Việt',
    style: 'Harvard',
    industry: 'Giáo dục / Đào tạo',
    usageCount: 5600,
    columns: 1,
    isNew: true,
    color: '#172554'
  }
];
