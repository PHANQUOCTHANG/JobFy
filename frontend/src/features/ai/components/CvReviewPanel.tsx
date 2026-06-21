import React from 'react';
import { X, Sparkles, CheckCircle2, AlertTriangle, Loader2 } from 'lucide-react';
import { CvReviewResult } from '../types';

interface CvReviewPanelProps {
  result: CvReviewResult | null;
  isLoading: boolean;
  onReview: () => void;
  onClose: () => void;
}

export const CvReviewPanel: React.FC<CvReviewPanelProps> = ({ result, isLoading, onReview, onClose }) => {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getScoreBg = (score: number) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const sectionTitles: Record<keyof CvReviewResult['sections'], string> = {
    personalInfo: 'Thông tin cá nhân',
    experience: 'Kinh nghiệm làm việc',
    education: 'Học vấn',
    skills: 'Kỹ năng',
    summary: 'Mục tiêu nghề nghiệp'
  };

  return (
    <div className="flex flex-col h-full bg-white border-l border-gray-200">
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <h3 className="font-bold text-gray-800 flex items-center gap-2">
          <Sparkles className="text-purple-500" size={18} />
          AI Đánh giá CV
        </h3>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
          <X size={20} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {!result && !isLoading ? (
          <div className="flex flex-col items-center justify-center h-full text-center text-gray-500 space-y-4">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center text-purple-500">
              <Sparkles size={32} />
            </div>
            <div>
              <p className="font-medium text-gray-700">Chưa có đánh giá nào</p>
              <p className="text-sm mt-1">Nhấn nút bên dưới để AI phân tích và chấm điểm CV của bạn.</p>
            </div>
            <button
              onClick={onReview}
              className="bg-purple-600 hover:bg-purple-700 text-white font-medium px-4 py-2 rounded-md transition-colors"
            >
              Phân tích CV ngay
            </button>
          </div>
        ) : isLoading ? (
          <div className="flex flex-col items-center justify-center h-full text-center text-gray-500 space-y-4">
            <Loader2 className="w-10 h-10 animate-spin text-purple-500" />
            <p className="font-medium text-purple-700 animate-pulse">AI đang phân tích chi tiết CV của bạn...</p>
          </div>
        ) : result ? (
          <div className="space-y-6">
            {/* Điểm tổng thể */}
            <div className="flex flex-col items-center justify-center py-4 bg-gray-50 rounded-xl border border-gray-100">
              <div className="text-sm font-semibold text-gray-500 mb-2 uppercase tracking-wider">Điểm tổng thể</div>
              <div className={`text-5xl font-black ${getScoreColor(result.overallScore)}`}>
                {result.overallScore}
                <span className="text-xl text-gray-400 font-medium">/100</span>
              </div>
            </div>

            {/* Điểm thành phần */}
            <div>
              <h4 className="font-bold text-gray-800 mb-3 text-sm">Điểm thành phần</h4>
              <div className="space-y-4">
                {(Object.keys(result.sections) as Array<keyof CvReviewResult['sections']>).map((key) => {
                  const section = result.sections[key];
                  return (
                    <div key={key} className="space-y-1">
                      <div className="flex justify-between items-center text-sm">
                        <span className="font-medium text-gray-700">{sectionTitles[key]}</span>
                        <span className={`font-bold ${getScoreColor(section.score)}`}>{section.score}/100</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <div 
                          className={`h-1.5 rounded-full ${getScoreBg(section.score)}`} 
                          style={{ width: `${section.score}%` }}
                        />
                      </div>
                      <p className="text-[12px] text-gray-500 italic mt-1 leading-tight">{section.feedback}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="h-px bg-gray-200" />

            {/* Gợi ý cải thiện */}
            <div>
              <h4 className="font-bold text-gray-800 mb-3 text-sm">Gợi ý cải thiện</h4>
              <ul className="space-y-3">
                {result.suggestions.map((suggestion, idx) => (
                  <li key={idx} className="flex gap-2 text-[13px] text-gray-700">
                    <AlertTriangle className="text-yellow-500 shrink-0 mt-0.5" size={14} />
                    <span className="leading-snug">{suggestion}</span>
                  </li>
                ))}
                {result.suggestions.length === 0 && (
                  <li className="flex gap-2 text-[13px] text-green-700 font-medium">
                    <CheckCircle2 className="text-green-500 shrink-0" size={14} />
                    CV của bạn đã rất tốt, không có gợi ý nào thêm!
                  </li>
                )}
              </ul>
            </div>

            <button
              onClick={onReview}
              className="w-full mt-4 bg-white border border-purple-200 text-purple-600 hover:bg-purple-50 font-medium px-4 py-2 rounded-md transition-colors text-sm"
            >
              Phân tích lại
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
};
