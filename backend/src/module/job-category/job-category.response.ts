export class JobCategoryResponseDto {
  id: number;
  industryId: number;
  parentId: number | null;
  name: string;
  slug: string;
  description: string | null;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;

  // Khởi tạo DTO từ object database, định dạng lại kiểu ngày tháng thành chuỗi ISO
  constructor(category: any) {
    this.id = category.id;
    this.industryId = category.industryId;
    this.parentId = category.parentId;
    this.name = category.name;
    this.slug = category.slug;
    this.description = category.description;
    this.isActive = category.isActive;
    this.sortOrder = category.sortOrder;
    this.createdAt = category.createdAt.toISOString();
  }

  // Chuyển đổi một bản ghi JobCategory (từ DB) thành Response DTO an toàn trả về cho client
  static from(category: any): JobCategoryResponseDto {
    return new JobCategoryResponseDto(category);
  }

  // Chuyển đổi một danh sách các bản ghi JobCategory thành danh sách Response DTO
  static fromList(categories: any[]): JobCategoryResponseDto[] {
    return categories.map((c) => new JobCategoryResponseDto(c));
  }
}
