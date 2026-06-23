import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, X, Sparkles, Send, Copy, Check, Loader2, RefreshCw, Briefcase, Tags, GraduationCap, Clock, FileText, Upload, UserCheck, TrendingUp, AlertCircle, Star, ChevronDown, ChevronUp } from "lucide-react";
import api from "@/lib/axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

// --- Types ---
interface CvAnalysisResult {
  score: number;          // 0-100 matching score
  summary: string;        // tóm tắt ứng viên
  strengths: string[];    // điểm mạnh
  weaknesses: string[];   // điểm cần cải thiện
  recommendation: string; // khuyến nghị tuyển dụng
  raw?: string;           // fallback nếu backend trả plain text
}

const ALLOWED_CV_EXTENSIONS = [".pdf", ".doc", ".docx", ".jpg", ".jpeg"];
const ALLOWED_CV_MIMES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "image/jpeg",
];

function isAllowedCvFile(file: File): boolean {
  const name = file.name.toLowerCase();
  return ALLOWED_CV_MIMES.includes(file.type) || ALLOWED_CV_EXTENSIONS.some((ext) => name.endsWith(ext));
}

export default function AiFloatingAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("jd");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState("");
  const [isCopied, setIsCopied] = useState(false);

  // Form states cho JD
  const [jdForm, setJdForm] = useState({
    title: "",
    skills: "",
    experienceLevel: "",
    jobType: "",
    description: "",
  });

  // Form states cho Questions
  const [qForm, setQForm] = useState({
    title: "",
    skills: "",
    description: "",
  });

  // --- CV Analysis states ---
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [cvJd, setCvJd] = useState("");
  const [cvPosition, setCvPosition] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [cvResult, setCvResult] = useState<CvAnalysisResult | null>(null);
  const [expandedSection, setExpandedSection] = useState<string | null>("strengths");
  const cvInputRef = useRef<HTMLInputElement>(null);

  const handleCopy = () => {
    if (!result) return;
    navigator.clipboard.writeText(result);
    setIsCopied(true);
    toast.success("Đã sao chép vào khay nhớ tạm!");
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleGenerateJD = async () => {
    if (!jdForm.title) {
      toast.error("Vui lòng nhập tiêu đề công việc");
      return;
    }
    setIsLoading(true);
    setResult("");
    try {
      const payload = {
        title: jdForm.title,
        skills: jdForm.skills ? jdForm.skills.split(",").map(s => s.trim()) : undefined,
        experienceLevel: jdForm.experienceLevel,
        jobType: jdForm.jobType,
        description: jdForm.description,
      };
      const res = await api.post("/ai/generate-jd", payload);
      if (res.data?.data) {
        setResult(res.data.data);
      } else {
        toast.error("Không có dữ liệu trả về.");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Lỗi khi sinh JD");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateQuestions = async () => {
    if (!qForm.title) {
      toast.error("Vui lòng nhập tiêu đề công việc");
      return;
    }
    setIsLoading(true);
    setResult("");
    try {
      const payload = {
        title: qForm.title,
        skills: qForm.skills ? qForm.skills.split(",").map(s => s.trim()) : undefined,
        description: qForm.description,
      };
      const res = await api.post("/ai/generate-questions", payload);
      if (res.data?.data) {
        setResult(res.data.data);
      } else {
        toast.error("Không có dữ liệu trả về.");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Lỗi khi sinh câu hỏi");
    } finally {
      setIsLoading(false);
    }
  };

  // --- CV Analysis handler ---
  const handleAnalyzeCv = async () => {
    if (!cvFile) {
      toast.error("Vui lòng tải lên CV của ứng viên");
      return;
    }
    if (!cvPosition) {
      toast.error("Vui lòng nhập vị trí tuyển dụng");
      return;
    }

    setIsLoading(true);
    setCvResult(null);
    try {
      const formData = new FormData();
      formData.append("cv", cvFile);
      if (cvJd) formData.append("jobDescription", cvJd);
      formData.append("position", cvPosition);

      const res = await api.post("/ai/analyze-cv", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const data = res.data?.data;
      if (data) {
        // Nếu backend trả structured JSON
        if (typeof data === "object") {
          setCvResult(data as CvAnalysisResult);
        } else {
          // Fallback: plain text
          setCvResult({ score: 0, summary: "", strengths: [], weaknesses: [], recommendation: "", raw: data });
        }
      } else {
        toast.error("Không có kết quả phân tích.");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Lỗi khi phân tích CV");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCvFileSelect = (file: File | undefined) => {
    if (!file) return;
    if (!isAllowedCvFile(file)) {
      toast.error("Chỉ hỗ trợ PDF, DOC, DOCX hoặc JPG");
      return;
    }
    const isJpg = file.type.startsWith("image/") || /\.jpe?g$/i.test(file.name);
    if (isJpg && file.size > 4 * 1024 * 1024) {
      toast.error("Ảnh JPG tối đa 4MB. Vui lòng nén ảnh và thử lại.");
      return;
    }
    setCvFile(file);
  };

  const handleCvDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleCvFileSelect(e.dataTransfer.files[0]);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return { text: "text-emerald-600", bg: "bg-emerald-500", ring: "ring-emerald-200" };
    if (score >= 60) return { text: "text-blue-600", bg: "bg-blue-500", ring: "ring-blue-200" };
    if (score >= 40) return { text: "text-amber-600", bg: "bg-amber-500", ring: "ring-amber-200" };
    return { text: "text-rose-600", bg: "bg-rose-500", ring: "ring-rose-200" };
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return "Phù hợp cao";
    if (score >= 60) return "Khá phù hợp";
    if (score >= 40) return "Phù hợp vừa";
    return "Chưa phù hợp";
  };

  const resetCv = () => {
    setCvFile(null);
    setCvJd("");
    setCvPosition("");
    setCvResult(null);
    setExpandedSection("strengths");
  };

  return (
    <>
      <div className="fixed bottom-6 right-6 z-[9999] font-sans">
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="absolute bottom-20 right-0 w-[420px] sm:w-[480px] bg-white border border-blue-100 rounded-3xl shadow-[0_20px_60px_-15px_rgba(37,99,235,0.2)] flex flex-col overflow-hidden"
              style={{ height: '680px', maxHeight: '88vh' }}
            >
              {/* Blue Header */}
              <div className="relative overflow-hidden bg-blue-600 text-white p-5 flex items-center justify-between z-10 shrink-0">
                <div className="absolute -top-12 -right-12 w-32 h-32 bg-blue-400 rounded-full mix-blend-screen filter blur-[30px] opacity-60"></div>
                <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-blue-500 rounded-full mix-blend-screen filter blur-[30px] opacity-60"></div>

                <div className="relative flex items-center gap-3 z-10">
                  <div className="bg-white/20 backdrop-blur-md p-2 rounded-xl border border-white/20 shadow-inner">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base tracking-tight text-white">JobFy AI</h3>
                    <p className="text-[11px] font-medium text-white/80 tracking-wider uppercase mt-0.5">Trợ lý tuyển dụng thông minh</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsOpen(false)}
                  className="relative z-10 text-white/80 hover:text-white hover:bg-white/20 rounded-full w-8 h-8 transition-colors"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              {/* Body */}
              <div className="flex-1 flex flex-col overflow-hidden bg-white">
                {/* JD/Questions: show result screen */}
                {result && activeTab !== "cv" ? (
                  <div className="flex flex-col h-full overflow-hidden bg-white">
                    <div className="flex items-center justify-between p-4 border-b border-slate-100 shrink-0 shadow-sm z-10">
                      <div className="flex items-center gap-2 text-blue-600">
                        <Check className="w-5 h-5" />
                        <h4 className="font-bold text-sm">Hoàn thành</h4>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={handleCopy} className="h-8 text-xs rounded-lg border-slate-200 hover:bg-slate-50 text-slate-700">
                          {isCopied ? <Check className="w-3.5 h-3.5 mr-1.5 text-blue-500" /> : <Copy className="w-3.5 h-3.5 mr-1.5 text-slate-500" />}
                          {isCopied ? "Đã chép" : "Sao chép"}
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => setResult("")} className="h-8 text-xs rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100">
                          <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
                          Làm lại
                        </Button>
                      </div>
                    </div>
                    <div className="flex-1 overflow-y-auto p-6 bg-slate-50">
                      <div className="text-[14px] leading-[1.7] whitespace-pre-wrap text-slate-700 selection:bg-blue-200 selection:text-blue-900 pb-8">
                        {result}
                      </div>
                    </div>
                  </div>
                ) : (
                  <Tabs value={activeTab} onValueChange={(v) => { setActiveTab(v); setResult(""); setCvResult(null); }} className="w-full flex-1 flex flex-col overflow-hidden">
                    <div className="px-5 pt-5 pb-2 shrink-0">
                      <TabsList className="w-full grid grid-cols-3 h-11 bg-slate-100 p-1 rounded-xl">
                        <TabsTrigger value="jd" className="rounded-lg text-xs font-semibold transition-all data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm">
                          Tạo JD
                        </TabsTrigger>
                        <TabsTrigger value="questions" className="rounded-lg text-xs font-semibold transition-all data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm">
                          Bộ câu hỏi
                        </TabsTrigger>
                        <TabsTrigger value="cv" className="rounded-lg text-xs font-semibold transition-all data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm">
                          Phân tích CV
                        </TabsTrigger>
                      </TabsList>
                    </div>

                    <div className="flex-1 overflow-y-auto px-5 py-2">

                      {/* JD Form */}
                      <TabsContent value="jd" className="mt-0 space-y-5 pb-5">
                        <div className="space-y-1.5">
                          <Label className="text-sm font-semibold text-slate-700 flex items-center gap-1.5">
                            <Briefcase className="w-4 h-4 text-blue-500" />
                            Tiêu đề vị trí <span className="text-red-500">*</span>
                          </Label>
                          <Input
                            placeholder="VD: Senior ReactJS Developer..."
                            value={jdForm.title}
                            onChange={(e) => setJdForm({ ...jdForm, title: e.target.value })}
                            className="h-11 bg-white border-slate-200 focus-visible:ring-blue-500 shadow-sm rounded-xl transition-all"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <Label className="text-sm font-semibold text-slate-700 flex items-center gap-1.5">
                            <Tags className="w-4 h-4 text-blue-500" />
                            Kỹ năng chuyên môn
                          </Label>
                          <Input
                            placeholder="React, TypeScript, Redux..."
                            value={jdForm.skills}
                            onChange={(e) => setJdForm({ ...jdForm, skills: e.target.value })}
                            className="h-11 bg-white border-slate-200 focus-visible:ring-blue-500 shadow-sm rounded-xl transition-all"
                          />
                          <p className="text-[11px] text-slate-500 mt-1 ml-1">Phân cách các kỹ năng bằng dấu phẩy</p>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <Label className="text-sm font-semibold text-slate-700 flex items-center gap-1.5">
                              <GraduationCap className="w-4 h-4 text-blue-500" />
                              Cấp độ
                            </Label>
                            <Input
                              placeholder="Junior, Middle..."
                              value={jdForm.experienceLevel}
                              onChange={(e) => setJdForm({ ...jdForm, experienceLevel: e.target.value })}
                              className="h-11 bg-white border-slate-200 focus-visible:ring-blue-500 shadow-sm rounded-xl transition-all"
                            />
                          </div>
                          <div className="space-y-1.5">
                            <Label className="text-sm font-semibold text-slate-700 flex items-center gap-1.5">
                              <Clock className="w-4 h-4 text-blue-500" />
                              Hình thức
                            </Label>
                            <Input
                              placeholder="Full-time, Remote..."
                              value={jdForm.jobType}
                              onChange={(e) => setJdForm({ ...jdForm, jobType: e.target.value })}
                              className="h-11 bg-white border-slate-200 focus-visible:ring-blue-500 shadow-sm rounded-xl transition-all"
                            />
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <Label className="text-sm font-semibold text-slate-700 flex items-center gap-1.5">
                            <FileText className="w-4 h-4 text-blue-500" />
                            Yêu cầu đặc biệt
                          </Label>
                          <Textarea
                            placeholder="Kinh nghiệm quản lý team, tiếng Anh giao tiếp..."
                            className="resize-none h-24 bg-white border-slate-200 focus-visible:ring-blue-500 shadow-sm rounded-xl transition-all"
                            value={jdForm.description}
                            onChange={(e) => setJdForm({ ...jdForm, description: e.target.value })}
                          />
                        </div>

                        <div className="pt-2">
                          <Button
                            className="w-full h-12 rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 border-0 flex items-center justify-center gap-2"
                            onClick={handleGenerateJD}
                            disabled={isLoading}
                          >
                            {isLoading ? <Loader2 className="w-5 h-5 animate-spin text-white" /> : (
                              <>
                                <Sparkles className="w-5 h-5 text-white" />
                                <span className="font-semibold text-base">Tạo Mô tả công việc</span>
                              </>
                            )}
                          </Button>
                        </div>
                      </TabsContent>

                      {/* Questions Form */}
                      <TabsContent value="questions" className="mt-0 space-y-5 pb-5">
                        <div className="space-y-1.5">
                          <Label className="text-sm font-semibold text-slate-700 flex items-center gap-1.5">
                            <Briefcase className="w-4 h-4 text-blue-500" />
                            Vị trí tuyển dụng <span className="text-red-500">*</span>
                          </Label>
                          <Input
                            placeholder="VD: Trưởng phòng Marketing"
                            value={qForm.title}
                            onChange={(e) => setQForm({ ...qForm, title: e.target.value })}
                            className="h-11 bg-white border-slate-200 focus-visible:ring-blue-500 shadow-sm rounded-xl transition-all"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <Label className="text-sm font-semibold text-slate-700 flex items-center gap-1.5">
                            <Tags className="w-4 h-4 text-blue-500" />
                            Kỹ năng trọng tâm
                          </Label>
                          <Input
                            placeholder="SEO, Content, Leadership..."
                            value={qForm.skills}
                            onChange={(e) => setQForm({ ...qForm, skills: e.target.value })}
                            className="h-11 bg-white border-slate-200 focus-visible:ring-blue-500 shadow-sm rounded-xl transition-all"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <Label className="text-sm font-semibold text-slate-700 flex items-center gap-1.5">
                            <FileText className="w-4 h-4 text-blue-500" />
                            Bối cảnh công việc (Tùy chọn)
                          </Label>
                          <Textarea
                            placeholder="Mô tả sơ lược quy mô team, sản phẩm công ty để AI sinh câu hỏi sát thực tế hơn..."
                            className="resize-none h-32 bg-white border-slate-200 focus-visible:ring-blue-500 shadow-sm rounded-xl transition-all"
                            value={qForm.description}
                            onChange={(e) => setQForm({ ...qForm, description: e.target.value })}
                          />
                        </div>

                        <div className="pt-2">
                          <Button
                            className="w-full h-12 rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 border-0 flex items-center justify-center gap-2"
                            onClick={handleGenerateQuestions}
                            disabled={isLoading}
                          >
                            {isLoading ? <Loader2 className="w-5 h-5 animate-spin text-white" /> : (
                              <>
                                <Sparkles className="w-5 h-5 text-white" />
                                <span className="font-semibold text-base">Sinh câu hỏi phỏng vấn</span>
                              </>
                            )}
                          </Button>
                        </div>
                      </TabsContent>

                      {/* ======================= CV ANALYSIS TAB ======================= */}
                      <TabsContent value="cv" className="mt-0 pb-5">
                        {cvResult ? (
                          /* ---- KẾT QUẢ PHÂN TÍCH ---- */
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-4"
                          >
                            {/* Score card */}
                            {cvResult.raw ? (
                              <div className="bg-slate-50 rounded-2xl p-4 text-[13px] leading-relaxed text-slate-700 whitespace-pre-wrap">
                                {cvResult.raw}
                              </div>
                            ) : (
                              <>
                                {/* Score ring */}
                                <div className="flex items-center gap-4 bg-gradient-to-br from-slate-50 to-blue-50/40 rounded-2xl p-4 border border-blue-100">
                                  <div className={`relative w-20 h-20 rounded-full ring-4 ${getScoreColor(cvResult.score).ring} flex items-center justify-center shrink-0 bg-white shadow-sm`}>
                                    <span className={`text-2xl font-black ${getScoreColor(cvResult.score).text}`}>{cvResult.score}</span>
                                    <span className={`absolute -bottom-0.5 text-[10px] font-bold ${getScoreColor(cvResult.score).text}`}>/ 100</span>
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-black uppercase tracking-wide text-white mb-2 ${getScoreColor(cvResult.score).bg}`}>
                                      <Star className="w-3 h-3" />
                                      {getScoreLabel(cvResult.score)}
                                    </div>
                                    <p className="text-[12.5px] text-slate-600 leading-snug line-clamp-3">{cvResult.summary}</p>
                                  </div>
                                </div>

                                {/* Score bar */}
                                <div className="px-1">
                                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                    <motion.div
                                      initial={{ width: 0 }}
                                      animate={{ width: `${cvResult.score}%` }}
                                      transition={{ duration: 1, ease: "easeOut" }}
                                      className={`h-full rounded-full ${getScoreColor(cvResult.score).bg}`}
                                    />
                                  </div>
                                </div>

                                {/* Strengths */}
                                {cvResult.strengths.length > 0 && (
                                  <div className="rounded-2xl border border-emerald-100 overflow-hidden">
                                    <button
                                      onClick={() => setExpandedSection(expandedSection === "strengths" ? null : "strengths")}
                                      className="w-full flex items-center justify-between px-4 py-3 bg-emerald-50 hover:bg-emerald-100/60 transition-colors"
                                    >
                                      <div className="flex items-center gap-2 text-emerald-700">
                                        <TrendingUp className="w-4 h-4" />
                                        <span className="text-[13px] font-bold">Điểm mạnh</span>
                                        <span className="text-[11px] bg-emerald-200 text-emerald-800 rounded-full px-1.5 py-0.5 font-bold">{cvResult.strengths.length}</span>
                                      </div>
                                      {expandedSection === "strengths" ? <ChevronUp className="w-4 h-4 text-emerald-600" /> : <ChevronDown className="w-4 h-4 text-emerald-600" />}
                                    </button>
                                    {expandedSection === "strengths" && (
                                      <div className="px-4 py-3 space-y-2 bg-white">
                                        {cvResult.strengths.map((s, i) => (
                                          <div key={i} className="flex items-start gap-2.5">
                                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                                            <p className="text-[12.5px] text-slate-700 leading-snug">{s}</p>
                                          </div>
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                )}

                                {/* Weaknesses */}
                                {cvResult.weaknesses.length > 0 && (
                                  <div className="rounded-2xl border border-amber-100 overflow-hidden">
                                    <button
                                      onClick={() => setExpandedSection(expandedSection === "weaknesses" ? null : "weaknesses")}
                                      className="w-full flex items-center justify-between px-4 py-3 bg-amber-50 hover:bg-amber-100/60 transition-colors"
                                    >
                                      <div className="flex items-center gap-2 text-amber-700">
                                        <AlertCircle className="w-4 h-4" />
                                        <span className="text-[13px] font-bold">Điểm cần cải thiện</span>
                                        <span className="text-[11px] bg-amber-200 text-amber-800 rounded-full px-1.5 py-0.5 font-bold">{cvResult.weaknesses.length}</span>
                                      </div>
                                      {expandedSection === "weaknesses" ? <ChevronUp className="w-4 h-4 text-amber-600" /> : <ChevronDown className="w-4 h-4 text-amber-600" />}
                                    </button>
                                    {expandedSection === "weaknesses" && (
                                      <div className="px-4 py-3 space-y-2 bg-white">
                                        {cvResult.weaknesses.map((w, i) => (
                                          <div key={i} className="flex items-start gap-2.5">
                                            <div className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                                            <p className="text-[12.5px] text-slate-700 leading-snug">{w}</p>
                                          </div>
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                )}

                                {/* Recommendation */}
                                {cvResult.recommendation && (
                                  <div className="rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50 to-indigo-50/40 p-4">
                                    <div className="flex items-center gap-2 text-blue-700 mb-2">
                                      <UserCheck className="w-4 h-4" />
                                      <span className="text-[13px] font-bold">Khuyến nghị tuyển dụng</span>
                                    </div>
                                    <p className="text-[12.5px] text-slate-700 leading-relaxed">{cvResult.recommendation}</p>
                                  </div>
                                )}
                              </>
                            )}

                            {/* Reset button */}
                            <Button
                              variant="outline"
                              className="w-full h-10 rounded-xl border-slate-200 text-slate-600 hover:bg-slate-50 text-sm font-semibold"
                              onClick={resetCv}
                            >
                              <RefreshCw className="w-4 h-4 mr-2" />
                              Phân tích CV khác
                            </Button>
                          </motion.div>
                        ) : (
                          /* ---- FORM PHÂN TÍCH ---- */
                          <div className="space-y-5">
                            {/* Upload area */}
                            <div className="space-y-1.5">
                              <Label className="text-sm font-semibold text-slate-700 flex items-center gap-1.5">
                                <FileText className="w-4 h-4 text-blue-500" />
                                File CV ứng viên <span className="text-red-500">*</span>
                              </Label>
                              <div
                                onClick={() => cvInputRef.current?.click()}
                                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                                onDragLeave={() => setIsDragging(false)}
                                onDrop={handleCvDrop}
                                className={`relative cursor-pointer border-2 border-dashed rounded-2xl transition-all duration-200 flex flex-col items-center justify-center gap-2 py-6 px-4
                                  ${isDragging
                                    ? "border-blue-400 bg-blue-50 scale-[1.01]"
                                    : cvFile
                                      ? "border-emerald-300 bg-emerald-50/60"
                                      : "border-slate-200 bg-slate-50/60 hover:border-blue-300 hover:bg-blue-50/40"
                                  }`}
                              >
                                <input
                                  ref={cvInputRef}
                                  type="file"
                                  accept=".pdf,.doc,.docx,.jpg,.jpeg,image/jpeg"
                                  className="hidden"
                                  onChange={(e) => {
                                    handleCvFileSelect(e.target.files?.[0]);
                                    e.target.value = "";
                                  }}
                                />
                                {cvFile ? (
                                  <>
                                    <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
                                      <Check className="w-5 h-5 text-emerald-600" />
                                    </div>
                                    <div className="text-center">
                                      <p className="text-[13px] font-bold text-emerald-700 truncate max-w-[260px]">{cvFile.name}</p>
                                      <p className="text-[11px] text-slate-500 mt-0.5">{(cvFile.size / 1024).toFixed(0)} KB — <span className="text-blue-500 font-medium cursor-pointer">Thay file khác</span></p>
                                    </div>
                                  </>
                                ) : (
                                  <>
                                    <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                                      <Upload className="w-5 h-5 text-blue-500" />
                                    </div>
                                    <div className="text-center">
                                      <p className="text-[13px] font-semibold text-slate-700">Kéo thả hoặc <span className="text-blue-600 underline underline-offset-2">chọn file</span></p>
                                      <p className="text-[11px] text-slate-400 mt-0.5">Hỗ trợ PDF, DOC, DOCX, JPG — tối đa 4MB (JPG) / 5MB (PDF, DOC)</p>
                                    </div>
                                  </>
                                )}
                              </div>
                            </div>

                            {/* Position */}
                            <div className="space-y-1.5">
                              <Label className="text-sm font-semibold text-slate-700 flex items-center gap-1.5">
                                <Briefcase className="w-4 h-4 text-blue-500" />
                                Vị trí tuyển dụng <span className="text-red-500">*</span>
                              </Label>
                              <Input
                                placeholder="VD: Backend Developer, Marketing Manager..."
                                value={cvPosition}
                                onChange={(e) => setCvPosition(e.target.value)}
                                className="h-11 bg-white border-slate-200 focus-visible:ring-blue-500 shadow-sm rounded-xl transition-all"
                              />
                            </div>

                            {/* JD context */}
                            <div className="space-y-1.5">
                              <Label className="text-sm font-semibold text-slate-700 flex items-center gap-1.5">
                                <Send className="w-4 h-4 text-blue-500" />
                                Mô tả công việc / Yêu cầu (Tùy chọn)
                              </Label>
                              <Textarea
                                placeholder="Paste mô tả công việc hoặc yêu cầu tuyển dụng để AI so khớp chính xác hơn..."
                                className="resize-none h-28 bg-white border-slate-200 focus-visible:ring-blue-500 shadow-sm rounded-xl transition-all text-[13px]"
                                value={cvJd}
                                onChange={(e) => setCvJd(e.target.value)}
                              />
                            </div>

                            {/* Submit */}
                            <Button
                              className="w-full h-12 rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 border-0 flex items-center justify-center gap-2"
                              onClick={handleAnalyzeCv}
                              disabled={isLoading || !cvFile}
                            >
                              {isLoading ? (
                                <>
                                  <Loader2 className="w-5 h-5 animate-spin text-white" />
                                  <span className="font-semibold text-base">Đang phân tích CV...</span>
                                </>
                              ) : (
                                <>
                                  <UserCheck className="w-5 h-5 text-white" />
                                  <span className="font-semibold text-base">Phân tích CV bằng AI</span>
                                </>
                              )}
                            </Button>

                            {/* Hint */}
                            <div className="flex items-start gap-2 bg-blue-50 rounded-xl p-3 border border-blue-100">
                              <Sparkles className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                              <p className="text-[11.5px] text-blue-700 leading-relaxed">
                                AI sẽ chấm điểm phù hợp, phân tích điểm mạnh/yếu và đưa ra khuyến nghị tuyển dụng chi tiết.
                              </p>
                            </div>
                          </div>
                        )}
                      </TabsContent>
                    </div>
                  </Tabs>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Floating Button */}
        <div className="relative group">
          {!isOpen && (
            <div className="absolute inset-0 rounded-full bg-blue-500/30 animate-ping" style={{ animationDuration: '3s' }}></div>
          )}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsOpen(!isOpen)}
            className={`relative w-16 h-16 rounded-full flex items-center justify-center shadow-[0_8px_30px_rgba(37,99,235,0.3)] transition-all duration-300 z-10 border border-white/10 ${
              isOpen
              ? "bg-slate-800 text-white shadow-xl hover:bg-slate-900"
              : "bg-blue-600 text-white hover:bg-blue-700 hover:shadow-[0_0_40px_rgba(37,99,235,0.5)]"
            }`}
          >
            {isOpen ? (
              <X className="w-7 h-7" />
            ) : (
              <div className="relative">
                <Sparkles className="absolute -top-1 -right-2 w-4 h-4 text-blue-200 animate-pulse" />
                <Bot className="w-8 h-8 drop-shadow-md" />
              </div>
            )}
          </motion.button>
        </div>
      </div>
    </>
  );
}
