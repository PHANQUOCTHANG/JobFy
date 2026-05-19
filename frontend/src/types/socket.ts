// ─────────────────────────────────────────────────────────────────────────────
// 1. SERVER TO CLIENT EVENTS (Server nói - Client nghe)
// ─────────────────────────────────────────────────────────────────────────────
export interface ServerToClientEvents {
  // Connection Trạng thái
  connect: () => void;
  disconnect: () => void;
  // Các thông báo lỗi hệ thống (nếu có)
  socket_error: (error: { message: string; code?: string }) => void;
}

// ─────────────────────────────────────────────────────────────────────────────
// 2. CLIENT TO SERVER EVENTS (Client nói - Server nghe)
// ─────────────────────────────────────────────────────────────────────────────
export interface ClientToServerEvents {
  // Gia nhập phòng riêng (Thường tự động dựa trên userId khi connect)
  join_room: (roomName: string) => void;
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. SOCKET DATA (Dành cho Backend - socket.data)
// Dùng để lưu trữ thông tin tạm thời trên instance của socket đó
// ─────────────────────────────────────────────────────────────────────────────
export interface InterServerEvents {
  ping: () => void;
}

export interface SocketData {
  userId: string;
  ip: string;
}
