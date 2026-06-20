import { PrismaClient } from "@prisma/client";

export class LocationService {
  constructor(private readonly prisma: PrismaClient) {}

  /**
   * Lấy danh sách ngành nghề
   */
  async getIndustries() {
    return this.prisma.industry.findMany({
      orderBy: { name: 'asc' }
    });
  }

  /**
   * Lấy danh sách tỉnh thành
   */
  async getProvinces() {
    return this.prisma.province.findMany({
      orderBy: { name: 'asc' }
    });
  }

  /**
   * Lấy danh sách quận huyện theo tỉnh
   */
  async getDistricts(provinceId: number) {
    return this.prisma.district.findMany({
      where: { provinceId },
      orderBy: { name: 'asc' }
    });
  }
}

// Khởi tạo service và export để sử dụng
const prisma = new PrismaClient();
export const locationService = new LocationService(prisma);