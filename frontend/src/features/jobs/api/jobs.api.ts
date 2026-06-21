import api from "@/lib/axios";
import { Job, JobCategory, JobFilterParams } from "../types";
import { mockJobs } from "./mockData";

export const getJobs = async (
  params?: JobFilterParams,
// eslint-disable-next-line @typescript-eslint/no-explicit-any
): Promise<{ data: Job[]; meta: any }> => {
  // Build apiParams outside try so it's accessible in catch
  const apiParams = { ...params };
  if (apiParams.keyword) {
    apiParams.search = apiParams.keyword;
    delete apiParams.keyword;
  }
  if (apiParams.categorySlug) {
    delete apiParams.categoryId;
  }

  try {
    const response = await api.get("/jobs", { params: apiParams });
    return {
      data: response.data?.data || response.data,
      meta: response.data?.meta || {},
    };
  // eslint-disable-next-line unused-imports/no-unused-vars
  } catch (error) {
    let filteredJobs = [...mockJobs];

    if (apiParams.provinceId) {
      filteredJobs = filteredJobs.filter(job => job.provinceId === apiParams.provinceId);
    }
    if (apiParams.districtIds) {
      const selectedDistrictIds = apiParams.districtIds.split(',').map(Number);
      filteredJobs = filteredJobs.filter(job => job.districtId && selectedDistrictIds.includes(job.districtId));
    }
    if (apiParams.salaryMin !== undefined) {
      filteredJobs = filteredJobs.filter(job => job.salaryMin != null && job.salaryMin >= apiParams.salaryMin!);
    }
    if (apiParams.salaryMax !== undefined) {
      filteredJobs = filteredJobs.filter(job => job.salaryMax != null && job.salaryMax <= apiParams.salaryMax!);
    }
    if (apiParams.experienceLevel) {
      if (apiParams.experienceLevel === 'fresher') {
        filteredJobs = filteredJobs.filter(job => job.experienceLevel === 'fresher');
      } else if (apiParams.experienceLevel === 'senior') {
        filteredJobs = filteredJobs.filter(job => job.experienceLevel === 'senior');
      } else if (apiParams.experienceLevel === 'mid') {
        filteredJobs = filteredJobs.filter(job => job.experienceLevel === 'mid');
      }
    }
    if (apiParams.categorySlug) {
      const slugToId: Record<string, number> = {
        it: 1, marketing: 2, design: 3, education: 4,
        healthcare: 5, 'customer-service': 6, sales: 7, finance: 8,
      };
      const targetId = slugToId[apiParams.categorySlug];
      if (targetId) {
        filteredJobs = filteredJobs.filter(job => job.categoryId === targetId);
      }
    }

    return {
      data: filteredJobs.slice(0, params?.limit || 9),
      meta: {
        total: filteredJobs.length,
        page: params?.page || 1,
        limit: params?.limit || 10,
        totalPages: Math.ceil(filteredJobs.length / (params?.limit || 10)) || 1,
      },
    };
  }
};

export const getFeaturedJobs = async (): Promise<{ data: Job[] }> => {
  try {
    const response = await api.get("/jobs", {
      params: { limit: 9, status: "published" },
    });
    return { data: response.data?.data || response.data };
  // eslint-disable-next-line unused-imports/no-unused-vars
  } catch (error) {
    return { data: mockJobs.slice(0, 9) };
  }
};

export const getJobBySlug = async (slug: string): Promise<Job> => {
  try {
    const response = await api.get(`/jobs/${slug}`);
    return response.data?.data || response.data;
  } catch (error) {
    const mock = mockJobs.find((j) => j.slug === slug || j.id === slug);
    if (mock) return mock;
    throw error;
  }
};

export const getJobCategories = async (): Promise<JobCategory[]> => {
  try {
    const response = await api.get("/job-categories");
    return response.data?.data || response.data;
  // eslint-disable-next-line unused-imports/no-unused-vars
  } catch (error) {
    return [
      { id: 1, name: "Công nghệ thông tin", slug: "it", isActive: true },
      {
        id: 2,
        name: "Marketing & Truyền thông",
        slug: "marketing",
        isActive: true,
      },
      { id: 3, name: "Thiết kế & Sáng tạo", slug: "design", isActive: true },
      { id: 4, name: "Giáo dục & Đào tạo", slug: "education", isActive: true },
      { id: 5, name: "Chăm sóc sức khỏe", slug: "healthcare", isActive: true },
      {
        id: 6,
        name: "Dịch vụ khách hàng",
        slug: "customer-service",
        isActive: true,
      },
      { id: 7, name: "Kinh doanh & Bán hàng", slug: "sales", isActive: true },
      { id: 8, name: "Tài chính & Kế toán", slug: "finance", isActive: true },
    ] as JobCategory[];
  }
};

