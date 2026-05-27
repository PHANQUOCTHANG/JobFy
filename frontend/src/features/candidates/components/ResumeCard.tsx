import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, Eye, Edit, Trash2, ExternalLink } from 'lucide-react';
import { Resume } from '../types';
import { format } from 'date-fns';

interface ResumeCardProps {
  resume: Resume;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  isPublicView?: boolean;
}

export const ResumeCard: React.FC<ResumeCardProps> = ({ 
  resume, 
  onEdit, 
  onDelete,
  isPublicView = false 
}) => {
  return (
    <Card className={`relative overflow-hidden ${resume.isPrimary && !isPublicView ? 'border-primary shadow-sm' : ''}`}>
      {resume.isPrimary && !isPublicView && (
        <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs px-2 py-1 rounded-bl-lg font-medium">
          CV Chính
        </div>
      )}
      
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-start gap-3">
          <div className="bg-muted p-2 rounded-md">
            <FileText className="w-5 h-5 text-primary" />
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="truncate font-semibold">{resume.title}</p>
            <p className="text-xs text-muted-foreground font-normal mt-1">
              Cập nhật lần cuối: {format(new Date(resume.updatedAt), 'dd/MM/yyyy')}
            </p>
          </div>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="pb-4">
        <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Eye className="w-4 h-4" />
            <span>{resume.viewCount} lượt xem</span>
          </div>
          {resume.isPublic ? (
            <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">Công khai</Badge>
          ) : (
            <Badge variant="outline" className="text-muted-foreground">Riêng tư</Badge>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="pt-0 flex justify-between gap-2 border-t mt-4 p-4">
        {isPublicView ? (
          <Button variant="default" className="w-full" onClick={() => window.open(resume.fileUrl, '_blank')}>
            <ExternalLink className="w-4 h-4 mr-2" />
            Xem chi tiết
          </Button>
        ) : (
          <>
            <Button variant="outline" size="sm" className="flex-1" onClick={() => onEdit?.(resume.id)}>
              <Edit className="w-4 h-4 mr-1" />
              Sửa
            </Button>
            <Button variant="outline" size="sm" className="text-destructive hover:bg-destructive/10" onClick={() => onDelete?.(resume.id)}>
              <Trash2 className="w-4 h-4" />
            </Button>
          </>
        )}
      </CardFooter>
    </Card>
  );
};
