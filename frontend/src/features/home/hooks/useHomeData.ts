import { Code2, Palette, BookOpen, Heart, Headphones, DollarSign, LineChart, TrendingUp } from "lucide-react";
import { Job, Testimonial, Article, Category, Company } from "../types";
import { useFeaturedJobs, useJobCategories } from "@/features/jobs/hooks/useJobs";
import { useCompanies } from "@/features/companies/hooks/useCompanies";
import { mockJobs } from "@/features/jobs/api/mockData";

interface HomeData {
  jobs: Job[];
  categories: Category[];
  companies: Company[];
  testimonials: Testimonial[];
  articles: Article[];
}

const MOCK_DATA: HomeData = {
  categories: [
    { id: 1, name: "Công nghệ thông tin",      count: 1234, icon: Code2 },
    { id: 2, name: "Marketing & Truyền thông",  count: 856,  icon: LineChart },
    { id: 3, name: "Thiết kế & Sáng tạo",      count: 432,  icon: Palette },
    { id: 4, name: "Giáo dục & Đào tạo",       count: 567,  icon: BookOpen },
    { id: 5, name: "Chăm sóc sức khỏe",        count: 789,  icon: Heart },
    { id: 6, name: "Dịch vụ khách hàng",       count: 345,  icon: Headphones },
    { id: 7, name: "Kinh doanh & Bán hàng",    count: 921,  icon: TrendingUp },
    { id: 8, name: "Tài chính & Kế toán",      count: 678,  icon: DollarSign },
  ],

  jobs: [
    {
      id: 1,
      title: "Senior React Developer",
      company: "FPT Software",
      location: "Hà Nội",
      salary: "25–40tr",
      type: "Full-time",
      tags: ["React", "TypeScript", "Node.js"],
      logo: "FPT",
      posted: "2 giờ",
      hot: true,
    },
    {
      id: 2,
      title: "Product Marketing Manager",
      company: "VNG Corporation",
      location: "TP. HCM",
      salary: "20–35tr",
      type: "Full-time",
      tags: ["Marketing", "Analytics", "SEO"],
      logo: "VNG",
      posted: "5 giờ",
    },
    {
      id: 3,
      title: "UX / UI Designer (Senior)",
      company: "Tiki",
      location: "TP. HCM",
      salary: "18–28tr",
      type: "Full-time",
      tags: ["Figma", "Design System"],
      logo: "TK",
      posted: "1 ngày",
    },
    {
      id: 4,
      title: "Data Analyst / BI Developer",
      company: "Grab Vietnam",
      location: "TP. HCM",
      salary: "18–32tr",
      type: "Remote",
      tags: ["Python", "SQL", "Power BI"],
      logo: "GR",
      posted: "2 ngày",
      remote: true,
    },
    {
      id: 5,
      title: "Backend Engineer (Golang)",
      company: "VNPAY",
      location: "Hà Nội",
      salary: "25–45tr",
      type: "Full-time",
      tags: ["Go", "Microservices", "K8s"],
      logo: "VP",
      posted: "3 ngày",
      hot: true,
    },
    {
      id: 6,
      title: "DevOps / Cloud Engineer",
      company: "MoMo",
      location: "TP. HCM",
      salary: "30–55tr",
      type: "Hybrid",
      tags: ["AWS", "Docker", "Terraform"],
      logo: "MM",
      posted: "4 ngày",
    },
  ],

  companies: [
    { name: "FPT Software",    industry: "Công nghệ",    openings: 45, logo: "FPT", bg: "#FF6B2C" },
    { name: "VNG Corporation", industry: "Công nghệ",    openings: 32, logo: "VNG", bg: "#0066FF" },
    { name: "Tiki",            industry: "E-Commerce",   openings: 28, logo: "TK",  bg: "#1A94FF" },
    { name: "Grab Vietnam",    industry: "Super App",    openings: 56, logo: "GR",  bg: "#00B14F" },
    { name: "VNPAY",           industry: "Fintech",      openings: 19, logo: "VP",  bg: "#E31837" },
    { name: "Shopee",          industry: "E-Commerce",   openings: 41, logo: "SP",  bg: "#F05A28" },
    { name: "MoMo",            industry: "Fintech",      openings: 24, logo: "MM",  bg: "#A50064" },
    { name: "Lazada",          industry: "E-Commerce",   openings: 33, logo: "LZ",  bg: "#0F146D" },
  ],

  testimonials: [
    {
      id: 1,
      name: "Nguyễn Minh Tuấn",
      role: "Senior Frontend Dev",
      company: "FPT Software",
      days: 14,
      avatarBg: "#7C3AED",
      avatar: "MT",
      quote: "Chỉ sau 2 tuần đăng hồ sơ, tôi nhận được 5 lời mời phỏng vấn với mức lương tăng 40%. JobFy không chỉ là nơi tìm việc — đây là nơi xây dựng sự nghiệp thực sự.",
    },
    {
      id: 2,
      name: "Trần Thị Lan Anh",
      role: "Marketing Manager",
      company: "VNG Corporation",
      days: 10,
      avatarBg: "#4F46E5",
      avatar: "LA",
      quote: "Tính năng gợi ý việc làm theo AI cực kỳ chính xác. Tôi không cần tìm nhiều — đúng vị trí phù hợp tự hiện ra. Quy trình ứng tuyển nhanh và chuyên nghiệp hơn bất kỳ platform nào tôi đã dùng.",
    },
    {
      id: 3,
      name: "Phạm Hữu Đức",
      role: "UX/UI Designer",
      company: "Tiki",
      days: 7,
      avatarBg: "#F59E0B",
      avatar: "HD",
      quote: "Kho việc làm ngành thiết kế rất phong phú và luôn cập nhật. Bộ lọc chi tiết giúp tôi tìm đúng vị trí Remote trong 7 ngày. Hồ sơ của tôi được xem hơn 200 lần trong tuần đầu tiên!",
    },
    {
      id: 4,
      name: "Lê Thanh Hương",
      role: "Data Analyst",
      company: "Grab Vietnam",
      days: 21,
      avatarBg: "#10B981",
      avatar: "TH",
      quote: "Tính năng so sánh lương theo thị trường giúp tôi có con số chính xác khi thương lượng. Kết quả: lương tăng 55% so với công ty cũ. Đây là khoản đầu tư thời gian xứng đáng nhất tôi từng làm.",
    },
  ],

  articles: [
    {
      id: 1,
      tag: "Kỹ năng",
      tagColor: "#4F46E5",
      emoji: "📝",
      title: "7 điều nhà tuyển dụng tìm kiếm trong CV của bạn năm 2024",
      excerpt: "Những thay đổi trong xu hướng tuyển dụng đòi hỏi CV không chỉ đẹp — mà còn phải kể đúng câu chuyện của bạn.",
      readTime: "5 phút đọc",
      date: "12 tháng 6, 2024",
    },
    {
      id: 2,
      tag: "Thương lượng lương",
      tagColor: "#F59E0B",
      emoji: "💰",
      title: "Cách thương lượng lương hiệu quả mà không làm mất lòng nhà tuyển dụng",
      excerpt: "Nghiên cứu cho thấy 73% nhà tuyển dụng kỳ vọng ứng viên thương lượng — nhưng ít người biết làm đúng cách.",
      readTime: "7 phút đọc",
      date: "8 tháng 6, 2024",
    },
    {
      id: 3,
      tag: "Phỏng vấn",
      tagColor: "#10B981",
      emoji: "🎯",
      title: "Bí quyết trả lời 'Điểm yếu của bạn là gì?' để gây ấn tượng với HR",
      excerpt: "Câu hỏi kinh điển nhưng vẫn khiến nhiều ứng viên mắc sai lầm. Đây là cách trả lời thông minh và chân thật.",
      readTime: "4 phút đọc",
      date: "3 tháng 6, 2024",
    },
  ],
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CATEGORY_ICONS: Record<string, any> = {
  "it": Code2,
  "marketing": LineChart,
  "design": Palette,
  "education": BookOpen,
  "healthcare": Heart,
  "customer-service": Headphones,
  "sales": TrendingUp,
  "finance": DollarSign,
};

export function useHomeData() {
  const { data: jobs, isLoading: isJobsLoading, error: jobsError } = useFeaturedJobs();
  const { data: rawCategories, isLoading: isCategoriesLoading, error: categoriesError } = useJobCategories();
  const { data: companies, isLoading: isCompaniesLoading, error: companiesError } = useCompanies();

  // Map category icons based on slug, fallback to Code2 if not found
  const categories = (rawCategories || []).map(cat => ({
    id: cat.id,
    name: cat.name,
    count: 0, // Backend doesn't return job count per category yet
    icon: CATEGORY_ICONS[cat.slug] || Code2,
  })).slice(0, 8);

  const LOGO_COLORS = ["#FF6B2C", "#0066FF", "#1A94FF", "#00B14F", "#E31837", "#F05A28", "#A50064", "#0F146D"];

  const companiesList = companies?.data || [];
  const mappedCompanies = companiesList.map((comp, idx) => {
    // Generate an abbreviation from the name (e.g. FPT Software -> FPT, VNG Corporation -> VNG)
    const words = comp.name.split(' ');
    const logoText = words.length > 1 ? (words[0][0] + words[1][0]).toUpperCase() : comp.name.substring(0, 3).toUpperCase();
    
    return {
      name: comp.name,
      industry: "Công nghệ", // Mock industry since it's not in RealCompany
      openings: comp.totalJobs || Math.floor(Math.random() * 50) + 10,
      logo: logoText,
      bg: LOGO_COLORS[idx % LOGO_COLORS.length]
    };
  });

  const isLoading = isJobsLoading || isCategoriesLoading || isCompaniesLoading;
  const error = jobsError || categoriesError || companiesError;

  const data = {
    jobs: jobs && jobs.length > 0 ? jobs : mockJobs.slice(0, 9), // Use RealJob mock from jobs.api
    categories: categories.length > 0 ? categories : MOCK_DATA.categories,
    companies: mappedCompanies.length > 0 ? mappedCompanies : MOCK_DATA.companies,
    testimonials: MOCK_DATA.testimonials,
    articles: MOCK_DATA.articles,
  };

  return { isLoading, data, error };
}
