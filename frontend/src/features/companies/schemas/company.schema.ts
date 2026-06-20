import * as z from 'zod';

export const companyProfileSchema = z.object({
  name: z.string().min(2, 'Tên công ty phải có ít nhất 2 ký tự').max(100, 'Tên công ty quá dài'),
  taxCode: z.string().optional(),
  website: z.string().url('URL không hợp lệ').optional().or(z.literal('')),
  foundedYear: z.coerce.number().min(1800, 'Năm thành lập không hợp lệ').max(new Date().getFullYear(), 'Năm thành lập không thể ở tương lai').optional().or(z.literal('')),
  size: z.enum(['1_10', '11_50', '51_200', '201_500', '501_1000', '1001_5000', '5000_plus']).optional(),
  industryId: z.coerce.number().optional().or(z.literal('')),
  description: z.string().optional(),
  shortDescription: z.string().max(255, 'Mô tả ngắn tối đa 255 ký tự').optional(),
  provinceId: z.coerce.number().optional().or(z.literal('')),
  districtId: z.coerce.number().optional().or(z.literal('')),
  address: z.string().optional(),
  facebookUrl: z.string().url('URL không hợp lệ').optional().or(z.literal('')),
  linkedinUrl: z.string().url('URL không hợp lệ').optional().or(z.literal('')),
  logoUrl: z.string().url('URL không hợp lệ').optional().or(z.literal('')),
  coverUrl: z.string().url('URL không hợp lệ').optional().or(z.literal('')),
});

export type CompanyProfileInput = z.infer<typeof companyProfileSchema>;
