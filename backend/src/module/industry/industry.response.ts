export class IndustryResponseDto {
  id: number;
  name: string;
  slug: string;
  iconUrl: string | null;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;

  // Khởi tạo DTO từ object database, định dạng lại kiểu ngày tháng thành chuỗi ISO
  constructor(industry: any) {
    this.id = industry.id;
    this.name = industry.name;
    this.slug = industry.slug;
    this.iconUrl = industry.iconUrl;
    this.isActive = industry.isActive;
    this.sortOrder = industry.sortOrder;
    this.createdAt = industry.createdAt.toISOString();
  }

  // Chuyển đổi một bản ghi Industry (từ DB) thành Response DTO an toàn trả về cho client
  static from(industry: any): IndustryResponseDto {
    return new IndustryResponseDto(industry);
  }

  // Chuyển đổi một danh sách các bản ghi Industry thành danh sách Response DTO
  static fromList(industries: any[]): IndustryResponseDto[] {
    return industries.map((i) => new IndustryResponseDto(i));
  }
}
