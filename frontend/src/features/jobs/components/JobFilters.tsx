import React, { useRef, useEffect, useState } from "react";
import { useJobCategories, useProvinces } from "../hooks/useJobs";
import { JobFilterParams } from "../types";
import { Search, MapPin, ChevronDown } from "lucide-react";
import { JobSearchSuggestion } from "./JobSearchSuggestion";
import { Skeleton } from "@/components/ui/skeleton";

interface JobFiltersProps {
  onSearch: (filters: Partial<JobFilterParams>) => void;
  initialKeyword?: string;
  initialProvinceId?: number;
  initialCategorySlug?: string;
}

export const JobFilters: React.FC<JobFiltersProps> = ({
  onSearch,
  initialKeyword = "",
  initialProvinceId,
  initialCategorySlug,
}) => {
  const [keyword, setKeyword] = React.useState(initialKeyword ?? "");
  const [provinceId, setProvinceId] = React.useState<string>(
    initialProvinceId ? String(initialProvinceId) : "all",
  );
  const [categorySlug, setCategorySlug] = React.useState<string>(
    initialCategorySlug ? String(initialCategorySlug) : "all",
  );
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showProvinceDropdown, setShowProvinceDropdown] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchMode, setSearchMode] = useState<'title' | 'company' | 'both'>('title');

  // Sync internal state when external props change (e.g. sidebar filter updates URL)
  useEffect(() => {
    setKeyword(initialKeyword ?? "");
  }, [initialKeyword]);

  useEffect(() => {
    setProvinceId(initialProvinceId ? String(initialProvinceId) : "all");
  }, [initialProvinceId]);

  useEffect(() => {
    setCategorySlug(initialCategorySlug ? String(initialCategorySlug) : "all");
  }, [initialCategorySlug]);

  const categoryRef = useRef<HTMLDivElement>(null);
  const provinceRef = useRef<HTMLDivElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  const { data: categories, isLoading: isLoadingCategories } = useJobCategories();
  const { data: provinces, isLoading: isLoadingProvinces } = useProvinces();

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (categoryRef.current && !categoryRef.current.contains(e.target as Node)) {
        setShowCategoryDropdown(false);
      }
      if (provinceRef.current && !provinceRef.current.contains(e.target as Node)) {
        setShowProvinceDropdown(false);
      }
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setShowSuggestions(false);
    onSearch({
      keyword: keyword || undefined,
      provinceId: provinceId !== "all" ? Number(provinceId) : undefined,
      categorySlug: categorySlug !== "all" ? categorySlug : undefined,
    });
  };

  const selectedCategory = categories?.find(
    (c) => String(c.slug) === categorySlug,
  );
  const selectedProvince = provinces?.find((p) => String(p.id) === provinceId);

  return (
    <div ref={searchContainerRef} className="relative">
      <form
        onSubmit={handleSearch}
        className="flex items-stretch gap-3 h-12 relative z-10"
      >
        <div className="flex flex-1 items-stretch bg-white rounded-lg border border-[#e8e8e8]">
        <div ref={categoryRef} className="relative border-r border-[#e8e8e8] bg-[#f8f8f8] rounded-l-lg">
          <button
            type="button"
            onClick={() => {
              setShowCategoryDropdown(!showCategoryDropdown);
              setShowProvinceDropdown(false);
              setShowSuggestions(false);
            }}
            className="h-full px-4 flex items-center gap-2 text-[14px] font-medium text-[#212f3f] hover:bg-[#f0f0f0] transition-colors whitespace-nowrap min-w-[170px]"
          >
            <svg
              className="w-4 h-4 text-[#6f7882]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 10h16M4 14h8M4 18h8"
              />
            </svg>
            <div className="flex-1 text-left truncate max-w-[120px]">
              {isLoadingCategories ? (
                <Skeleton className="h-4 w-20 bg-[#f0f0f0]" />
              ) : selectedCategory ? (
                selectedCategory.name
              ) : (
                "Danh mục Nghề"
              )}
            </div>
            <ChevronDown size={14} className="text-[#6f7882]" />
          </button>

          {showCategoryDropdown && (
            <div className="absolute top-full left-0 mt-2 w-64 bg-white border border-[#e8e8e8] rounded-xl shadow-xl z-[200] max-h-72 overflow-y-auto scrollbar-hide">
              <div
                className="px-4 py-2.5 text-[13px] text-[#6f7882] hover:bg-[#f5f5f5] cursor-pointer flex justify-start text-left w-full"
                onClick={() => {
                  setCategorySlug("all");
                  setShowCategoryDropdown(false);
                }}
              >
                Tất cả danh mục
              </div>
              {(categories || []).map((cat) => (
                <div
                  key={cat.id}
                  className={`px-4 py-2.5 text-[13px] cursor-pointer hover:bg-[#f5f5f5] transition-colors flex justify-start text-left w-full ${
                    categorySlug === String(cat.slug)
                      ? "text-[#4F46E5] font-semibold bg-blue-50"
                      : "text-[#212f3f]"
                  }`}
                  onClick={() => {
                    setCategorySlug(String(cat.slug));
                    setShowCategoryDropdown(false);
                  }}
                >
                  {cat.name}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex-1 relative flex items-center border-r border-[#e8e8e8]">
          <Search className="absolute left-3.5 w-4 h-4 text-[#9ea5af]" />
          <input
            type="text"
            placeholder="Vị trí tuyển dụng, tên công ty..."
            className="w-full h-full pl-10 pr-4 text-[14px] text-[#212f3f] placeholder-[#9ea5af] bg-transparent outline-none"
            value={keyword}
            onChange={(e) => {
              setKeyword(e.target.value);
              setShowSuggestions(true);
            }}
            onFocus={() => setShowSuggestions(true)}
          />
        </div>

        <div ref={provinceRef} className="relative border-r border-[#e8e8e8] last:border-r-0">
          <button
            type="button"
            onClick={() => {
              setShowProvinceDropdown(!showProvinceDropdown);
              setShowCategoryDropdown(false);
              setShowSuggestions(false);
            }}
            className="h-full px-4 flex items-center gap-2 text-[14px] font-medium text-[#212f3f] hover:bg-[#f8f8f8] transition-colors whitespace-nowrap min-w-[150px]"
          >
            <MapPin size={15} className="text-[#6f7882] flex-shrink-0" />
            <div className="flex-1 text-left truncate max-w-[100px]">
              {isLoadingProvinces ? (
                <Skeleton className="h-4 w-16 bg-[#f0f0f0]" />
              ) : selectedProvince ? (
                selectedProvince.name
              ) : (
                "Địa điểm"
              )}
            </div>
            <ChevronDown size={14} className="text-[#6f7882]" />
          </button>

          {showProvinceDropdown && (
            <div className="absolute top-full right-0 mt-2 w-56 bg-white border border-[#e8e8e8] rounded-xl shadow-xl z-[200] max-h-72 overflow-y-auto scrollbar-hide">
              <div
                className="px-4 py-2.5 text-[13px] text-[#6f7882] hover:bg-[#f5f5f5] cursor-pointer flex justify-start text-left w-full"
                onClick={() => {
                  setProvinceId("all");
                  setShowProvinceDropdown(false);
                  // Auto-trigger search clearing province
                  onSearch({
                    keyword: keyword || undefined,
                    provinceId: undefined,
                    categorySlug: categorySlug !== "all" ? categorySlug : undefined,
                  });
                }}
              >
                Tất cả địa điểm
              </div>
              {(provinces || []).map((prov) => (
                <div
                  key={prov.id}
                  className={`px-4 py-2.5 text-[13px] cursor-pointer hover:bg-[#f5f5f5] transition-colors flex justify-start text-left w-full ${
                    provinceId === String(prov.id)
                      ? "text-[#4F46E5] font-semibold bg-blue-50"
                      : "text-[#212f3f]"
                  }`}
                  onClick={() => {
                    const newProvinceId = String(prov.id);
                    setProvinceId(newProvinceId);
                    setShowProvinceDropdown(false);
                    // Auto-trigger search when province selected
                    onSearch({
                      keyword: keyword || undefined,
                      provinceId: Number(newProvinceId),
                      categorySlug: categorySlug !== "all" ? categorySlug : undefined,
                    });
                  }}
                >
                  {prov.name}
                </div>
              ))}
            </div>
          )}
        </div>

        </div>

        <button
          type="submit"
          className="px-6 h-full bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold text-[15px] rounded-lg transition-colors whitespace-nowrap flex-shrink-0"
        >
          Tìm kiếm
        </button>
      </form>

      {showSuggestions && (
        <JobSearchSuggestion
          keyword={keyword}
          searchMode={searchMode}
          onSearchModeChange={setSearchMode}
          onSelectSuggestion={(sug) => {
            setKeyword(sug);
            setShowSuggestions(false);
            // Kích hoạt tìm kiếm khi chọn gợi ý
            setTimeout(() => {
               const btn = document.querySelector('form button[type="submit"]') as HTMLButtonElement;
               if (btn) btn.click();
            }, 0);
          }}
        />
      )}
    </div>
  );
};
