import { createClient } from "redis";

const redisUrl = process.env.REDIS_URL || "redis://localhost:6379";
const isSecure = redisUrl.startsWith("rediss://");

const redisClient = createClient({
  url: redisUrl,
  socket: {
    tls: isSecure ? true : undefined,
    reconnectStrategy: (retries: number, cause: Error) => {
      if (cause?.message?.includes("max requests limit exceeded")) {
        return new Error("Upstash max requests limit exceeded. Stopping reconnect.");
      }
      if (cause?.message?.includes("ENOTFOUND") || cause?.message?.includes("getaddrinfo")) {
        return new Error("Bỏ qua kết nối Redis do không tìm thấy host (có thể do Upstash bị xoá hoặc giới hạn token).");
      }
      if (retries > 5) {
        return new Error("Thử kết nối Redis quá 5 lần. Ngừng kết nối.");
      }
      // Trì hoãn reconnect theo số lần thử (tối đa 3 giây)
      return Math.min(retries * 50, 3000);
    },
  },
});

let lastLoggedErrorTime = 0;

redisClient.on("error", (err) => {
  const isLimitError = err?.message?.includes("max requests limit exceeded") || err?.message?.includes("ENOTFOUND");
  if (isLimitError) {
    const now = Date.now();
    // Phạt Upstash limit, chỉ log 1 lần mỗi 5 phút (300000ms) để chống spam văng console
    if (now - lastLoggedErrorTime > 300000) {
      console.error("[Redis Issue] Upstash gặp sự cố (hết token hoặc bị khoá), đang tự động chuyển sang chế độ KHÔNG DÙNG REDIS...");
      lastLoggedErrorTime = now;
    }
  } else {
    const now = Date.now();
    if (now - lastLoggedErrorTime > 60000) {
      console.error("Redis error:", err.message || err);
      lastLoggedErrorTime = now;
    }
  }
});

export const connectRedis = async () => {
  try {
    await redisClient.connect();
    console.log("Redis connected");
  } catch (error) {
    console.error("Redis initial connection failed. Running backend without cache.");
  }
};

export default redisClient;