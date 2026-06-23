import React from 'react';
import { Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useJobs } from '../hooks/useJobs';

interface JobSearchSuggestionProps {
  keyword: string;
  onSelectSuggestion: (keyword: string) => void;
  onSearchModeChange: (mode: 'title' | 'company' | 'both') => void;
  searchMode: 'title' | 'company' | 'both';
}

export const JobSearchSuggestion: React.FC<JobSearchSuggestionProps> = ({
  keyword,
  onSelectSuggestion,
  onSearchModeChange,
  searchMode,
}) => {
  const { data: response } = useJobs({ keyword: keyword || undefined, searchMode, limit: 5 } as any);
  const jobs = response?.data || [];

  let suggestions: string[] = [];
  if (searchMode === 'title') {
    suggestions = Array.from(new Set(jobs.map(j => j.title))).filter(Boolean).slice(0, 5);
  } else if (searchMode === 'company') {
    suggestions = Array.from(new Set(jobs.map(j => j.company?.name))).filter(Boolean).slice(0, 5);
  } else {
    const rawSuggs = jobs.flatMap(j => [j.title, j.company?.name]).filter(Boolean);
    suggestions = Array.from(new Set(rawSuggs)).slice(0, 5) as string[];
  }
  
  // Extract related keywords from job skills and tags
  const relatedKeywords = Array.from(new Set(
    jobs.flatMap(j => [
      ...(j.jobSkills?.map(s => s.skill?.name) || []),
      ...(j.jobTags?.map(t => t.tag?.name) || [])
    ])
  )).filter(Boolean).slice(0, 5);

  return (
    <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-xl border border-[#e8e8e8] z-50 flex overflow-hidden max-h-[500px]">
      <div className="flex-1 flex flex-col min-w-0 border-r border-[#e8e8e8] overflow-y-auto p-4">
        <div className="flex items-center gap-3 mb-4 pb-4 border-b border-[#f0f0f0]">
          <span className="text-[13px] text-[#6f7882] font-medium whitespace-nowrap">Tìm kiếm theo:</span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onSearchModeChange('title')}
              className={`px-3 py-1 text-[13px] rounded-full border transition-colors ${
                searchMode === 'title' ? 'border-[#4F46E5] text-[#4F46E5] font-medium bg-indigo-50' : 'border-[#e8e8e8] text-[#212f3f] hover:bg-[#f5f5f5]'
              }`}
            >
              {searchMode === 'title' && <span className="mr-1">✓</span>}
              Tên việc làm
            </button>
            <button
              type="button"
              onClick={() => onSearchModeChange('company')}
              className={`px-3 py-1 text-[13px] rounded-full border transition-colors ${
                searchMode === 'company' ? 'border-[#4F46E5] text-[#4F46E5] font-medium bg-indigo-50' : 'border-[#e8e8e8] text-[#212f3f] hover:bg-[#f5f5f5]'
              }`}
            >
              {searchMode === 'company' && <span className="mr-1">✓</span>}
              Tên công ty
            </button>
            <button
              type="button"
              onClick={() => onSearchModeChange('both')}
              className={`px-3 py-1 text-[13px] rounded-full border transition-colors ${
                searchMode === 'both' ? 'border-[#4F46E5] text-[#4F46E5] font-medium bg-indigo-50' : 'border-[#e8e8e8] text-[#212f3f] hover:bg-[#f5f5f5]'
              }`}
            >
              {searchMode === 'both' && <span className="mr-1">✓</span>}
              Cả hai
            </button>
          </div>
        </div>

        {suggestions.length > 0 && (
          <div className="mb-4">
            <h4 className="text-[14px] font-bold text-[#212f3f] mb-2">Từ khóa gợi ý</h4>
            <div className="flex flex-col">
              {suggestions.map((sug, idx) => {
                const lowerKeyword = keyword.toLowerCase();
                const lowerSug = sug.toLowerCase();
                // eslint-disable-next-line unused-imports/no-unused-vars
                const displaySug = sug;
                // eslint-disable-next-line unused-imports/no-unused-vars
                const highlightKeyword = keyword;
                
                // Try to split the suggestion if it contains the keyword
                const index = lowerSug.indexOf(lowerKeyword);
                
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => onSelectSuggestion(sug)}
                    className="flex items-center gap-3 py-2 px-2 hover:bg-[#f5f5f5] rounded-md text-left transition-colors group"
                  >
                    <Search size={16} className="text-[#9ea5af] group-hover:text-[#4F46E5]" />
                    <span className="text-[14px] text-[#6f7882]">
                      {keyword && index !== -1 ? (
                        <>
                          {sug.substring(0, index)}
                          <span className="text-[#212f3f] font-medium">{sug.substring(index, index + keyword.length)}</span>
                          {sug.substring(index + keyword.length)}
                        </>
                      ) : (
                        sug
                      )}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {relatedKeywords.length > 0 && (
          <div>
            <h4 className="text-[14px] font-bold text-[#212f3f] mb-2">Từ khóa liên quan</h4>
            <div className="flex flex-col">
              {relatedKeywords.map((rel, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => onSelectSuggestion(rel as string)}
                  className="flex items-center gap-3 py-2 px-2 hover:bg-[#f5f5f5] rounded-md text-left transition-colors group"
                >
                  <Search size={16} className="text-[#9ea5af] group-hover:text-[#4F46E5]" />
                  <span className="text-[14px] text-[#6f7882] font-medium group-hover:text-[#4F46E5]">{rel}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="w-[380px] bg-[#fafafa] p-4 flex-shrink-0 overflow-y-auto scrollbar-hide">
        <h4 className="text-[14px] font-bold text-[#212f3f] mb-4">Việc làm có thể bạn quan tâm</h4>
        <div className="flex flex-col gap-3">
          {jobs.length > 0 ? (
            jobs.map((job) => (
              <Link
                key={job.id}
                to={`/jobs/${job.slug || job.id}`}
                className="flex gap-3 bg-white p-3 rounded-lg border border-[#e8e8e8] hover:border-[#4F46E5] hover:shadow-sm transition-all"
              >
                <div className="w-12 h-12 bg-white border border-[#e8e8e8] rounded flex items-center justify-center flex-shrink-0 p-1">
                  <img src={job.company?.logoUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(job.company?.name || 'Company')}&background=4F46E5&color=fff`} alt="logo" className="w-full h-full object-contain" />
                </div>
                <div className="flex-1 min-w-0">
                  <h5 className="text-[13px] font-bold text-[#212f3f] truncate group-hover:text-[#4F46E5] mb-1">
                    {job.title}
                  </h5>
                  <p className="text-[12px] text-[#6f7882] truncate mb-1">{job.company?.name || 'Công ty ẩn danh'}</p>
                  <span className="text-[13px] font-bold text-[#4F46E5]">
                    {job.salaryMin && job.salaryMax
                      ? `${job.salaryMin / 1000000} - ${job.salaryMax / 1000000} triệu`
                      : "Thoả thuận"}
                  </span>
                </div>
              </Link>
            ))
          ) : (
            <p className="text-[13px] text-[#6f7882]">Không tìm thấy công việc phù hợp.</p>
          )}
        </div>
      </div>
    </div>
  );
};
