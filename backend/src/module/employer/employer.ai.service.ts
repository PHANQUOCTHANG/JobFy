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
Bạn là một chuyên gia quản trị nhân sự cấp cao. Hãy xem xét số liệu tuyển dụng sau của một công ty:
- Tổng số chiến dịch/tin tuyển dụng: ${overview.totalJobs} (trong đó đang tuyển: ${overview.activeJobs})
- Tổng số lượt xem tin: ${overview.totalViews}
- Tổng số hồ sơ nhận được: ${overview.totalApplications}
- Trạng thái các hồ sơ (Phễu):
${pipeline.map((p) => `  + ${p.status}: ${p.count}`).join("\n")}

Dựa vào các số liệu trên, hãy viết ĐÚNG 2 CÂU ngắn gọn (dưới 40 từ) bằng tiếng Việt để đưa ra một nhận xét sắc bén và một đề xuất hành động (actionable advice) giúp công ty tối ưu hóa hiệu quả tuyển dụng. Trả lời trực tiếp, không cần chào hỏi, không dùng markdown.`;

      const chatCompletion = await this.groq.chat.completions.create({
        messages: [{ role: "user", content: prompt }],
        model: "llama-3.3-70b-versatile",
        temperature: 0.5,
        max_tokens: 150,
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

      const prompt = `
Bạn là một AI phân tích dữ liệu tuyển dụng. Dưới đây là danh sách các kỹ năng của tập ứng viên đang ứng tuyển:
[${skillsStr}]

Dựa vào danh sách kỹ năng này, hãy chọn ra 2 kỹ năng nổi bật nhất và đánh giá tỷ lệ phần trăm mức độ phù hợp/phổ biến của chúng. 
Hãy trả lời CHỈ BẰNG 1 JSON hợp lệ có định dạng chính xác như sau (không kèm theo bất kỳ văn bản nào khác, không có markdown formatting code blocks):
{
  "overview": "Một câu nhận xét ngắn (dưới 20 từ) về chất lượng kỹ năng của tập ứng viên này.",
  "skills": [
    { "name": "Tên kỹ năng 1", "percentage": "+X% Phù hợp", "match": X },
    { "name": "Tên kỹ năng 2", "percentage": "+Y% Phù hợp", "match": Y }
  ]
}
Giá trị X, Y là số nguyên từ 1 đến 99.`;

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

