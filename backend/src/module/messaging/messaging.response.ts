import { IConversation, IMessage } from "./messaging.type";

export const toConversationResponse = (conversation: IConversation) => {
  return {
    id: conversation.id,
    jobId: conversation.jobId,
    companyId: conversation.companyId,
    candidateId: conversation.candidateId,
    lastMessageAt: conversation.lastMessageAt,
    lastMessage: conversation.lastMessage,
    isArchived: conversation.isArchived,
    createdAt: conversation.createdAt,
    company: conversation.company ? {
      id: conversation.company.id,
      name: conversation.company.name,
      logoUrl: conversation.company.logoUrl,
    } : undefined,
    candidate: conversation.candidate ? {
      id: conversation.candidate.id,
      fullName: conversation.candidate.fullName,
      avatarUrl: conversation.candidate.user?.avatarUrl,
    } : undefined,
    job: conversation.job != null ? {
      id: conversation.job.id,
      title: conversation.job.title,
    } : undefined
  };
};

export const toMessageResponse = (message: IMessage) => {
  return {
    id: message.id,
    conversationId: message.conversationId,
    senderId: message.senderId,
    content: message.content,
    status: message.status,
    attachmentUrl: message.attachmentUrl,
    isDeleted: message.isDeleted,
    sentAt: message.sentAt,
    readAt: message.readAt,
    sender: message.sender ? {
      id: message.sender.id,
      email: message.sender.email,
      avatarUrl: message.sender.avatarUrl,
    } : undefined
  };
};

export const toConversationListResponse = (conversations: IConversation[]) => {
  return conversations.map(toConversationResponse);
};

export const toMessageListResponse = (messages: IMessage[]) => {
  return messages.map(toMessageResponse);
};
