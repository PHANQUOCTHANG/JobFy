import { FilterType, QuickFilterOption } from '../components/SectionFilterBar';

export const JOB_FILTER_TYPES: FilterType[] = [
  { id: 'location', label: 'Địa điểm' },
  { id: 'salary', label: 'Mức lương' },
  { id: 'experience', label: 'Kinh nghiệm' },
  { id: 'category', label: 'Ngành nghề' },
];

export const SALARY_QUICK_OPTIONS: QuickFilterOption[] = [
  { label: 'Tất cả', value: 'all' },
  { label: 'Dưới 10 triệu', value: 'lt10' },
  { label: 'Từ 10-15 triệu', value: '10-15' },
  { label: 'Từ 15-20 triệu', value: '15-20' },
  { label: 'Từ 20-25 triệu', value: '20-25' },
  { label: 'Từ 25-30 triệu', value: '25-30' },
  { label: 'Trên 30 triệu', value: 'gt30' },
];

export const SALARY_PARAM_MAP: Record<string, { min?: number; max?: number }> = {
  all:   { min: undefined, max: undefined },
  lt10:  { min: undefined, max: 10_000_000 },
  '10-15': { min: 10_000_000, max: 15_000_000 },
  '15-20': { min: 15_000_000, max: 20_000_000 },
  '20-25': { min: 20_000_000, max: 25_000_000 },
  '25-30': { min: 25_000_000, max: 30_000_000 },
  gt30:  { min: 30_000_000, max: undefined },
};

export const EXPERIENCE_QUICK_OPTIONS: QuickFilterOption[] = [
  { label: 'Tất cả', value: 'all' },
  { label: 'Mới tốt nghiệp', value: 'fresher' },
  { label: 'Dưới 2 năm', value: 'junior' },
  { label: 'Từ 2-4 năm', value: 'mid' },
  { label: 'Trên 5 năm', value: 'senior' },
  { label: 'Quản lý', value: 'manager' },
];

export const EXPERIENCE_PARAM_MAP: Record<string, string | undefined> = {
  all: undefined,
  fresher: 'fresher',
  junior: 'junior',
  mid: 'mid',
  senior: 'senior',
  manager: 'manager',
};

export const LOCATION_QUICK_OPTIONS: QuickFilterOption[] = [
  { label: 'Tất cả', value: 'all' },
  { label: 'Hà Nội', value: 'hanoi' },
  { label: 'TP. Hồ Chí Minh', value: 'hcm' },
  { label: 'Đà Nẵng', value: 'danang' },
  { label: 'Miền Bắc', value: 'north' },
  { label: 'Miền Nam', value: 'south' },
  { label: 'Miền Trung', value: 'central' },
];
