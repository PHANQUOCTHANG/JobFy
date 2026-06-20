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
}
