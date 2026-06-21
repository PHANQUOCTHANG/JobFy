import Groq from "groq-sdk";

export class EmployerAIService {
  private groq: Groq;

  constructor() {
    this.groq = new Groq({
      apiKey: process.env.GROQ_API_KEY,
    });
  }

  async generateRecruitmentAdvice(
    overview: any,
    pipeline: any[],
  ): Promise<string> {
    try {
      if (!process.env.GROQ_API_KEY) {
        return "Chưa cấu hình API Key cho AI. Đề xuất xem xét lại nội dung tin đăng hoặc sử dụng các gói đẩy tin để tiếp cận nhiều ứng viên hơn.";
      }

      if (overview.totalApplications === 0 && overview.totalJobs === 0) {
        return "Bạn chưa đăng bất kỳ tin tuyển dụng nào. Hãy bắt đầu bằng cách tạo một tin tuyển dụng hấp dẫn để thu hút nhân tài nhé!";
      }

      const prompt = `
Bạn là Giám đốc Nhân sự (CHRO) kiêm Chuyên gia Phân tích Dữ liệu AI. Dưới đây là dữ liệu tuyển dụng thực tế của công ty tôi:
- Tổng số chiến dịch đang chạy: ${overview.activeJobs} / ${overview.totalJobs}
- Lượt xem tin tuyển dụng: ${overview.totalViews}
- Số lượng CV nhận được: ${overview.totalApplications}
- Hiện trạng Phễu (Pipeline):
${pipeline.map((p) => `  + Vòng ${p.status}: ${p.count} ứng viên`).join("\n")}

Dựa vào số liệu trên, hãy đưa ra 1 đoạn phân tích SIÊU CHI TIẾT và ĐỘT PHÁ (khoảng 80-100 từ) bằng tiếng Việt.
Yêu cầu bắt buộc:
1. Phải nhắc trực tiếp đến CÁC CON SỐ ở trên để chứng minh bạn đang phân tích số liệu thật.
2. Nêu ra 1 "Điểm nghẽn" (Bottleneck) lớn nhất đang gặp phải trong phễu.
3. Đề xuất 1 giải pháp mang tính chiến lược, đột phá (ví dụ: thay đổi JD, chạy quảng cáo, tối ưu thời gian phản hồi).
4. Sử dụng emoji phù hợp (📈, ⚠️, 💡) để làm nổi bật văn bản.
Trả lời ngay nội dung, không cần dạo đầu. Không dùng markdown block code.`;

      const chatCompletion = await this.groq.chat.completions.create({
        messages: [{ role: "user", content: prompt }],
        model: "llama-3.3-70b-versatile",
        temperature: 0.7,
        max_tokens: 300,
      });

      return (
        chatCompletion.choices[0]?.message?.content?.trim() ||
        "Không thể tạo đề xuất AI lúc này."
      );
    } catch (error) {
      console.error("Lỗi khi gọi Groq AI:", error);
      // Fallback message in case of error
      return "Hệ thống AI đang bận. Đề xuất bạn hãy tiếp tục làm mới tin đăng và tối ưu hóa từ khóa để thu hút thêm ứng viên chất lượng.";
    }
  }

  async generateCandidateInsights(candidates: any[]): Promise<any> {
    try {
      if (!process.env.GROQ_API_KEY || candidates.length === 0) {
        return {
          overview: "Chưa đủ dữ liệu để AI phân tích.",
          skills: [
            { name: "Kỹ năng chuyên môn", percentage: "+0%", match: 0 }
          ]
        };
      }

      // Trích xuất các skill từ ứng viên
      const allSkills: string[] = [];
      candidates.forEach(app => {
        const primaryResume = app.candidate?.resumes?.[0];
        if (primaryResume?.skills) {
          primaryResume.skills.forEach((s: any) => {
            if (s.skill?.name) allSkills.push(s.skill.name);
          });
        }
      });

      // Rút gọn bớt dữ liệu để khỏi bị over token
      const skillsStr = allSkills.slice(0, 50).join(", ");

      const experienceLevels = candidates.map(c => c.candidate?.experienceLevel).filter(Boolean);
      const expCounts = experienceLevels.reduce((acc: any, curr: string) => {
        acc[curr] = (acc[curr] || 0) + 1;
        return acc;
      }, {});
      const expStr = Object.entries(expCounts).map(([level, count]) => `${level}: ${count}`).join(", ");

      const prompt = `
Bạn là Giám đốc Nhân sự (CHRO) phân tích tập dữ liệu ứng viên.
Các kỹ năng xuất hiện trong CV: [${skillsStr}].
Trình độ kinh nghiệm: ${expStr}.
Tổng số ứng viên: ${candidates.length}.

Hãy phân tích SÂU SẮC chất lượng của tập ứng viên này. Tìm ra những xu hướng kỹ năng nổi bật và điểm yếu nếu có.
Trả lời CHỈ BẰNG 1 JSON định dạng chính xác như sau:
{
  "overview": "Một đoạn nhận xét khoảng 30-40 từ đánh giá tổng quan trình độ, mức độ phù hợp của tập ứng viên và đề xuất hướng xử lý.",
  "skills": [
    { "name": "Kỹ năng mạnh nhất", "percentage": "+X% Phù hợp", "match": X },
    { "name": "Kỹ năng tiềm năng/Thiếu hụt", "percentage": "Y% Có kỹ năng này", "match": Y }
  ]
}
X, Y là số nguyên từ 1 đến 99.
Không kèm theo markdown hay văn bản ngoài JSON.`;

      const chatCompletion = await this.groq.chat.completions.create({
        messages: [{ role: "user", content: prompt }],
        model: "llama-3.3-70b-versatile",
        temperature: 0.2,
        max_tokens: 300,
        response_format: { type: "json_object" }
      });

      const responseContent = chatCompletion.choices[0]?.message?.content?.trim();
      if (!responseContent) throw new Error("No content");

      return JSON.parse(responseContent);
    } catch (error) {
      console.error("Lỗi khi gọi Groq AI Insights:", error);
      return {
        overview: "Hệ thống AI đang bận, không thể phân tích ngay lúc này.",
        skills: []
      };
    }
  }

