import { IJobAlert } from "./job-alert.type";

export const toJobAlertResponse = (alert: IJobAlert) => {
  return {
    id: alert.id,
    candidateId: alert.candidateId,
    name: alert.name,
    filters: alert.filters,
    frequency: alert.frequency,
    isActive: alert.isActive,
    lastSentAt: alert.lastSentAt,
    createdAt: alert.createdAt,
    updatedAt: alert.updatedAt,
  };
};

export const toJobAlertListResponse = (alerts: IJobAlert[]) => {
  return alerts.map(toJobAlertResponse);
};