export const saveJob = async (jobId: string): Promise<void> => {
  await api.post(`/jobs/${jobId}/save`);
};

export const unsaveJob = async (jobId: string): Promise<void> => {
  await api.delete(`/jobs/${jobId}/save`);
};

export const getProvinces = async (): Promise<
  { id: number; name: string }[]
> => {
  try {
    const response = await api.get("/locations/provinces");
    const data = response.data?.data || response.data;
    if (Array.isArray(data) && data.length > 0) return data;
    throw new Error("Empty response");
  } catch {
    return [
      { id: 1,  name: "Hà Nội" },
      { id: 2,  name: "Hồ Chí Minh" },
      { id: 3,  name: "Đà Nẵng" },
      { id: 4,  name: "Hải Phòng" },
      { id: 5,  name: "Cần Thơ" },
      { id: 6,  name: "An Giang" },
      { id: 7,  name: "Bà Rịa - Vũng Tàu" },
      { id: 8,  name: "Bắc Giang" },
      { id: 9,  name: "Bắc Kạn" },
      { id: 10, name: "Bạc Liêu" },
      { id: 11, name: "Bắc Ninh" },
      { id: 12, name: "Bến Tre" },
      { id: 13, name: "Bình Định" },
      { id: 14, name: "Bình Dương" },
      { id: 15, name: "Bình Phước" },
      { id: 16, name: "Bình Thuận" },
      { id: 17, name: "Cà Mau" },
      { id: 18, name: "Cao Bằng" },
      { id: 19, name: "Đắk Lắk" },
      { id: 20, name: "Đắk Nông" },
      { id: 21, name: "Điện Biên" },
      { id: 22, name: "Đồng Nai" },
      { id: 23, name: "Đồng Tháp" },
      { id: 24, name: "Gia Lai" },
      { id: 25, name: "Hà Giang" },
      { id: 26, name: "Hà Nam" },
      { id: 27, name: "Hà Tĩnh" },
      { id: 28, name: "Hải Dương" },
      { id: 29, name: "Hậu Giang" },
      { id: 30, name: "Hòa Bình" },
      { id: 31, name: "Hưng Yên" },
      { id: 32, name: "Khánh Hòa" },
      { id: 33, name: "Kiên Giang" },
      { id: 34, name: "Kon Tum" },
      { id: 35, name: "Lai Châu" },
      { id: 36, name: "Lâm Đồng" },
      { id: 37, name: "Lạng Sơn" },
      { id: 38, name: "Lào Cai" },
      { id: 39, name: "Long An" },
      { id: 40, name: "Nam Định" },
      { id: 41, name: "Nghệ An" },
      { id: 42, name: "Ninh Bình" },
      { id: 43, name: "Ninh Thuận" },
      { id: 44, name: "Phú Thọ" },
      { id: 45, name: "Phú Yên" },
      { id: 46, name: "Quảng Bình" },
      { id: 47, name: "Quảng Nam" },
      { id: 48, name: "Quảng Ngãi" },
      { id: 49, name: "Quảng Ninh" },
      { id: 50, name: "Quảng Trị" },
      { id: 51, name: "Sóc Trăng" },
      { id: 52, name: "Sơn La" },
      { id: 53, name: "Tây Ninh" },
      { id: 54, name: "Thái Bình" },
      { id: 55, name: "Thái Nguyên" },
      { id: 56, name: "Thanh Hóa" },
      { id: 57, name: "Thừa Thiên Huế" },
      { id: 58, name: "Tiền Giang" },
      { id: 59, name: "Trà Vinh" },
      { id: 60, name: "Tuyên Quang" },
      { id: 61, name: "Vĩnh Long" },
      { id: 62, name: "Vĩnh Phúc" },
      { id: 63, name: "Yên Bái" },
    ];
  }
};

