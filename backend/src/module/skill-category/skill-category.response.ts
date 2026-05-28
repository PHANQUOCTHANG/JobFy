export class SkillCategoryResponseDto {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;

  constructor(category: any) {
    this.id = category.id;
    this.name = category.name;
    this.slug = category.slug;
    this.description = category.description;
    this.isActive = category.isActive;
    this.sortOrder = category.sortOrder;
    this.createdAt = category.createdAt.toISOString();
  }

  static from(category: any): SkillCategoryResponseDto {
    return new SkillCategoryResponseDto(category);
  }

  static fromList(categories: any[]): SkillCategoryResponseDto[] {
    return categories.map((c) => new SkillCategoryResponseDto(c));
  }
}
