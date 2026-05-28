import React from 'react';
import { Company } from '../types';
import { Badge } from '@/components/ui/badge';
import { Building2, Globe, MapPin, Users } from 'lucide-react';

interface CompanyHeaderProps {
  company: Company;
}

export const CompanyHeader: React.FC<CompanyHeaderProps> = ({ company }) => {
  return (
    <div className="bg-card rounded-xl border shadow-sm overflow-hidden mb-8">
      {/* Cover Image */}
      <div className="h-48 md:h-64 w-full bg-muted relative">
        {company.coverUrl ? (
          <img src={company.coverUrl} alt="Cover" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-900/40 dark:to-indigo-900/40" />
        )}
      </div>

      <div className="px-6 md:px-10 pb-8">
        <div className="flex flex-col md:flex-row gap-6 relative -mt-16 sm:-mt-20">
          {/* Logo */}
          <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-xl bg-background p-2 border-4 border-background shadow-md flex-shrink-0 relative z-10">
            {company.logoUrl ? (
              <img src={company.logoUrl} alt={`${company.name} logo`} className="w-full h-full object-contain rounded-lg" />
            ) : (
              <div className="w-full h-full bg-muted flex items-center justify-center rounded-lg">
                <Building2 className="w-16 h-16 text-muted-foreground" />
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex-grow pt-2 md:pt-24 lg:pt-24 xl:pt-24">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold">{company.name}</h1>
                <div className="flex flex-wrap gap-4 mt-3 text-sm text-muted-foreground">
                  {company.website && (
                    <div className="flex items-center gap-1.5 hover:text-primary">
                      <Globe className="w-4 h-4" />
                      <a href={company.website} target="_blank" rel="noopener noreferrer">
                        Website công ty
                      </a>
                    </div>
                  )}
                  {company.size && (
                    <div className="flex items-center gap-1.5">
                      <Users className="w-4 h-4" />
                      <span>{company.size.replace('_', ' - ').replace('plus', '+')} nhân viên</span>
                    </div>
                  )}
                  {company.address && (
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-4 h-4" />
                      <span>{company.address}</span>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                {company.isVerified && (
                  <Badge variant="default" className="bg-green-500 hover:bg-green-600 text-white">
                    Đã xác thực
                  </Badge>
                )}
                <Badge variant="outline" className="text-lg py-1 px-3">
                  ★ {company.avgRating || 'Chưa có'}
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
