import React from 'react';
import { Card } from '@/components/ui/card';
import { Company } from '../types';
import { Link } from 'react-router-dom';

interface CompanyCardProps {
  company: Company;
}

export const CompanyCard: React.FC<CompanyCardProps> = ({ company }) => {
  return (
    <Link to={`/companies/${company.slug}`} className="block group">
      <Card className="hover:border-blue-400 transition-all duration-300 overflow-hidden flex flex-row items-center bg-white border border-slate-200 p-4 shadow-sm hover:shadow-md h-[130px] rounded-xl">
        <div className="w-[85px] h-[85px] flex-shrink-0 bg-white border border-slate-100 rounded-xl flex items-center justify-center p-1.5 mr-4 overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
          {company.logoUrl ? (
            <img src={company.logoUrl} alt={`${company.name} logo`} className="max-w-full max-h-full object-contain" />
          ) : (
            <div className="w-full h-full bg-slate-50 flex items-center justify-center rounded-lg text-slate-400 font-bold text-2xl">
              {company.name.charAt(0)}
            </div>
          )}
        </div>
        
        <div className="flex flex-col flex-grow justify-between h-full py-1">
          <div>
            <h3 className="font-bold text-[15px] leading-snug line-clamp-2 text-slate-800 mb-1 group-hover:text-blue-700 transition-colors">{company.name}</h3>
            <p className="text-[13px] text-slate-500 line-clamp-1">{company.shortDescription || 'N/A'}</p>
          </div>
          
          <div className="mt-1">
            <span className="inline-block text-blue-700 text-[13px] font-semibold bg-blue-50/50 px-2.5 py-0.5 rounded-md">
              {company.totalJobs} việc làm đang tuyển
            </span>
          </div>
        </div>
      </Card>
    </Link>
  );
};
