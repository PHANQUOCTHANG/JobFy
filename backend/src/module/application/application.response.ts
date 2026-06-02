export class ApplicationResponseDto {
  id: string;
  jobId: string;
  candidateId: string;
  resumeId: string | null;
  coverLetter: string | null;
  status: string;
  source: string | null;
  appliedAt: string;
  reviewedAt: string | null;
  updatedAt: string;

  // Relations
  job?: any;
  candidate?: any;
  resume?: any;
  reviewer?: any;
  notes?: any[];
  statusHistory?: any[];

  constructor(app: any) {
    this.id = app.id;
    this.jobId = app.jobId;
    this.candidateId = app.candidateId;
    this.resumeId = app.resumeId;
    this.coverLetter = app.coverLetter;
    this.status = app.status;
    this.source = app.source;
    this.appliedAt = app.appliedAt.toISOString();
    this.reviewedAt = app.reviewedAt ? app.reviewedAt.toISOString() : null;
    this.updatedAt = app.updatedAt.toISOString();

    if (app.job) this.job = app.job;
    if (app.candidate) this.candidate = app.candidate;
    if (app.resume) this.resume = app.resume;
    if (app.reviewer) {
      this.reviewer = {
        id: app.reviewer.id,
        email: app.reviewer.email,
      };
    }
    if (app.notes) {
      this.notes = app.notes.map((n: any) => ({
        ...n,
        createdAt: n.createdAt.toISOString()
      }));
    }
    if (app.statusHistory) {
      this.statusHistory = app.statusHistory.map((h: any) => ({
        ...h,
        changedAt: h.changedAt.toISOString()
      }));
    }
  }

  static from(app: any): ApplicationResponseDto {
    return new ApplicationResponseDto(app);
  }

  static fromList(apps: any[]): ApplicationResponseDto[] {
    return apps.map((app) => new ApplicationResponseDto(app));
  }
}
