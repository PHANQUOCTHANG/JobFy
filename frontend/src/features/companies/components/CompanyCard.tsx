import React from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Building2, MapPin, Star } from 'lucide-react';
import { Company } from '../types';
import { Link } from 'react-router-dom';

interface CompanyCardProps {
  company: Company;
}

export const CompanyCard: React.FC<CompanyCardProps> = ({ company }) => {
  return (
    <Card className="hover:shadow-md transition-shadow overflow-hidden flex flex-col h-full">
      <div className="relative h-24 bg-muted">
        {company.coverUrl ? (
          <img src={company.coverUrl} alt={`${company.name} cover`} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-900/40 dark:to-indigo-900/40" />
        )}
        <div className="absolute -bottom-8 left-4 p-1 bg-background rounded-md shadow-sm">
          {company.logoUrl ? (
            <img src={company.logoUrl} alt={`${company.name} logo`} className="w-16 h-16 object-contain rounded" />
          ) : (
            <div className="w-16 h-16 bg-muted flex items-center justify-center rounded">
              <Building2 className="w-8 h-8 text-muted-foreground" />
            </div>
          )}
        </div>
      </div>
      
      <CardHeader className="pt-10 pb-2">
        <div className="flex justify-between items-start">
          <div>
            <Link to={`/companies/${company.slug}`} className="hover:text-primary transition-colors">
              <h3 className="font-semibold text-lg line-clamp-1">{company.name}</h3>
            </Link>
            {company.shortDescription && (
              <p className="text-sm text-muted-foreground line-clamp-1 mt-1">{company.shortDescription}</p>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="flex-grow">
        <div className="flex flex-col gap-2 mt-2">
          {company.address && (
            <div className="flex items-center text-sm text-muted-foreground">
              <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
              <span className="line-clamp-1">{company.address}</span>
            </div>
          )}
          
          <div className="flex flex-wrap gap-2 mt-2">
            {company.totalJobs > 0 && (
              <Badge variant="secondary" className="font-normal">
                {company.totalJobs} Việc làm
              </Badge>
            )}
            {company.size && (
              <Badge variant="outline" className="font-normal">
                {company.size.replace('_', ' - ').replace('plus', '+')} nhân viên
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="pt-0 pb-4 flex justify-between items-center border-t border-border/50 mt-4 px-6 relative top-4">
        <div className="flex items-center gap-1">
          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
          <span className="text-sm font-medium">{company.avgRating || 'Chưa có'}</span>
          <span className="text-sm text-muted-foreground ml-1">({company.totalReviews} đánh giá)</span>
        </div>
      </CardFooter>
    </Card>
  );
};
