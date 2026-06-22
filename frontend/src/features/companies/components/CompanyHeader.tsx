import React from 'react';
import { Company } from '../types';
import { Building2, Globe, MapPin, Users, CheckCircle2, Star } from 'lucide-react';

interface CompanyHeaderProps {
  company: Company;
}

export const CompanyHeader: React.FC<CompanyHeaderProps> = ({ company }) => {
  return (
    <div className="bg-card rounded-2xl border border-border/40 shadow-sm overflow-hidden mb-8 relative">
      <div className="h-48 md:h-[320px] w-full bg-muted relative overflow-hidden">
        {company.coverUrl ? (
          <img src={company.coverUrl} alt="Cover" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-gradient-brand opacity-90 relative">
            <div className="absolute inset-0 bg-mesh-brand mix-blend-overlay opacity-40 pointer-events-none" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-80" />
      </div>

      <div className="px-6 md:px-10 pb-10">
        <div className="flex flex-col md:flex-row gap-8 relative -mt-16 md:-mt-24">
          <div className="w-32 h-32 md:w-[180px] md:h-[180px] rounded-[2rem] bg-card p-2.5 border-[6px] border-card shadow-brand-lg flex-shrink-0 relative z-10 overflow-hidden group">
            {company.logoUrl ? (
              <img src={company.logoUrl} alt={`${company.name} logo`} className="w-full h-full object-contain bg-white rounded-[1.25rem] transition-transform duration-500 group-hover:scale-105" />
            ) : (
              <div className="w-full h-full bg-muted flex items-center justify-center rounded-[1.25rem]">
                <Building2 className="w-16 h-16 text-muted-foreground/30" />
              </div>
            )}
          </div>

          <div className="flex-grow pt-2 md:pt-28">
            <div className="flex flex-col xl:flex-row xl:items-start justify-between gap-6">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-2xl md:text-[32px] font-black text-foreground leading-tight tracking-tight">{company.name}</h1>
                  {company.isVerified && (
                    <div className="bg-success/15 text-success font-bold text-[12.5px] px-2.5 py-1 rounded-md flex items-center gap-1.5 whitespace-nowrap">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Xác thực
                    </div>
                  )}
                </div>
                
                <div className="flex flex-wrap gap-4 mt-4 text-[14.5px] font-medium text-muted-foreground">
                  {company.website && (
                    <div className="flex items-center gap-2 hover:text-primary transition-colors">
                      <Globe className="w-4 h-4 text-primary/70" />
                      <a href={company.website} target="_blank" rel="noopener noreferrer">
                        {company.website.replace(/^https?:\/\//, '')}
                      </a>
                    </div>
                  )}
                  {company.size && (
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-primary/70" />
                      <span>Quy mô: {company.size.replace('_', ' - ').replace('plus', '+')}</span>
                    </div>
                  )}
                  {company.address && (
                    <div className="flex items-center gap-2 max-w-md">
                      <MapPin className="w-4 h-4 flex-shrink-0 text-primary/70" />
                      <span className="truncate">{company.address}</span>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex flex-col items-start xl:items-end gap-3 bg-muted/30 p-4 rounded-xl border border-border/50 min-w-[200px]">
                <div className="text-[13px] font-bold text-muted-foreground uppercase tracking-wider">Đánh giá trung bình</div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-[#F59E0B]/10">
                    <Star className="w-6 h-6 fill-[#F59E0B] text-[#F59E0B]" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-foreground font-black text-[24px] leading-none">{company.avgRating || '5.0'}</span>
                    <span className="text-muted-foreground font-medium text-[13.5px] mt-1">{company.totalReviews || 0} lượt đánh giá</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
