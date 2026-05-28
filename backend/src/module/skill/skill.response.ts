export class SkillResponseDto {
  id: number;
  categoryId: number | null;
  name: string;
  slug: string;
  description: string | null;
  isVerified: boolean;
  usageCount: number;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;

  constructor(skill: any) {
    this.id = skill.id;
    this.categoryId = skill.categoryId;
    this.name = skill.name;
    this.slug = skill.slug;
    this.description = skill.description;
    this.isVerified = skill.isVerified;
    this.usageCount = skill.usageCount;
    this.isActive = skill.isActive;
    this.sortOrder = skill.sortOrder;
    this.createdAt = skill.createdAt.toISOString();
  }

  static from(skill: any): SkillResponseDto {
    return new SkillResponseDto(skill);
  }

  static fromList(skills: any[]): SkillResponseDto[] {
    return skills.map((s) => new SkillResponseDto(s));
  }
}
