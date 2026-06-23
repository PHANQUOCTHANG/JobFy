import { Request, Response, NextFunction } from "express";
import { getCache, setCache } from "@/utils/cache";
import AppError from "@/utils/appError";

const RATE_LIMIT_MAX = Number(process.env.AI_RATE_LIMIT_PER_MINUTE) || 10;
const RATE_LIMIT_WINDOW = 60; // 1 minute in seconds

export const aiRateLimiter = async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.user?.userId;
  if (!userId) return next(new AppError("Unauthorized", 401));

  // Determine specific feature endpoint
  const endpoint = req.path.split('/').pop() || 'general';
  const cacheKey = `ai:ratelimit:${userId}:${endpoint}`;

  try {
    const currentCount = await getCache<number>(cacheKey) || 0;

    if (currentCount >= RATE_LIMIT_MAX) {
      return next(new AppError("Bạn đã sử dụng quá giới hạn yêu cầu AI. Vui lòng thử lại sau 1 phút.", 429));
    }

    // Increment cache. In a real Redis setup, we'd use INCR and EXPIRE.
    // For this mock implementation with getCache/setCache:
    await setCache(cacheKey, currentCount + 1, RATE_LIMIT_WINDOW);

    next();
  } catch (error) {
    next(error);
  }
};
