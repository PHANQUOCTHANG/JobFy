import React, { useState } from 'react';
import { Job } from '../types';
import { cn } from '@/lib/utils';
import { FileText, CheckSquare, Gift } from 'lucide-react';

interface JobDetailContentProps {
  job: Job;
}

export const JobDetailContent: React.FC<JobDetailContentProps> = ({ job }) => {
  const [activeTab, setActiveTab] = useState<'description' | 'requirements' | 'benefits'>('description');

  const tabs = [
    { id: 'description', label: 'Mô tả công việc', icon: FileText },
    { id: 'requirements', label: 'Yêu cầu ứng viên', icon: CheckSquare },
    { id: 'benefits', label: 'Quyền lợi', icon: Gift },
  ] as const;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Tabs Header */}
      <div className="flex border-b border-slate-200 overflow-x-auto hide-scrollbar bg-slate-50/50">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex items-center gap-2 px-6 py-4 text-sm font-semibold whitespace-nowrap border-b-2 transition-colors",
                isActive 
                  ? "border-[#1A56DB] text-[#1A56DB] bg-white" 
                  : "border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-100/50"
              )}
            >
              <Icon size={18} className={isActive ? "text-[#1A56DB]" : "text-slate-400"} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tabs Content */}
      <div className="p-6 md:p-8">
        <div className={cn("prose max-w-none text-slate-700 leading-relaxed", 
            "[&_ul]:list-disc [&_ul]:pl-5 [&_li]:mb-2 [&_p]:mb-4 [&_strong]:text-slate-900",
            activeTab !== 'description' && 'hidden'
          )}>
          {job.description ? (
            <div dangerouslySetInnerHTML={{ __html: job.description }} />
          ) : (
            <p className="text-slate-400 italic">Chưa có thông tin mô tả chi tiết.</p>
          )}
        </div>

        <div className={cn("prose max-w-none text-slate-700 leading-relaxed", 
            "[&_ul]:list-disc [&_ul]:pl-5 [&_li]:mb-2 [&_p]:mb-4 [&_strong]:text-slate-900",
            activeTab !== 'requirements' && 'hidden'
          )}>
          {job.requirements ? (
            <div dangerouslySetInnerHTML={{ __html: job.requirements }} />
          ) : (
            <p className="text-slate-400 italic">Chưa có thông tin yêu cầu ứng viên.</p>
          )}
        </div>

        <div className={cn("prose max-w-none text-slate-700 leading-relaxed", 
            "[&_ul]:list-disc [&_ul]:pl-5 [&_li]:mb-2 [&_p]:mb-4 [&_strong]:text-slate-900",
            activeTab !== 'benefits' && 'hidden'
          )}>
          {job.benefits ? (
            <div dangerouslySetInnerHTML={{ __html: job.benefits }} />
          ) : (
            <p className="text-slate-400 italic">Chưa có thông tin quyền lợi.</p>
          )}
        </div>
      </div>
    </div>
  );
};
