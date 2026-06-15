import { PrismaClient } from "@prisma/client";
import { getCache, setCache } from "@/utils/cache";
import prisma from "@/lib/prisma";

export class LocationService {
  private readonly CACHE_KEY_PROVINCES = "provinces:list";
  private readonly CACHE_TTL = 86400; // 1 day

  constructor(private readonly db: PrismaClient) {}

  async getAllProvinces() {
    const cached = await getCache<any>(this.CACHE_KEY_PROVINCES);
    if (cached) return cached;

    const provinces = await this.db.province.findMany({
      orderBy: { name: "asc" }
    });

    await setCache(this.CACHE_KEY_PROVINCES, provinces, this.CACHE_TTL);
    return provinces;
  }
}

export const locationService = new LocationService(prisma);
