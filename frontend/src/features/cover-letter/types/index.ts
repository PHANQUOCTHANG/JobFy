export interface CoverLetter {
  id: string;
  userId: string;
  jobId?: string;
  title: string;
  content: string;
  isAiGenerated: boolean;
  createdAt: string;
  updatedAt: string;
  job?: {
    id: string;
    title: string;
    company: {
      name: string;
      logoUrl: string;
    };
  };
}

export interface CreateCoverLetterDto {
  title: string;
  content: string;
  jobId?: string;
  isAiGenerated?: boolean;
}

export interface UpdateCoverLetterDto {
  title?: string;
  content?: string;
}
