import Groq from "groq-sdk";
import { GenerateJDRequestDto, GenerateQuestionsRequestDto } from "./ai.request";
// pdf-parse v1.1.1 — plain async function
// eslint-disable-next-line @typescript-eslint/no-var-requires
const pdfParse = require("pdf-parse") as (buf: Buffer) => Promise<{ text: string }>;
// mammoth — extract text từ .docx
// eslint-disable-next-line @typescript-eslint/no-var-requires
const mammoth = require("mammoth") as { extractRawText(opts: { buffer: Buffer }): Promise<{ value: string }> };
// word-extractor — extract text từ .doc (binary Word format)
// eslint-disable-next-line @typescript-eslint/no-var-requires
const WordExtractor = require("word-extractor") as new () => { extract(buf: Buffer): Promise<{ getBody(): string }> };
const AdmZip = require("adm-zip") as new (buf: Buffer) => { getEntry(name: string): { getData(): Buffer } | null };

const GROQ_VISION_MODEL = "meta-llama/llama-4-scout-17b-16e-instruct";

function isCvImageMime(mimetype: string): boolean {
  return ["image/jpeg", "image/jpg", "image/pjpeg"].includes(mimetype);
}

function normalizeImageMime(mimetype: string): string {
  return mimetype === "image/jpg" || mimetype === "image/pjpeg" ? "image/jpeg" : mimetype;
}

function buildCvAnalysisPrompt(
  position: string,
  jobDescription: string | undefined,
  options: { cvText?: string; fromImage?: boolean },
): string {
  const jdSection = jobDescription
    ? `\nYêu cầu tuyển dụng cụ thể:\n${jobDescription}\n`
    : "\n(Không có mô tả công việc — hãy đánh giá theo tiêu chuẩn thị trường chung cho vị trí này)\n";

  const cvSection = options.fromImage
    ? "== ẢNH CV ỨNG VIÊN ==\nĐọc kỹ toàn bộ nội dung CV từ ảnh được cung cấp."
    : `== NỘI DUNG CV ỨNG VIÊN ==\n${options.cvText?.substring(0, 6000) ?? ""}`;

  return `Bạn là chuyên gia nhân sự (HR) cấp cao với 10+ năm kinh nghiệm tuyển dụng thực tế tại Việt Nam.
Hãy phân tích CV ứng viên và đánh giá mức độ phù hợp với vị trí tuyển dụng một cách KHÁCH QUAN và THỰC TẾ.

== VỊ TRÍ TUYỂN DỤNG ==
${position}
${jdSection}
${cvSection}
== HƯỚNG DẪN CHẤM ĐIỂM ==
Sử dụng thang điểm 0-100 theo tiêu chí thực tế:
- 85-100: Ứng viên xuất sắc, vượt yêu cầu, nên phỏng vấn ngay
- 70-84: Ứng viên tốt, đáp ứng đủ yêu cầu chính, nên phỏng vấn
- 55-69: Ứng viên khá, đáp ứng phần lớn yêu cầu, cân nhắc phỏng vấn
- 40-54: Ứng viên trung bình, thiếu một số kỹ năng quan trọng
- 0-39: Ứng viên chưa phù hợp, thiếu nhiều yêu cầu cơ bản

Lưu ý quan trọng:
- Một ứng viên có kinh nghiệm liên quan, kỹ năng phù hợp → điểm 70+
- Không phạt nếu CV không đề cập thông tin không liên quan đến vị trí
- Đánh giá dựa trên kinh nghiệm THỰC TẾ, không phải hình thức CV

== YÊU CẦU ĐẦU RA ==
Trả về JSON object thuần túy (không markdown, không giải thích thêm):
{"score":85,"summary":"Tóm tắt ngắn gọn về ứng viên","strengths":["Điểm mạnh 1","Điểm mạnh 2","Điểm mạnh 3"],"weaknesses":["Điểm cần cải thiện 1","Điểm cần cải thiện 2"],"recommendation":"Khuyến nghị tuyển dụng"}`;
}

