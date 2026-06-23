import Groq from 'groq-sdk';
import AppError from '@/utils/appError';
import { getSystemPrompt } from './ai.prompt';
import { 
  AiLanguage, 
  GenerateSummaryRequest, 
  ReviewCvRequest, 
  MatchJobRequest, 
  SuggestSkillsRequest, 
  GenerateCoverLetterRequest,
  GenerateFullCvRequest
} from './ai.type';

export class AiService {
  private groq: Groq;
  private model: string;

  constructor() {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      console.warn("GROQ_API_KEY is not defined in environment variables.");
    }
    this.groq = new Groq({ apiKey: apiKey || 'dummy-key-for-now' });
    this.model = process.env.GROQ_MODEL || 'llama-3.3-70b-versatile';
  }

  private async callGroq(systemPrompt: string, userPrompt: string, useJsonFormat: boolean = false) {
    try {
      const completion = await this.groq.chat.completions.create({
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        model: this.model,
        temperature: 0.7,
        max_tokens: 1024,
        response_format: useJsonFormat ? { type: 'json_object' } : { type: 'text' },
      });

      return completion.choices[0]?.message?.content || '';
    } catch (error: any) {
      console.error("Groq API Error:", error);
      throw new AppError("Lỗi kết nối AI Provider", 503);
    }
  }

  async generateCvSummary(data: GenerateSummaryRequest): Promise<{ summary: string }> {
    const language = data.language || 'vi';
    const prompts = getSystemPrompt(language);

    const userPrompt = `
Job Title: ${data.jobTitle || 'Chưa xác định'}
Experiences: ${JSON.stringify(data.experiences || [])}
Skills: ${JSON.stringify(data.skills || [])}
Educations: ${JSON.stringify(data.educations || [])}
    `;

    const content = await this.callGroq(prompts.summaryWriter, userPrompt);
    return { summary: content.trim() };
  }

  async reviewCv(data: ReviewCvRequest): Promise<any> {
    const language = data.language || 'vi';
    const prompts = getSystemPrompt(language);
    
    const userPrompt = `CV Data:\n${JSON.stringify(data.cvData)}`;
    
    const content = await this.callGroq(prompts.cvReviewer, userPrompt, true);
    try {
      return JSON.parse(content);
    } catch (e) {
      throw new AppError("Lỗi định dạng dữ liệu từ AI", 500);
    }
  }

  async matchJob(data: MatchJobRequest, cvData: any, jobData: any): Promise<any> {
    const language = data.language || 'vi';
    const prompts = getSystemPrompt(language);

    const userPrompt = `
CV Data: ${JSON.stringify(cvData)}
Job Requirements: ${JSON.stringify(jobData)}
    `;

    const content = await this.callGroq(prompts.jobMatcher, userPrompt, true);
    try {
      return JSON.parse(content);
    } catch (e) {
      throw new AppError("Lỗi định dạng dữ liệu từ AI", 500);
    }
  }

  async suggestSkills(data: SuggestSkillsRequest): Promise<string[]> {
    const language = data.language || 'vi';
    const prompts = getSystemPrompt(language);

    const userPrompt = `
Job Title: ${data.jobTitle}
Existing Skills: ${JSON.stringify(data.existingSkills)}
    `;

    const content = await this.callGroq(prompts.skillsSuggestor, userPrompt, true);
    try {
      const result = JSON.parse(content);
      // Fallback in case the model wraps it in an object instead of pure array
      if (Array.isArray(result)) return result;
      if (result.skills && Array.isArray(result.skills)) return result.skills;
      if (result.suggestedSkills && Array.isArray(result.suggestedSkills)) return result.suggestedSkills;
      return Object.values(result).find(val => Array.isArray(val)) as string[] || [];
    } catch (e) {
      console.error(e);
      throw new AppError("Lỗi định dạng dữ liệu từ AI", 500);
    }
  }

  async generateCoverLetter(cvData: any, jobData: any, language: AiLanguage = 'vi'): Promise<string> {
    const prompts = getSystemPrompt(language);
    
    const userPrompt = `
CV Data: ${JSON.stringify(cvData)}
Job Requirements: ${JSON.stringify(jobData)}
    `;

    const content = await this.callGroq(prompts.coverLetter, userPrompt);
    return content.trim();
  }

  async generateFullCv(data: GenerateFullCvRequest): Promise<any> {
    const language = data.language || 'vi';
    const prompts = getSystemPrompt(language);
    const userPrompt = `Input Data:\n${data.prompt}`;
    
    const content = await this.callGroq(prompts.cvGenerator, userPrompt, true);
    try {
      return JSON.parse(content);
    } catch (e) {
      console.error(e);
      throw new AppError("Lỗi định dạng dữ liệu từ AI", 500);
    }
  }

  async generateJd(data: any): Promise<string> {
    const systemPrompt = "Bạn là chuyên gia nhân sự. Hãy viết một bản mô tả công việc (Job Description) thật chuyên nghiệp, rõ ràng, chia làm các phần: Giới thiệu, Trách nhiệm công việc, Yêu cầu ứng viên, và Quyền lợi.";
    const userPrompt = `Vị trí: ${data.title}\nKỹ năng: ${data.skills?.join(', ')}\nCấp độ: ${data.experienceLevel}\nHình thức: ${data.jobType}\nYêu cầu thêm: ${data.description}`;
    const content = await this.callGroq(systemPrompt, userPrompt);
    return content.trim();
  }

  async generateQuestions(data: any): Promise<string> {
    const systemPrompt = "Bạn là chuyên gia phỏng vấn. Hãy tạo một bộ câu hỏi phỏng vấn gồm 5-7 câu hỏi chuyên sâu và tình huống thực tế dựa trên thông tin vị trí công việc.";
    const userPrompt = `Vị trí: ${data.title}\nKỹ năng trọng tâm: ${data.skills?.join(', ')}\nBối cảnh: ${data.description}`;
    const content = await this.callGroq(systemPrompt, userPrompt);
    return content.trim();
  }

  async analyzeCv(cvText: string, jobDescription: string, position: string): Promise<any> {
    const systemPrompt = `Bạn là chuyên gia tuyển dụng. Phân tích CV so với yêu cầu công việc.
Trả về JSON đúng chuẩn (không chứa markdown) với cấu trúc sau:
{
  "score": <số từ 0-100>,
  "summary": "<Tóm tắt 2-3 câu về ứng viên>",
  "strengths": ["<Điểm mạnh 1>", "<Điểm mạnh 2>"],
  "weaknesses": ["<Điểm yếu 1>", "<Điểm yếu 2>"],
  "recommendation": "<Đề xuất tuyển dụng ngắn gọn>"
}`;
    const userPrompt = `Vị trí: ${position}\n\nJD: ${jobDescription || 'Không có JD cụ thể'}\n\nCV Text: ${cvText}`;
    const content = await this.callGroq(systemPrompt, userPrompt, true);
    try {
      return JSON.parse(content);
    } catch (e) {
      console.error(e);
      throw new AppError("Lỗi định dạng dữ liệu từ AI", 500);
    }
  }
}