  async generateJobDescription(jobTitle: string, requirements: string): Promise<string> {
    try {
      if (!process.env.GROQ_API_KEY) {
        return "Chưa cấu hình API Key. Không thể tạo mô tả tự động lúc này.";
      }

      const prompt = `Bạn là chuyên gia nhân sự. Hãy viết một đoạn Mô tả công việc (Job Description) ngắn gọn, chuyên nghiệp bằng tiếng Việt cho vị trí: "${jobTitle}".
      Yêu cầu thêm: ${requirements || 'Không có yêu cầu đặc biệt'}.
      Mô tả bao gồm 3 phần ngắn: 1. Giới thiệu chung, 2. Trách nhiệm chính (3-4 bullet points), 3. Yêu cầu (3-4 bullet points).
      Trả lời ngay nội dung, không cần dạo đầu.`;

      const chatCompletion = await this.groq.chat.completions.create({
        messages: [{ role: "user", content: prompt }],
        model: "llama-3.3-70b-versatile",
        temperature: 0.7,
        max_tokens: 500,
      });

      return chatCompletion.choices[0]?.message?.content?.trim() || "";
    } catch (error) {
      console.error("Lỗi khi gọi Groq AI Job Description:", error);
      return "";
    }
  }

  async analyzeApplicationFit(jobDescription: string, candidateResumeText: string): Promise<{score: number, analysis: string}> {
    try {
      if (!process.env.GROQ_API_KEY) {
        return { score: 0, analysis: "Chưa cấu hình API Key." };
      }

      const prompt = `Phân tích độ phù hợp của ứng viên với công việc.
      Mô tả công việc: ${jobDescription.substring(0, 1000)}
      CV Ứng viên: ${candidateResumeText.substring(0, 1000)}

      Hãy trả lời CHỈ BẰNG 1 JSON hợp lệ với định dạng:
      {
        "score": X, // X là số nguyên từ 1 đến 100 đánh giá mức độ phù hợp
        "analysis": "Một đoạn phân tích ngắn (dưới 50 từ) giải thích lý do cho điểm số này."
      }`;

      const chatCompletion = await this.groq.chat.completions.create({
        messages: [{ role: "user", content: prompt }],
        model: "llama-3.3-70b-versatile",
        temperature: 0.2,
        max_tokens: 200,
        response_format: { type: "json_object" }
      });

      const content = chatCompletion.choices[0]?.message?.content?.trim();
      if (!content) throw new Error("No content");
      return JSON.parse(content);
    } catch (error) {
      console.error("Lỗi khi gọi Groq AI Fit Analysis:", error);
      return { score: 0, analysis: "Không thể phân tích ngay lúc này do lỗi hệ thống AI." };
    }
  }

  async generateInterviewQuestions(jobTitle: string, skills: string[]): Promise<string[]> {
    try {
      if (!process.env.GROQ_API_KEY) {
        return ["Hãy chia sẻ về kinh nghiệm làm việc trước đây của bạn.", "Điểm mạnh và điểm yếu lớn nhất của bạn là gì?"];
      }

      const prompt = `Tạo danh sách 5 câu hỏi phỏng vấn kỹ thuật và văn hóa bằng tiếng Việt cho vị trí: "${jobTitle}".
      Các kỹ năng chính của ứng viên: ${skills.join(", ")}.
      
      Trả lời CHỈ BẰNG 1 JSON hợp lệ định dạng:
      {
        "questions": ["Câu 1", "Câu 2", "Câu 3", "Câu 4", "Câu 5"]
      }`;

      const chatCompletion = await this.groq.chat.completions.create({
        messages: [{ role: "user", content: prompt }],
        model: "llama-3.3-70b-versatile",
        temperature: 0.5,
        max_tokens: 300,
        response_format: { type: "json_object" }
      });

      const content = chatCompletion.choices[0]?.message?.content?.trim();
      if (!content) throw new Error("No content");
      const parsed = JSON.parse(content);
      return parsed.questions || [];
    } catch (error) {
      console.error("Lỗi khi gọi Groq AI Interview Questions:", error);
      return ["Bạn có thể mô tả chi tiết hơn về dự án gần đây nhất bạn tham gia không?"];
    }
  }
}

