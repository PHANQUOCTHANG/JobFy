import React from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, DollarSign, Clock, Building2, BookmarkPlus } from 'lucide-react';
import { Job } from '../types';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';

interface JobCardProps {
  job: Job;
  onSave?: (id: string) => void;
}

export const JobCard: React.FC<JobCardProps> = ({ job, onSave }) => {
  return (
    <Card className="hover:shadow-md transition-all hover:border-primary/50 flex flex-col h-full">
      <CardContent className="p-5 flex-grow">
        <div className="flex gap-4">
          <div className="w-16 h-16 rounded-md bg-muted flex items-center justify-center flex-shrink-0 border p-1 overflow-hidden">
            {job.company?.logoUrl ? (
              <img src={job.company.logoUrl} alt={job.company.name} className="w-full h-full object-contain" />
            ) : (
              <Building2 className="w-8 h-8 text-muted-foreground" />
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <Link to={`/jobs/${job.slug}`} className="hover:text-primary transition-colors">
              <h3 className="font-semibold text-lg line-clamp-2 leading-tight">{job.title}</h3>
            </Link>
            
            <Link to={job.company?.slug ? `/companies/${job.company.slug}` : '#'} className="text-sm text-muted-foreground hover:text-primary mt-1 line-clamp-1 block">
              {job.company?.name || 'Công ty ẩn danh'}
            </Link>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-3 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <DollarSign className="w-4 h-4 text-green-600" />
            <span className="font-medium text-foreground">
              {job.isSalaryPublic ? (
                job.salaryMin && job.salaryMax 
                  ? `${job.salaryMin} - ${job.salaryMax} ${job.salaryCurrency}`
                  : (job.salaryMin ? `Từ ${job.salaryMin} ${job.salaryCurrency}` : 'Thỏa thuận')
              ) : 'Thương lượng'}
            </span>
          </div>
          
          <div className="flex items-center gap-1">
            <MapPin className="w-4 h-4" />
            <span className="line-clamp-1">{job.address || 'Không xác định'}</span>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {job.experienceLevel && (
            <Badge variant="secondary" className="font-normal capitalize">
              {job.experienceLevel.replace('_', ' ')}
            </Badge>
          )}
          {job.isRemote && (
            <Badge variant="outline" className="font-normal border-blue-200 text-blue-600 bg-blue-50">
              Làm việc từ xa
            </Badge>
          )}
        </div>
      </CardContent>

      <CardFooter className="p-5 pt-0 flex justify-between items-center border-t border-border/40 mt-auto pt-4 relative top-4">
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Clock className="w-3.5 h-3.5" />
          <span>
            {job.publishedAt 
              ? formatDistanceToNow(new Date(job.publishedAt), { addSuffix: true, locale: vi })
              : 'Gần đây'
            }
          </span>
        </div>
        
        <div className="flex gap-2">
          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" onClick={() => onSave?.(job.id)}>
            <BookmarkPlus className="w-4 h-4" />
            <span className="sr-only">Lưu tin</span>
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};
