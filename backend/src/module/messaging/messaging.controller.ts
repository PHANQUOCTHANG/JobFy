import { Request, Response } from "express";
import { MessagingService } from "./messaging.service";
import { sendResponse } from "@/utils/sendResponse";
import { catchAsync } from "@/utils/catchAsync";
import { toConversationListResponse, toConversationResponse, toMessageListResponse, toMessageResponse } from "./messaging.response";

const messagingService = new MessagingService();

export const getConversations = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  const role = req.user?.role;
  if (!userId || !role) return res.status(401).json({ message: "Unauthorized" });

  const { page, limit } = req.query;
  const result = await messagingService.getConversations(userId, role, {
    page: page ? Number(page) : undefined,
    limit: limit ? Number(limit) : undefined
  });

  sendResponse(res, 200, "Success", {
    data: toConversationListResponse(result.data),
    meta: {
      total: result.total,
      page: result.page,
      limit: result.limit,
      totalPages: result.totalPages
    }
  });
});

export const createConversation = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  const role = req.user?.role;
  if (!userId || !role) return res.status(401).json({ message: "Unauthorized" });

  const conversation = await messagingService.findOrCreateConversation(req.body, userId, role);
  sendResponse(res, 201, "Conversation ready", toConversationResponse(conversation));
});

export const getMessages = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  const role = req.user?.role;
  if (!userId || !role) return res.status(401).json({ message: "Unauthorized" });

  const { id } = req.params;
  const { page, limit } = req.query;
  const result = await messagingService.getMessages(id as string, userId, role, {
    page: page ? Number(page) : undefined,
    limit: limit ? Number(limit) : undefined
  });

  sendResponse(res, 200, "Success", {
    data: toMessageListResponse(result.data),
    meta: {
      total: result.total,
      page: result.page,
      limit: result.limit,
      totalPages: result.totalPages
    }
  });
});

export const sendMessage = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  if (!userId) return res.status(401).json({ message: "Unauthorized" });

  const { id } = req.params;
  const message = await messagingService.sendMessage({
    conversationId: id,
    senderId: userId,
    ...req.body
  });
  sendResponse(res, 201, "Message sent", toMessageResponse(message));
});

export const markAsRead = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  if (!userId) return res.status(401).json({ message: "Unauthorized" });

  const { id } = req.params;
  await messagingService.markAsRead(id as string, userId);
  sendResponse(res, 200, "Messages marked as read");
});

export const archiveConversation = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  if (!userId) return res.status(401).json({ message: "Unauthorized" });

  const { id } = req.params;
  await messagingService.archiveConversation(id as string, userId);
  sendResponse(res, 200, "Conversation archived");
});
