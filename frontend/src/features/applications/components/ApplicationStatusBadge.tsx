import React from 'react';
import { Badge } from '@/components/ui/badge';
import { ApplicationStatus } from '../types';

interface ApplicationStatusBadgeProps {
  status: ApplicationStatus;
}

const statusConfig: Record<ApplicationStatus, { label: string; className: string }> = {
  pending: {
    label: 'Tiếp nhận',
    className: 'bg-slate-100 text-slate-500 border-slate-200',
  },
  reviewing: {
    label: 'Đã xem',
    className: 'bg-blue-50 text-blue-600 border-blue-200',
  },
  shortlisted: {
    label: 'Duyệt hồ sơ',
    className: 'bg-indigo-50 text-indigo-600 border-indigo-200',
  },
  interviewed: {
    label: 'Cân nhắc',
    className: 'bg-purple-50 text-purple-600 border-purple-200',
  },
  offered: {
    label: 'Đề nghị nhận việc',
    className: 'bg-emerald-50 text-emerald-600 border-emerald-200',
  },
  accepted: {
    label: 'Phù hợp',
    className: 'bg-emerald-50 text-emerald-600 border-emerald-200',
  },
  rejected: {
    label: 'Chưa phù hợp',
    className: 'bg-red-50 text-red-600 border-red-200',
  },
  withdrawn: {
    label: 'Đã rút hồ sơ',
    className: 'bg-gray-100 text-gray-600 border-gray-200',
  },
};

export const ApplicationStatusBadge: React.FC<ApplicationStatusBadgeProps> = ({ status }) => {
  const config = statusConfig[status] || statusConfig.pending;
  
  return (
    <Badge variant="outline" className={`font-medium px-2 py-0.5 rounded shadow-none ${config.className}`}>
      Độ phù hợp: {config.label}
    </Badge>
  );
};
