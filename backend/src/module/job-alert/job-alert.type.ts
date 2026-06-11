import { JobAlert } from "@prisma/client";

export interface IJobAlert extends JobAlert {}

export type CreateJobAlertPayload = {
  candidateId: string;
  name?: string;
  filters: any;
  frequency?: string;
};

export type UpdateJobAlertPayload = {
  name?: string;
  filters?: any;
  frequency?: string;
  isActive?: boolean;
};

export interface PaginationParams {
  page?: number;
  limit?: number;
}
