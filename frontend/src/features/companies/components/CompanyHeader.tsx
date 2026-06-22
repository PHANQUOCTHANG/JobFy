import React from 'react';
import { Company } from '../types';
import { Building2, Globe, MapPin, Users, CheckCircle2, Star, Briefcase, Calendar, Facebook, Linkedin, FileText } from 'lucide-react';

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
                      <span>
                        Quy mô: {
                          {
                            'value_1_10': '1 - 10 nhân viên',
                            'value_11_50': '11 - 50 nhân viên',
                            'value_51_200': '51 - 200 nhân viên',
                            'value_201_500': '201 - 500 nhân viên',
                            'value_501_1000': '501 - 1000 nhân viên',
                            'value_1001_5000': '1001 - 5000 nhân viên',
                            'value_5000_plus': 'Trên 5000 nhân viên',
                            '1_10': '1 - 10 nhân viên',
                            '11_50': '11 - 50 nhân viên',
                            '51_200': '51 - 200 nhân viên',
                            '201_500': '201 - 500 nhân viên',
                            '501_1000': '501 - 1000 nhân viên',
                            '1001_5000': '1001 - 5000 nhân viên',
                            '5000_plus': 'Trên 5000 nhân viên',
                          }[company.size] || company.size
                        }
                      </span>
                    </div>
                  )}
                  {company.address && (
                    <div className="flex items-center gap-2 max-w-md">
                      <MapPin className="w-4 h-4 flex-shrink-0 text-primary/70" />
                      <span className="truncate">{company.address}</span>
                    </div>
                  )}
                  {company.industry && (
                    <div className="flex items-center gap-2">
                      <Briefcase className="w-4 h-4 text-primary/70" />
                      <span>{company.industry.name}</span>
                    </div>
                  )}
                  {company.foundedYear && (
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-primary/70" />
                      <span>Thành lập: {company.foundedYear}</span>
                    </div>
                  )}
                  {company.taxCode && (
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-primary/70" />
                      <span>MST: {company.taxCode}</span>
                    </div>
                  )}
                  {company.facebookUrl && (
                    <div className="flex items-center gap-2 hover:text-primary transition-colors">
                      <Facebook className="w-4 h-4 text-[#1877F2]" />
                      <a href={company.facebookUrl} target="_blank" rel="noopener noreferrer">Facebook</a>
                    </div>
                  )}
                  {company.linkedinUrl && (
                    <div className="flex items-center gap-2 hover:text-primary transition-colors">
                      <Linkedin className="w-4 h-4 text-[#0A66C2]" />
                      <a href={company.linkedinUrl} target="_blank" rel="noopener noreferrer">LinkedIn</a>
                    </div>
                  )}
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
