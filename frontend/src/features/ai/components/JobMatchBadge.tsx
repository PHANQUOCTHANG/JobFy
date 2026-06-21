import React, { useState } from 'react';
import { useMatchJob } from '../hooks/useAi';
import { JobMatchResult } from '../types';
import { Loader2, Zap, CheckCircle2, XCircle, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react';

interface JobMatchBadgeProps {
  resumeId: string;
  jobId: string;
  language?: 'vi' | 'en';
}

export const JobMatchBadge: React.FC<JobMatchBadgeProps> = ({ resumeId, jobId, language = 'vi' }) => {
  const [result, setResult] = useState<JobMatchResult | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const matchJobMutation = useMatchJob();

  const handleMatch = () => {
    if (result) {
      setIsExpanded(!isExpanded);
      return;
    }
    
    matchJobMutation.mutate({ resumeId, jobId, language }, {
      onSuccess: (res) => {
        const data = res.data?.data || res.data;
        if (data) {
          setResult(data as JobMatchResult);
          setIsExpanded(true);
        }
      }
    });
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-50 border-green-200';
    if (score >= 60) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Phù hợp cao';
    if (score >= 60) return 'Tương đối phù hợp';
    return 'Ít phù hợp';
  };

  return (
    <div className="relative">
      {!result ? (
        <button 
          onClick={handleMatch}
          disabled={matchJobMutation.isPending}
          className="inline-flex items-center gap-1.5 px-3 py-1 bg-purple-50 hover:bg-purple-100 border border-purple-200 text-purple-700 text-xs font-semibold rounded-full transition-colors"
        >
          {matchJobMutation.isPending ? (
            <Loader2 size={14} className="animate-spin" />
          ) : (
            <Zap size={14} className="text-purple-500" />
          )}
          {matchJobMutation.isPending ? 'Đang phân tích...' : 'AI Phân tích độ phù hợp'}
        </button>
      ) : (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className={`inline-flex items-center gap-1.5 px-3 py-1 border text-xs font-bold rounded-full transition-colors ${getScoreColor(result.matchScore)}`}
        >
          <Zap size={14} />
          {getScoreLabel(result.matchScore)} ({result.matchScore}%)
          {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>
      )}

      {isExpanded && result && (
        <div className="absolute top-full right-0 mt-2 w-[320px] bg-white border border-gray-200 shadow-xl rounded-xl p-4 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex justify-between items-center mb-3">
            <h4 className="font-bold text-gray-800 text-sm flex items-center gap-1.5">
              <Zap size={16} className="text-purple-500" />
              Chi tiết đánh giá (AI)
            </h4>
            <div className={`text-sm font-black ${getScoreColor(result.matchScore).split(' ')[0]}`}>
              {result.matchScore}/100
            </div>
          </div>
          
          <div className="space-y-3">
            <div>
              <div className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Kỹ năng đáp ứng</div>
              <div className="flex flex-wrap gap-1">
                {result.matchedSkills.map((s, i) => (
                  <span key={i} className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-50 text-green-700 border border-green-200 rounded text-[11px] font-medium">
                    <CheckCircle2 size={10} /> {s}
                  </span>
                ))}
                {result.matchedSkills.length === 0 && <span className="text-[12px] text-gray-400 italic">Không có</span>}
              </div>
            </div>

            <div>
              <div className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Kỹ năng còn thiếu</div>
              <div className="flex flex-wrap gap-1">
                {result.missingSkills.map((s, i) => (
                  <span key={i} className="inline-flex items-center gap-1 px-2 py-0.5 bg-red-50 text-red-700 border border-red-200 rounded text-[11px] font-medium">
                    <XCircle size={10} /> {s}
                  </span>
                ))}
                {result.missingSkills.length === 0 && <span className="text-[12px] text-green-600 font-medium italic">Không thiếu kỹ năng nào!</span>}
              </div>
            </div>

            <div>
              <div className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide mb-1">Kinh nghiệm</div>
              <p className="text-[12px] text-gray-700 leading-snug">{result.experienceMatch}</p>
            </div>

            <div className="pt-2 border-t border-gray-100">
              <div className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide mb-1.5">AI Gợi ý để tăng tỷ lệ đậu</div>
              <ul className="space-y-1.5">
                {result.suggestions.map((s, i) => (
                  <li key={i} className="flex gap-1.5 text-[12px] text-gray-700">
                    <AlertCircle size={14} className="text-purple-500 shrink-0" />
                    <span className="leading-tight">{s}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
