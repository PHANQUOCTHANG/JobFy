import React, { useRef, useEffect, useState } from "react";
import { useJobCategories, useProvinces, useDistricts } from "../hooks/useJobs";
import { JobFilterParams } from "../types";
import { Search, MapPin, ChevronDown } from "lucide-react";
import { JobSearchSuggestion } from "./JobSearchSuggestion";
import { Skeleton } from "@/components/ui/skeleton";

interface JobFiltersProps {
  onSearch: (filters: Partial<JobFilterParams>) => void;
  initialKeyword?: string;
  initialProvinceId?: number;
  initialDistrictIds?: string;
  initialCategorySlug?: string;
  searchMode: 'title' | 'company' | 'both';
  onSearchModeChange: (mode: 'title' | 'company' | 'both') => void;
}

export const JobFilters: React.FC<JobFiltersProps> = ({
  onSearch,
  initialKeyword = "",
  initialProvinceId,
  initialDistrictIds,
  initialCategorySlug,
  searchMode,
  onSearchModeChange,
}) => {
  const [keyword, setKeyword] = React.useState(initialKeyword ?? "");
  const [provinceId, setProvinceId] = React.useState<string>(
    initialProvinceId ? String(initialProvinceId) : "all",
  );
  const [categorySlug, setCategorySlug] = React.useState<string>(
    initialCategorySlug ? String(initialCategorySlug) : "all",
  );
  
  // District & 2-column layout state
  const [activeProvinceTab, setActiveProvinceTab] = useState<string>(
    initialProvinceId ? String(initialProvinceId) : "all",
  );
  const [districtIds, setDistrictIds] = useState<number[]>(
    initialDistrictIds ? initialDistrictIds.split(",").map(Number) : []
  );
  const [provinceSearch, setProvinceSearch] = useState("");

  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showProvinceDropdown, setShowProvinceDropdown] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Sync internal state when external props change (e.g. sidebar filter updates URL)
  useEffect(() => {
    setKeyword(initialKeyword ?? "");
  }, [initialKeyword]);

  useEffect(() => {
    setProvinceId(initialProvinceId ? String(initialProvinceId) : "all");
    setActiveProvinceTab(initialProvinceId ? String(initialProvinceId) : "all");
  }, [initialProvinceId]);

  useEffect(() => {
    if (initialDistrictIds) {
      setDistrictIds(initialDistrictIds.split(",").map(Number));
    } else {
      setDistrictIds([]);
    }
  }, [initialDistrictIds]);

  useEffect(() => {
    setCategorySlug(initialCategorySlug ? String(initialCategorySlug) : "all");
  }, [initialCategorySlug]);

  const categoryRef = useRef<HTMLDivElement>(null);
  const provinceRef = useRef<HTMLDivElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  const { data: categories, isLoading: isLoadingCategories } = useJobCategories();
  const { data: provinces, isLoading: isLoadingProvinces } = useProvinces();
  const { data: districts, isLoading: isLoadingDistricts } = useDistricts(
    activeProvinceTab !== "all" ? Number(activeProvinceTab) : undefined
  );

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
      districtIds: districtIds.length > 0 ? districtIds.join(",") : undefined,
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
            <div className="absolute top-full left-0 mt-2 w-64 bg-white border border-[#e8e8e8] rounded-xl shadow-xl z-[1000] max-h-72 overflow-y-auto scrollbar-hide">
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
            <div className="absolute top-full right-0 mt-2 w-[550px] bg-white border border-[#e8e8e8] rounded-xl shadow-xl z-[1000] flex h-[350px]">
              {/* Cột trái: Tỉnh/Thành */}
              <div className="w-1/2 border-r border-[#e8e8e8] flex flex-col bg-white rounded-l-xl">
                <div className="p-3 border-b border-[#e8e8e8]">
                  <input
                    type="text"
                    placeholder="Tìm Tỉnh/Thành"
                    className="w-full h-9 px-3 text-[13px] border border-[#e8e8e8] rounded-md outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
                    value={provinceSearch}
                    onChange={(e) => setProvinceSearch(e.target.value)}
                  />
                </div>
                <div className="flex-1 overflow-y-auto scrollbar-hide py-2">
                  <div className="px-4 py-2">
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <div className="relative flex items-center justify-center w-5 h-5">
                        <input
                          type="radio"
                          name="province"
                          className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                          checked={activeProvinceTab === "all"}
                          onChange={() => setActiveProvinceTab("all")}
                        />
                      </div>
                      <span className={`text-[14px] ${activeProvinceTab === "all" ? "text-blue-600 font-semibold" : "text-[#212f3f] group-hover:text-blue-600"}`}>
                        Tất cả địa điểm
                      </span>
                    </label>
                  </div>
                  {(provinces || [])
                    .filter((p) => p.name.toLowerCase().includes(provinceSearch.toLowerCase()))
                    .map((prov) => (
                      <div key={prov.id} className="px-4 py-2 hover:bg-[#f8f8f8] transition-colors">
                        <label className="flex items-center gap-3 cursor-pointer group">
                          <div className="relative flex items-center justify-center w-5 h-5">
                            <input
                              type="radio"
                              name="province"
                              className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                              checked={activeProvinceTab === String(prov.id)}
                              onChange={() => setActiveProvinceTab(String(prov.id))}
                            />
                          </div>
                          <span className={`text-[14px] ${activeProvinceTab === String(prov.id) ? "text-blue-600 font-semibold" : "text-[#212f3f] group-hover:text-blue-600"}`}>
                            {prov.name}
                          </span>
                        </label>
                      </div>
                    ))}
                </div>
              </div>

              {/* Cột phải: Quận/Huyện */}
              <div className="w-1/2 flex flex-col bg-white rounded-r-xl">
                <div className="p-3 border-b border-[#e8e8e8] flex items-center justify-between">
                  <span className="font-bold text-[14px] text-[#212f3f]">Quận/Huyện</span>
                  <button
                    type="button"
                    onClick={() => {
                      setProvinceId(activeProvinceTab);
                      setShowProvinceDropdown(false);
                      onSearch({
                        keyword: keyword || undefined,
                        provinceId: activeProvinceTab !== "all" ? Number(activeProvinceTab) : undefined,
                        districtIds: districtIds.length > 0 ? districtIds.join(",") : undefined,
                        categorySlug: categorySlug !== "all" ? categorySlug : undefined,
                      });
                    }}
                    className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-[13px] font-semibold px-4 py-1.5 rounded-full transition-colors"
                  >
                    Áp dụng
                  </button>
                </div>
                <div className="flex-1 overflow-y-auto scrollbar-hide py-2">
                  {activeProvinceTab === "all" ? (
                    <div className="px-4 py-8 text-center text-[13px] text-gray-500">
                      Vui lòng chọn Tỉnh/Thành phố để xem danh sách Quận/Huyện
                    </div>
                  ) : isLoadingDistricts ? (
                    <div className="px-4 py-8 text-center text-[13px] text-gray-500">
                      Đang tải danh sách...
                    </div>
                  ) : (
                    <>
                      <div className="px-4 py-2">
                        <label className="flex items-center gap-3 cursor-pointer group">
                          <input
                            type="checkbox"
                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                            checked={districts && districtIds.length === districts.length && districts.length > 0}
                            onChange={(e) => {
                              if (e.target.checked && districts) {
                                setDistrictIds(districts.map(d => d.id));
                              } else {
                                setDistrictIds([]);
                              }
                            }}
                          />
                          <span className="text-[14px] text-[#212f3f] font-medium group-hover:text-blue-600">
                            Tất cả
                          </span>
                        </label>
                      </div>
                      {(districts || []).map((dist) => (
                        <div key={dist.id} className="px-4 py-2 hover:bg-[#f8f8f8] transition-colors">
                          <label className="flex items-center gap-3 cursor-pointer group">
                            <input
                              type="checkbox"
                              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                              checked={districtIds.includes(dist.id)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setDistrictIds(prev => [...prev, dist.id]);
                                } else {
                                  setDistrictIds(prev => prev.filter(id => id !== dist.id));
                                }
                              }}
                            />
                            <span className={`text-[14px] ${districtIds.includes(dist.id) ? "text-[#212f3f] font-semibold" : "text-gray-600"}`}>
                              {dist.name}
                            </span>
                          </label>
                        </div>
                      ))}
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        </div>

        <button
          type="submit"
          className="px-6 h-full bg-[#1e40af] hover:bg-blue-800 text-white font-bold text-[15px] rounded-lg transition-colors whitespace-nowrap flex-shrink-0"
        >
          Tìm kiếm
        </button>
      </form>

      {showSuggestions && (
        <JobSearchSuggestion
          keyword={keyword}
          searchMode={searchMode}
          onSearchModeChange={onSearchModeChange}
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