export const getIndustries = async (): Promise<{ id: number; name: string; slug: string }[]> => {
  try {
    const response = await api.get("/industries");
    const data = response.data?.data || response.data;
    if (Array.isArray(data) && data.length > 0) return data;
    throw new Error("Empty response");
  } catch {
    return [
      { id: 1, name: "Công nghệ thông tin", slug: "it" },
      { id: 2, name: "Marketing & Truyền thông", slug: "marketing" },
      { id: 3, name: "Bất động sản", slug: "real-estate" },
      { id: 4, name: "Giáo dục", slug: "education" },
    ];
  }
};

export const getDistricts = async (provinceId: number): Promise<{ id: number; provinceId: number; name: string }[]> => {
  try {
    const response = await api.get(`/locations/provinces/${provinceId}/districts`);
    const data = response.data?.data || response.data;
    if (Array.isArray(data) && data.length > 0) return data;
    throw new Error("Empty response");
  } catch {
    const mockDistricts: Record<number, { id: number; provinceId: number; name: string }[]> = {
      1: [ // Hà Nội
        { id: 101, provinceId: 1, name: "Quận Ba Đình" },
        { id: 102, provinceId: 1, name: "Quận Hoàn Kiếm" },
        { id: 103, provinceId: 1, name: "Quận Tây Hồ" },
        { id: 104, provinceId: 1, name: "Quận Long Biên" },
        { id: 105, provinceId: 1, name: "Quận Cầu Giấy" },
        { id: 106, provinceId: 1, name: "Quận Đống Đa" },
        { id: 107, provinceId: 1, name: "Quận Hai Bà Trưng" },
        { id: 108, provinceId: 1, name: "Quận Hoàng Mai" },
        { id: 109, provinceId: 1, name: "Quận Thanh Xuân" },
        { id: 110, provinceId: 1, name: "Quận Nam Từ Liêm" },
      ],
      2: [ // Hồ Chí Minh
        { id: 201, provinceId: 2, name: "Quận 1" },
        { id: 202, provinceId: 2, name: "Quận 3" },
        { id: 203, provinceId: 2, name: "Quận 4" },
        { id: 204, provinceId: 2, name: "Quận 5" },
        { id: 205, provinceId: 2, name: "Quận 6" },
        { id: 206, provinceId: 2, name: "Quận 7" },
        { id: 207, provinceId: 2, name: "Quận 8" },
        { id: 208, provinceId: 2, name: "Quận 10" },
        { id: 209, provinceId: 2, name: "Quận 11" },
        { id: 210, provinceId: 2, name: "Quận Tân Bình" },
      ],
      33: [ // Kiên Giang
        { id: 3301, provinceId: 33, name: "Thành phố Rạch Giá" },
        { id: 3302, provinceId: 33, name: "Thành phố Hà Tiên" },
        { id: 3303, provinceId: 33, name: "Thành phố Phú Quốc" },
        { id: 3304, provinceId: 33, name: "Huyện Kiên Lương" },
        { id: 3305, provinceId: 33, name: "Huyện Hòn Đất" },
        { id: 3306, provinceId: 33, name: "Huyện Tân Hiệp" },
        { id: 3307, provinceId: 33, name: "Huyện Châu Thành" },
        { id: 3308, provinceId: 33, name: "Huyện Giồng Riềng" },
        { id: 3309, provinceId: 33, name: "Huyện Gò Quao" },
        { id: 3310, provinceId: 33, name: "Huyện An Biên" },
      ],
      3: [ // Đà Nẵng
        { id: 301, provinceId: 3, name: "Quận Hải Châu" },
        { id: 302, provinceId: 3, name: "Quận Thanh Khê" },
        { id: 303, provinceId: 3, name: "Quận Sơn Trà" },
        { id: 304, provinceId: 3, name: "Quận Ngũ Hành Sơn" },
        { id: 305, provinceId: 3, name: "Quận Liên Chiểu" },
        { id: 306, provinceId: 3, name: "Quận Cẩm Lệ" },
        { id: 307, provinceId: 3, name: "Huyện Hòa Vang" },
      ]
    };
    
    // Default mock districts for other provinces
    const genericDistricts = [
      { id: provinceId * 100 + 1, provinceId, name: "Huyện 1" },
      { id: provinceId * 100 + 2, provinceId, name: "Huyện 2" },
      { id: provinceId * 100 + 3, provinceId, name: "Huyện 3" },
      { id: provinceId * 100 + 4, provinceId, name: "Huyện 4" },
    ];
    
    return mockDistricts[provinceId] || genericDistricts;
  }
};
