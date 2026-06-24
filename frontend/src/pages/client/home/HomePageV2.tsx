import { useState } from "react";
import { X } from "lucide-react";
import { useHomeData } from "../../../features/home/hooks/useHomeData";

import { HomeHero } from "../../../features/home/components/HomeHero";
import { MarqueeStrip } from "../../../features/home/components/MarqueeStrip";
import { CategorySection } from "../../../features/home/components/CategorySection";
import { FeaturedJobs } from "../../../features/home/components/FeaturedJobs";
import { TopCompanies } from "../../../features/home/components/TopCompanies";
import { CvBuilderFeature } from "../../../features/home/components/CvBuilderFeature";
import { HowItWorks } from "../../../features/home/components/HowItWorks";
import { Testimonials } from "../../../features/home/components/Testimonials";
import { BlogSection } from "../../../features/home/components/BlogSection";
import { AppDownload } from "../../../features/home/components/AppDownload";
import { JobAlert } from "../../../features/home/components/JobAlert";
import { EmployerCTA } from "../../../features/home/components/EmployerCTA";

export default function HomePageV2() {
  const { isLoading, data, error } = useHomeData();
  const [annoBar, setAnnoBar] = useState(true);

  // Xóa màn hình loading toàn trang để nhường chỗ cho Skeleton load từng phần

  // Xóa phần báo lỗi trắng trang để giao diện vẫn hiển thị bình thường khi backend bị sập

  return (
    <div className="bg-[#F4F6FA] text-[#0F172A]" style={{ fontFamily: "'Manrope', sans-serif" }}>
      {annoBar && (
        <div className="bg-[#4F46E5] text-white text-center py-2.5 px-10 text-[13px] font-medium relative">
          🎉&nbsp;<strong>AI Match ra mắt</strong> — Tự động ghép việc làm phù hợp với hồ sơ của bạn. &nbsp;
          <a href="#" className="underline font-bold hover:no-underline">Thử ngay →</a>
          <button onClick={() => setAnnoBar(false)}
            className="absolute right-4 top-1/2 -translate-y-1/2 opacity-70 hover:opacity-100 p-1">
            <X size={15} />
          </button>
        </div>
      )}

      <HomeHero />
      <MarqueeStrip companies={data?.companies || []} />
      <CategorySection categories={data?.categories || []} />
      <FeaturedJobs jobs={data?.jobs || []} />
      <TopCompanies companies={data?.companies || []} />
      <CvBuilderFeature />
      <HowItWorks />
      <Testimonials testimonials={data?.testimonials || []} />
      <BlogSection articles={data?.articles || []} />
      <AppDownload />
      <JobAlert />
      <EmployerCTA />
    </div>
  );
}
