export class ResumeResponseDto {
  id: string;
  candidateId: string;
  title: string;
  templateId: string | null;
  personalData: any | null;
  fileUrl: string | null;
  isPrimary: boolean;
  isPublic: boolean;
  viewCount: number;
  createdAt: string;
  updatedAt: string;
  
  // Relations (optional)
  educations?: any[];
  experiences?: any[];
  skills?: any[];
  certifications?: any[];
  projects?: any[];

  constructor(resume: any) {
    this.id = resume.id;
    this.candidateId = resume.candidateId;
    this.title = resume.title;
    this.templateId = resume.templateId || null;
    this.personalData = resume.personalData || null;
    this.fileUrl = resume.fileUrl;
    this.isPrimary = resume.isPrimary;
    this.isPublic = resume.isPublic;
    this.viewCount = resume.viewCount;
    this.createdAt = resume.createdAt.toISOString();
    this.updatedAt = resume.updatedAt.toISOString();

    if (resume.educations) {
      this.educations = resume.educations.map((e: any) => ({
        ...e,
        startDate: e.startDate.toISOString(),
        endDate: e.endDate ? e.endDate.toISOString() : null,
      }));
    }
    
    if (resume.experiences) {
      this.experiences = resume.experiences.map((e: any) => ({
        ...e,
        startDate: e.startDate.toISOString(),
        endDate: e.endDate ? e.endDate.toISOString() : null,
      }));
    }

    if (resume.skills) this.skills = resume.skills;
    if (resume.certifications) this.certifications = resume.certifications;
    if (resume.projects) this.projects = resume.projects;
  }

  static from(resume: any): ResumeResponseDto {
    return new ResumeResponseDto(resume);
  }

  static fromList(resumes: any[]): ResumeResponseDto[] {
    return resumes.map((r) => new ResumeResponseDto(r));
  }
}
