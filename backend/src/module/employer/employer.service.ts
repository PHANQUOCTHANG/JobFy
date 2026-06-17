import { PrismaClient, CompanySize, Prisma } from "@prisma/client"; // Import Prisma để có thể dùng các kiểu Enum
import slugify from "slugify";
import AppError from "@/utils/appError";
import { UpdateCompanyInfoRequest, SubmitLegalDocsRequest } from "./employer.request";

export class EmployerVerificationService {
  constructor(private readonly prisma: PrismaClient) {}

  /**
   * Lấy thông tin hồ sơ công ty của chủ sở hữu
   */
  async getCompanyProfile(userId: string) {
    return this.prisma.company.findFirst({
      where: { ownerId: userId },
    });
  }

  /**
   * Bước 2: Cập nhật thông tin định danh doanh nghiệp
   */
  async updateCompanyProfile(userId: string, data: UpdateCompanyInfoRequest) {
    // Hàm ánh xạ giá trị chuỗi từ request (Zod) sang giá trị Enum của Prisma
    // Bạn CẦN ĐẢM BẢO các giá trị trong switch case khớp chính xác với ENUM trong schema.prisma
    const mapSizeToPrismaEnum = (size: string | undefined): CompanySize | null => {
      if (!size) return null;
      switch (size) {
        case '1_10': return CompanySize.value_1_10;
        case '11_50': return CompanySize.value_11_50;
        case '51_200': return CompanySize.value_51_200;
        case '201_500': return CompanySize.value_201_500;
        case '501_1000': return CompanySize.value_501_1000;
        case '1001_5000': return CompanySize.value_1001_5000;
        case '5000_plus': return CompanySize.value_5000_plus;
        default: return null; // Trả về null hoặc ném lỗi nếu giá trị không hợp lệ
      }
    };

    // Kiểm tra sự tồn tại của các khóa ngoại trước khi xử lý
    const [industry, province, district] = await Promise.all([
      this.prisma.industry.findUnique({ where: { id: data.industryId } }),
      this.prisma.province.findUnique({ where: { id: data.provinceId } }),
      this.prisma.district.findUnique({ where: { id: data.districtId } }),
    ]);

    if (!industry) throw new AppError(`Lĩnh vực kinh doanh (ID: ${data.industryId}) không tồn tại trong hệ thống`, 400);
    if (!province) throw new AppError(`Tỉnh/Thành phố (ID: ${data.provinceId}) không hợp lệ`, 400);
    if (!district) throw new AppError(`Quận/Huyện (ID: ${data.districtId}) không hợp lệ`, 400);

    // Kiểm tra thêm nếu district phải thuộc về province (tùy chọn nhưng nên có)
    if (district.provinceId !== data.provinceId) throw new AppError("Quận/Huyện không thuộc Tỉnh/Thành phố đã chọn", 400);

    const company = await this.prisma.company.findFirst({
      where: { ownerId: userId }
    });

    const companyData = {
      name: data.name,
      industryId: data.industryId,
      provinceId: data.provinceId,
      districtId: data.districtId,
      address: data.address,
      website: data.website || null,
      size: mapSizeToPrismaEnum(data.size),
      description: data.description,
      logoUrl: data.logoUrl,
      taxCode: data.taxCode,
      foundedYear: data.foundedYear,
      shortDescription: data.shortDescription,
      facebookUrl: data.facebookUrl,
      linkedinUrl: data.linkedinUrl,
      coverUrl: data.coverUrl,
    };

    if (!company) {
      const targetName = companyData.name;
      let slug = slugify(targetName, { lower: true, strict: true, locale: "vi" });
      const isSlugExist = await this.prisma.company.findFirst({ where: { slug } });
      if (isSlugExist) slug = `${slug}-${Date.now()}`;

      return this.prisma.company.create({
        data: {
          ...companyData,
          slug,
          ownerId: userId,
        },
      });
    }

    return this.prisma.company.update({
      where: { id: company.id },
      data: companyData,
    });
  }

  /**
   * Bước 3: Gửi hồ sơ pháp lý và chờ phê duyệt
   */
  async submitLegalVerification(userId: string, data: SubmitLegalDocsRequest) {
    const company = await this.prisma.company.findFirst({
      where: { ownerId: userId }
    });

    if (!company) throw new AppError("Vui lòng khởi tạo thông tin công ty trước", 400);

    return this.prisma.company.update({
      where: { id: company.id },
      data: {
        taxCode: data.taxCode,
        isVerified: false, // Chờ duyệt
        // Không ghi đè shortDescription ở đây nữa
      }
    });
  }

  /**
   * Lấy email của người dùng từ ID
   */
  async getUserEmail(userId: string): Promise<string> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { email: true }
    });
    if (!user) throw new AppError("Người dùng không tồn tại", 404);
    return user.email;
  }

  /**
   * Cập nhật trạng thái đã xác thực email
   */
  async markEmailAsVerified(userId: string) {
    return this.prisma.user.update({
      where: { id: userId },
      data: {
        emailVerified: true,
        // Nếu tài khoản đang ở trạng thái chờ xác thực, chuyển sang active
        status: "active" 
      }
    });
  }

  /**
   * Lấy tiến trình hiện tại cho UI EmployerSettingsPage
   */
  async getVerificationProgress(userId: string) {
    const [user, company] = await Promise.all([
      this.prisma.user.findUnique({
        where: { id: userId },
      }),
      this.prisma.company.findFirst({
        where: { ownerId: userId }
      })
    ]);

    if (!user) throw new AppError("User not found", 404);
    
    return {
      step1: {
        isCompleted: user.emailVerified,
        email: user.email
      },
      step2: {
        isCompleted: !!(company?.name && company?.address),
      },
      step3: {
        isVerified: company?.isVerified || false,
        hasTaxCode: !!company?.taxCode
      }
    };
  }
}