function parseCvAnalysisResponse(raw: string): object {
  try {
    return JSON.parse(raw);
  } catch {
    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      try {
        return JSON.parse(jsonMatch[0]);
      } catch {
        console.error("[AI analyzeCv] JSON parse failed:", jsonMatch[0].substring(0, 200));
      }
    }
    console.warn("[AI analyzeCv] Falling back to raw text response");
    return { raw };
  }
}

/** Extract readable text from DOCX XML as fallback when mammoth returns empty */
function extractDocxXmlFallback(buffer: Buffer): string {
  try {
    const zip = new AdmZip(buffer);
    // DOCX main body
    const entries = ["word/document.xml", "word/body.xml"];
    for (const entryName of entries) {
      const entry = zip.getEntry(entryName);
      if (entry) {
        const xml = entry.getData().toString("utf-8");
        // Strip XML tags, decode common entities
        const text = xml
          .replace(/<w:p[ >]/g, "\n<w:p ") // preserve paragraph breaks
          .replace(/<[^>]+>/g, "")
          .replace(/&amp;/g, "&")
          .replace(/&lt;/g, "<")
          .replace(/&gt;/g, ">")
          .replace(/&quot;/g, '"')
          .replace(/&apos;/g, "'")
          .replace(/&#x([0-9A-Fa-f]+);/g, (_, h) => String.fromCharCode(parseInt(h, 16)))
          .replace(/[ \t]{2,}/g, " ")
          .replace(/\n{3,}/g, "\n\n")
          .trim();
        if (text.length > 20) return text;
      }
    }
  } catch (e) {
    console.warn("[AI analyzeCv] adm-zip fallback failed:", e);
  }
  return "";
}




export class AiService {
  private groq: Groq;

  constructor() {
    this.groq = new Groq({
      apiKey: process.env.GROQ_API_KEY,
    });
  }

  /** Phân tích CV ảnh (JPG) trực tiếp bằng Groq Vision */
  private async analyzeCvFromImage(data: {
    fileBuffer: Buffer;
    mimetype: string;
    position: string;
    jobDescription?: string;
  }): Promise<object> {
    const mimetype = normalizeImageMime(data.mimetype);
    const base64 = data.fileBuffer.toString("base64");
    const dataUrl = `data:${mimetype};base64,${base64}`;
    const prompt = buildCvAnalysisPrompt(data.position, data.jobDescription, { fromImage: true });

    try {
      const chatCompletion = await this.groq.chat.completions.create({
        messages: [
          {
            role: "system",
            content: "Bạn là chuyên gia HR chuyên nghiệp. Luôn trả về JSON object thuần túy, không thêm text hay markdown.",
          },
          {
            role: "user",
            content: [
              { type: "text", text: prompt },
              { type: "image_url", image_url: { url: dataUrl } },
            ],
          },
        ],
        model: GROQ_VISION_MODEL,
        temperature: 0.3,
        max_completion_tokens: 2048,
        response_format: { type: "json_object" },
      });

      const raw = chatCompletion.choices[0]?.message?.content?.trim() || "";
      console.log("[AI analyzeCv] JPG vision response:", raw.substring(0, 300));
      if (!raw) {
        throw new Error("AI không trả về kết quả phân tích cho ảnh CV.");
      }
      return parseCvAnalysisResponse(raw);
    } catch (error: any) {
      console.error("[AI analyzeCv] JPG vision error:", error);
      if (error?.status === 401) {
        throw new Error("GROQ_API_KEY không hợp lệ hoặc chưa được cấu hình trong .env");
      }
      if (error?.status === 413) {
        throw new Error("Ảnh CV quá lớn (tối đa 4MB cho JPG). Vui lòng nén ảnh và thử lại.");
      }
      if (error?.error?.code === "model_decommissioned" || error?.status === 404) {
        throw new Error("Model AI vision không khả dụng. Vui lòng thử lại sau.");
      }
      throw new Error("Không thể đọc ảnh CV. Vui lòng dùng ảnh rõ nét hoặc thử định dạng PDF.");
    }
  }

  async generateJD(data: GenerateJDRequestDto): Promise<string> {
    const prompt = `Bạn là một chuyên gia nhân sự (HR) chuyên nghiệp.
Hãy viết một bản mô tả công việc (Job Description) chi tiết, thu hút và chuyên nghiệp bằng tiếng Việt cho vị trí: ${data.title}.
Thông tin bổ sung:
- Kỹ năng yêu cầu: ${data.skills?.join(", ") || "Không yêu cầu cụ thể"}
- Cấp độ kinh nghiệm: ${data.experienceLevel || "Không yêu cầu cụ thể"}
- Loại công việc: ${data.jobType || "Không yêu cầu cụ thể"}
- Yêu cầu khác: ${data.description || "Không có"}

Job Description nên bao gồm các phần chính:
1. Giới thiệu chung về công việc
2. Trách nhiệm công việc (Responsibilities)
3. Yêu cầu công việc (Requirements/Qualifications)
4. Quyền lợi (Benefits)

Vui lòng trả về kết quả dưới định dạng Markdown hoặc văn bản dễ đọc. Nội dung trả về chỉ chứa JD, không thêm các câu giao tiếp thừa.`;

    try {
      const chatCompletion = await this.groq.chat.completions.create({
        messages: [{ role: "user", content: prompt }],
        model: "llama-3.3-70b-versatile",
        temperature: 0.7,
      });

      return chatCompletion.choices[0]?.message?.content || "Không thể sinh JD lúc này.";
    } catch (error: any) {
      console.error("Groq AI Error:", error);
      if (error?.status === 401) {
        throw new Error("GROQ_API_KEY không hợp lệ hoặc chưa được cấu hình trong .env");
      }
      throw new Error("Lỗi kết nối với AI. Vui lòng thử lại sau.");
    }
  }

  async generateInterviewQuestions(data: GenerateQuestionsRequestDto): Promise<string> {
    const prompt = `Bạn là một chuyên gia nhân sự và phỏng vấn viên cấp cao.
Hãy tạo một danh sách các câu hỏi phỏng vấn chất lượng cao bằng tiếng Việt dành cho vị trí: ${data.title}.
Thông tin bổ sung về vị trí:
- Kỹ năng yêu cầu: ${data.skills?.join(", ") || "Không có cụ thể"}
- Mô tả công việc: ${data.description || "Không có"}

Vui lòng cung cấp 10 câu hỏi phỏng vấn được chia thành các nhóm:
1. Câu hỏi phá băng (Ice-breaker) & Giới thiệu bản thân
2. Câu hỏi chuyên môn & Kỹ năng kỹ thuật (Technical skills)
3. Câu hỏi về kỹ năng mềm & Xử lý tình huống (Behavioral/Situational)
4. Câu hỏi về định hướng nghề nghiệp và sự phù hợp với văn hóa

Mỗi câu hỏi nên đi kèm với gợi ý ngắn gọn về những điểm cần chú ý trong câu trả lời của ứng viên.
Trả về dưới định dạng Markdown. Nội dung trả về chỉ chứa danh sách câu hỏi, không thêm các câu giao tiếp thừa.`;

    try {
      const chatCompletion = await this.groq.chat.completions.create({
        messages: [{ role: "user", content: prompt }],
        model: "llama-3.3-70b-versatile",
        temperature: 0.7,
      });

      return chatCompletion.choices[0]?.message?.content || "Không thể sinh câu hỏi phỏng vấn lúc này.";
    } catch (error: any) {
      console.error("Groq AI Error:", error);
      if (error?.status === 401) {
        throw new Error("GROQ_API_KEY không hợp lệ hoặc chưa được cấu hình trong .env");
      }
      throw new Error("Lỗi kết nối với AI. Vui lòng thử lại sau.");
    }
  }

  async analyzeCv(data: {
    fileBuffer: Buffer;
    mimetype: string;
    position: string;
    jobDescription?: string;
  }): Promise<object> {
    console.log("[AI analyzeCv] received mimetype:", data.mimetype, "| buffer size:", data.fileBuffer.length);

    if (isCvImageMime(data.mimetype)) {
      return this.analyzeCvFromImage(data);
    }

    // 1. Extract text từ file
    let cvText = "";
    try {
      if (data.mimetype === "application/pdf") {
        const parsed = await pdfParse(data.fileBuffer);
        cvText = parsed.text?.trim() || "";
        console.log("[AI analyzeCv] PDF extracted text length:", cvText.length, "| preview:", cvText.substring(0, 150));
      } else if (data.mimetype === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
        // DOCX (.docx) — mammoth trước, fallback sang adm-zip nếu rỗng
        const result = await mammoth.extractRawText({ buffer: data.fileBuffer });
        cvText = result.value?.trim() || "";
        console.log("[AI analyzeCv] DOCX mammoth length:", cvText.length);
        if (!cvText) {
          console.log("[AI analyzeCv] mammoth empty — trying adm-zip XML fallback...");
          cvText = extractDocxXmlFallback(data.fileBuffer);
          console.log("[AI analyzeCv] DOCX adm-zip fallback length:", cvText.length, "| preview:", cvText.substring(0, 150));
        }
      } else if (data.mimetype === "application/msword") {
        // DOC (.doc binary) — word-extractor trước, fallback sang raw text
        const extractor = new WordExtractor();
        const doc = await extractor.extract(data.fileBuffer);
        cvText = doc.getBody()?.trim() || "";
        console.log("[AI analyzeCv] DOC word-extractor length:", cvText.length, "| preview:", cvText.substring(0, 150));
        if (!cvText) {
          // Fallback: đọc raw text từ binary DOC (lọc bỏ control chars)
          cvText = data.fileBuffer
            .toString("latin1")
            .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x9F]/g, " ")
            .replace(/[ \t]{3,}/g, " ")
            .replace(/\n{3,}/g, "\n")
            .trim();
          // Chỉ giữ phần text có nội dung thực
          cvText = cvText.split("\n").filter(l => l.trim().length > 3).join("\n");
          console.log("[AI analyzeCv] DOC raw fallback length:", cvText.length);
        }
      } else {
        throw new Error("Định dạng file không được hỗ trợ. Vui lòng dùng PDF, DOCX, DOC hoặc JPG.");
      }
    } catch (parseErr: any) {
      if (parseErr.message?.includes("Định dạng")) throw parseErr;
      console.error("[AI analyzeCv] File parse error:", parseErr);
      throw new Error("Không thể đọc file CV. Vui lòng kiểm tra lại file.");
    }

    console.log("[AI analyzeCv] Final cvText length:", cvText.length);
    if (!cvText || cvText.length < 5) {
      throw new Error("Nội dung CV quá ngắn hoặc trống. Vui lòng kiểm tra lại file.");
    }


    // Kiểm tra chất lượng text — chỉ reject nếu gần như toàn binary garbage
    const readableChars = (cvText.match(/[\u0020-\u007E\u00C0-\u024F\u1EA0-\u1EF9\n\r\t]/g) || []).length;
    const readableRatio = readableChars / cvText.length;
    console.log("[AI analyzeCv] Text readability ratio:", readableRatio.toFixed(2), "| text length:", cvText.length);
    if (readableRatio < 0.3) {
      throw new Error("File chứa nội dung không đọc được (PDF scan ảnh, JPG mờ hoặc file bị lỗi). Vui lòng dùng file rõ nét hơn.");
    }

    const prompt = buildCvAnalysisPrompt(data.position, data.jobDescription, { cvText });

    try {
      const chatCompletion = await this.groq.chat.completions.create({
        messages: [
          {
            role: "system",
            content: "Bạn là chuyên gia HR chuyên nghiệp. Luôn trả về JSON object thuần túy, không thêm text hay markdown.",
          },
          { role: "user", content: prompt },
        ],
        model: "llama-3.3-70b-versatile",
        temperature: 0.3,
      });

      const raw = chatCompletion.choices[0]?.message?.content?.trim() || "";
      console.log("[AI analyzeCv] raw response:", raw.substring(0, 300));
      return parseCvAnalysisResponse(raw);
    } catch (error: any) {
      console.error("Groq AI Error (analyzeCv):", error);
      if (error?.status === 401) {
        throw new Error("GROQ_API_KEY không hợp lệ hoặc chưa được cấu hình trong .env");
      }
      throw new Error("Lỗi kết nối với AI khi phân tích CV. Vui lòng thử lại sau.");
    }
  }
}

