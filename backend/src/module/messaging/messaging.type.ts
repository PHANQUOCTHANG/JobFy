import { Conversation, Message, User, Company, CandidateProfile, Jobs } from "@prisma/client";

export interface IConversation extends Conversation {
  company?: Company;
  candidate?: CandidateProfile & { user?: User };
  job?: Jobs;
  messages?: Message[];
}

export interface IMessage extends Message {
  sender?: User;
}

export type CreateConversationPayload = {
  companyId: string;
  candidateId: string;
  jobId?: string;
};

export type SendMessagePayload = {
  conversationId: string;
  senderId: string;
  content: string;
  attachmentUrl?: string;
};

export interface PaginationParams {
  page?: number;
  limit?: number;
}
