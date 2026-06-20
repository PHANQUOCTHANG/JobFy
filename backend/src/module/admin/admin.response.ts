import { IAdminLog } from "./admin.type";

export const toAdminLogResponse = (log: IAdminLog) => {
  return {
    id: log.id.toString(), // Convert BigInt to string
    adminId: log.adminId,
    action: log.action,
    targetType: log.targetType,
    targetId: log.targetId,
    oldValue: log.oldValue,
    newValue: log.newValue,
    ipAddress: log.ipAddress,
    createdAt: log.createdAt,
    admin: log.admin ? {
      id: log.admin.id,
      email: log.admin.email,
    } : undefined
  };
};

export const toAdminLogListResponse = (logs: IAdminLog[]) => {
  return logs.map(toAdminLogResponse);
};
