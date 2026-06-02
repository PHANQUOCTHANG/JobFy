export class CandidateProfileResponseDto {
  id: string;
  userId: string;
  fullName: string;
  headline: string | null;
  gender: string | null;
  dob: string | null;
  provinceId: number | null;
  districtId: number | null;
  address: string | null;
  linkedinUrl: string | null;
  githubUrl: string | null;
  portfolioUrl: string | null;
  desiredJobTitle: string | null;
  desiredSalaryMin: number | null;
  desiredSalaryMax: number | null;
  desiredSalaryType: string | null;
  experienceLevel: string | null;
  isLooking: boolean;
  isProfilePublic: boolean;
  bio: string | null;
  profileViews: number;
  createdAt: string;
  updatedAt: string;

  constructor(profile: any) {
    this.id = profile.id;
    this.userId = profile.userId;
    this.fullName = profile.fullName;
    this.headline = profile.headline;
    this.gender = profile.gender;
    this.dob = profile.dob ? profile.dob.toISOString() : null;
    this.provinceId = profile.provinceId;
    this.districtId = profile.districtId;
    this.address = profile.address;
    this.linkedinUrl = profile.linkedinUrl;
    this.githubUrl = profile.githubUrl;
    this.portfolioUrl = profile.portfolioUrl;
    this.desiredJobTitle = profile.desiredJobTitle;
    this.desiredSalaryMin = profile.desiredSalaryMin;
    this.desiredSalaryMax = profile.desiredSalaryMax;
    this.desiredSalaryType = profile.desiredSalaryType;
    this.experienceLevel = profile.experienceLevel;
    this.isLooking = profile.isLooking;
    this.isProfilePublic = profile.isProfilePublic;
    this.bio = profile.bio;
    this.profileViews = profile.profileViews;
    this.createdAt = profile.createdAt.toISOString();
    this.updatedAt = profile.updatedAt.toISOString();
  }

  static from(profile: any): CandidateProfileResponseDto {
    return new CandidateProfileResponseDto(profile);
  }

  static fromList(profiles: any[]): CandidateProfileResponseDto[] {
    return profiles.map((p) => new CandidateProfileResponseDto(p));
  }
}
