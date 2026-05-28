import React from 'react';
import { JobApplication } from '../types';
import { Card, CardContent } from '@/components/ui/card';
import { ApplicationStatusBadge } from './ApplicationStatusBadge';
import { Building2, MapPin, Calendar, Clock, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { Button } from '@/components/ui/button';

interface ApplicationCardProps {
  application: JobApplication;
}

export const ApplicationCard: React.FC<ApplicationCardProps> = ({ application }) => {
  const { job } = application;
  
  if (!job) return null;

  return (
    <Card className="hover:border-primary/50 transition-colors">
      <CardContent className="p-5 flex flex-col sm:flex-row gap-5 items-start sm:items-center">
        <div className="w-16 h-16 rounded bg-muted flex items-center justify-center flex-shrink-0 border overflow-hidden">
          {job.company?.logoUrl ? (
            <img src={job.company.logoUrl} alt={job.company.name} className="w-full h-full object-contain" />
          ) : (
            <Building2 className="w-8 h-8 text-muted-foreground" />
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <Link to={`/jobs/${job.slug}`} className="hover:text-primary transition-colors">
            <h3 className="font-semibold text-lg line-clamp-1">{job.title}</h3>
          </Link>
          <div className="text-sm text-muted-foreground mt-1 mb-3">{job.company?.name || 'Công ty ẩn danh'}</div>
          
          <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5" />
              <span>{job.address || 'Không xác định'}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              <span>Đã nộp: {format(new Date(application.appliedAt), 'dd/MM/yyyy HH:mm')}</span>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col items-start sm:items-end gap-3 mt-4 sm:mt-0 w-full sm:w-auto">
          <ApplicationStatusBadge status={application.status} />
          
          <Button variant="ghost" size="sm" className="w-full sm:w-auto" asChild>
            <Link to={`/jobs/${job.slug}`}>
              Xem chi tiết <ChevronRight className="w-4 h-4 ml-1" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
