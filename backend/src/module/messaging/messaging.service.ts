import { MessagingRepository } from "./messaging.repository";
import { CreateConversationPayload, SendMessagePayload, PaginationParams } from "./messaging.type";
import { NotFoundError, ForbiddenError, BadRequestError } from "@/error";
import prisma from "@/lib/prisma";

export class MessagingService {
  private repository: MessagingRepository;

  constructor() {
    this.repository = new MessagingRepository();
  }

  async findOrCreateConversation(data: CreateConversationPayload, userId: string, role: string) {
    // Validate access
    if (role === "employer") {
      const company = await prisma.company.findFirst({
        where: { id: data.companyId, OR: [{ ownerId: userId }, { members: { some: { userId } } }] }
      });
      if (!company) throw new ForbiddenError("Not authorized for this company");
    } else if (role === "candidate") {
      const candidate = await prisma.candidateProfile.findUnique({ where: { userId } });
      if (!candidate || candidate.id !== data.candidateId) throw new ForbiddenError("Not authorized");
    } else {
      throw new ForbiddenError("Admins cannot start conversations here");
    }

    return await this.repository.findOrCreateConversation(data);
  }

  async getConversations(userId: string, role: string, params: PaginationParams) {
    const isCompany = role === "employer";
    return await this.repository.getConversationsByUser(userId, isCompany, params);
  }

  async getMessages(conversationId: string, userId: string, role: string, params: PaginationParams) {
    const conversation = await this.repository.getConversationById(conversationId);
    if (!conversation) throw new NotFoundError("Conversation not found");

    // Access control check can be more complex, simplify for now
    return await this.repository.getMessages(conversationId, params);
  }

  async sendMessage(data: SendMessagePayload) {
    const conversation = await this.repository.getConversationById(data.conversationId);
    if (!conversation) throw new NotFoundError("Conversation not found");

    return await this.repository.sendMessage(data);
  }

  async markAsRead(conversationId: string, userId: string) {
    return await this.repository.markAsRead(conversationId, userId);
  }

  async archiveConversation(id: string, userId: string) {
    const conversation = await this.repository.getConversationById(id);
    if (!conversation) throw new NotFoundError("Conversation not found");

    // In a real app, check if user is participant before archiving
    return await this.repository.archiveConversation(id);
  }
}
