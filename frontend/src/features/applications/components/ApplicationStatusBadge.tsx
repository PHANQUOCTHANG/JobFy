import React from 'react';
import { Badge } from '@/components/ui/badge';
import { ApplicationStatus } from '../types';

interface ApplicationStatusBadgeProps {
  status: ApplicationStatus;
}

const statusConfig: Record<ApplicationStatus, { label: string; className: string }> = {
  pending: {
    label: 'Chờ xử lý',
    className: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100 border-yellow-200',
  },
  reviewing: {
    label: 'Đang xem xét',
    className: 'bg-blue-100 text-blue-800 hover:bg-blue-100 border-blue-200',
  },
  interviewed: {
    label: 'Đã phỏng vấn',
    className: 'bg-purple-100 text-purple-800 hover:bg-purple-100 border-purple-200',
  },
  offered: {
    label: 'Đã có Offer',
    className: 'bg-green-100 text-green-800 hover:bg-green-100 border-green-200',
  },
  hired: {
    label: 'Đã trúng tuyển',
    className: 'bg-emerald-100 text-emerald-800 hover:bg-emerald-100 border-emerald-200',
  },
  rejected: {
    label: 'Bị từ chối',
    className: 'bg-red-100 text-red-800 hover:bg-red-100 border-red-200',
  },
};

export const ApplicationStatusBadge: React.FC<ApplicationStatusBadgeProps> = ({ status }) => {
  const config = statusConfig[status] || statusConfig.pending;
  
  return (
    <Badge variant="outline" className={`font-medium ${config.className}`}>
      {config.label}
    </Badge>
  );
};
