import prisma from "@/config/prisma";
import { CreateConversationPayload, SendMessagePayload, PaginationParams } from "./messaging.type";

export class MessagingRepository {
  async findOrCreateConversation(data: CreateConversationPayload) {
    const existing = await prisma.conversation.findFirst({
      where: {
        companyId: data.companyId,
        candidateId: data.candidateId,
        jobId: data.jobId || null
      },
      include: {
        company: true,
        candidate: { include: { user: true } },
        job: true
      }
    });

    if (existing) return existing;

    return await prisma.conversation.create({
      data: {
        companyId: data.companyId,
        candidateId: data.candidateId,
        jobId: data.jobId || null
      },
      include: {
        company: true,
        candidate: { include: { user: true } },
        job: true
      }
    });
  }

  async getConversationsByUser(userId: string, isCompany: boolean, params: PaginationParams) {
    const page = params.page || 1;
    const limit = params.limit || 10;
    const skip = (page - 1) * limit;

    let whereClause: any = {};
    if (isCompany) {
      // Find companies owned by user or where user is member
      const companies = await prisma.company.findMany({
        where: { OR: [{ ownerId: userId }, { members: { some: { userId } } }] },
        select: { id: true }
      });
      const companyIds = companies.map(c => c.id);
      whereClause = { companyId: { in: companyIds }, isArchived: false };
    } else {
      const candidate = await prisma.candidateProfile.findUnique({ where: { userId } });
      if (!candidate) return { data: [], total: 0, page, limit, totalPages: 0 };
      whereClause = { candidateId: candidate.id, isArchived: false };
    }

    const [data, total] = await Promise.all([
      prisma.conversation.findMany({
        where: whereClause,
        include: {
          company: true,
          candidate: { include: { user: true } },
          job: true
        },
        orderBy: { lastMessageAt: "desc" },
        skip,
        take: limit
      }),
      prisma.conversation.count({ where: whereClause })
    ]);

    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async getConversationById(id: string) {
    return await prisma.conversation.findUnique({
      where: { id },
      include: {
        company: true,
        candidate: true
      }
    });
  }

  async getMessages(conversationId: string, params: PaginationParams) {
    const page = params.page || 1;
    const limit = params.limit || 20; // 20 messages per page
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      prisma.message.findMany({
        where: { conversationId },
        include: { sender: true },
        orderBy: { sentAt: "desc" }, // newest first
        skip,
        take: limit
      }),
      prisma.message.count({ where: { conversationId } })
    ]);

    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async sendMessage(data: SendMessagePayload) {
    return await prisma.$transaction(async (tx) => {
      const message = await tx.message.create({
        data,
        include: { sender: true }
      });

      await tx.conversation.update({
        where: { id: data.conversationId },
        data: {
          lastMessageAt: new Date(),
          lastMessage: data.content.substring(0, 500)
        }
      });

      return message;
    });
  }

  async markAsRead(conversationId: string, receiverId: string) {
    return await prisma.message.updateMany({
      where: {
        conversationId,
        senderId: { not: receiverId },
        status: { in: ["sent", "delivered"] }
      },
      data: {
        status: "read",
        readAt: new Date()
      }
    });
  }

  async archiveConversation(id: string) {
    return await prisma.conversation.update({
      where: { id },
      data: { isArchived: true }
    });
  }
}
