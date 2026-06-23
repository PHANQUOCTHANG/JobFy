import * as bcrypt from 'bcrypt';
import { fakerVI as faker } from '@faker-js/faker';
import { PrismaClient, JobStatus, ApplicationStatus, JobType, ExperienceLevel, SalaryType, CompanySize, UserRole, UserStatus, GenderType, DegreeType, SkillLevel } from '@prisma/client';

const prisma = new PrismaClient();

const provinces = [
  { name: 'Hà Nội', code: 'HN', region: 'Miền Bắc' },
  { name: 'Hồ Chí Minh', code: 'HCM', region: 'Miền Nam' },
  { name: 'Đà Nẵng', code: 'DN', region: 'Miền Trung' },
  { name: 'Hải Phòng', code: 'HP', region: 'Miền Bắc' },
  { name: 'Cần Thơ', code: 'CT', region: 'Miền Nam' },
  { name: 'An Giang', code: 'AG', region: 'Miền Nam' },
  { name: 'Bà Rịa - Vũng Tàu', code: 'BRVT', region: 'Miền Nam' },
  { name: 'Bắc Giang', code: 'BG', region: 'Miền Bắc' },
  { name: 'Bắc Kạn', code: 'BK', region: 'Miền Bắc' },
  { name: 'Bạc Liêu', code: 'BL', region: 'Miền Nam' },
  { name: 'Bắc Ninh', code: 'BN', region: 'Miền Bắc' },
  { name: 'Bến Tre', code: 'BT', region: 'Miền Nam' },
  { name: 'Bình Định', code: 'BD', region: 'Miền Trung' },
  { name: 'Bình Dương', code: 'BDU', region: 'Miền Nam' },
  { name: 'Bình Phước', code: 'BP', region: 'Miền Nam' },
  { name: 'Bình Thuận', code: 'BTH', region: 'Miền Trung' },
  { name: 'Cà Mau', code: 'CM', region: 'Miền Nam' },
  { name: 'Cao Bằng', code: 'CB', region: 'Miền Bắc' },
  { name: 'Đắk Lắk', code: 'DL', region: 'Miền Trung' },
  { name: 'Đắk Nông', code: 'DN2', region: 'Miền Trung' },
  { name: 'Điện Biên', code: 'DB', region: 'Miền Bắc' },
  { name: 'Đồng Nai', code: 'DN3', region: 'Miền Nam' },
  { name: 'Đồng Tháp', code: 'DT', region: 'Miền Nam' },
  { name: 'Gia Lai', code: 'GL', region: 'Miền Trung' },
  { name: 'Hà Giang', code: 'HG', region: 'Miền Bắc' },
  { name: 'Hà Nam', code: 'HNam', region: 'Miền Bắc' },
  { name: 'Hà Tây', code: 'HT', region: 'Miền Bắc' },
  { name: 'Hà Tĩnh', code: 'HT2', region: 'Miền Trung' },
  { name: 'Hải Dương', code: 'HD', region: 'Miền Bắc' },
  { name: 'Hậu Giang', code: 'HG2', region: 'Miền Nam' },
  { name: 'Hòa Bình', code: 'HB', region: 'Miền Bắc' },
  { name: 'Hưng Yên', code: 'HY', region: 'Miền Bắc' },
  { name: 'Khánh Hòa', code: 'KH', region: 'Miền Trung' },
  { name: 'Kiên Giang', code: 'KG', region: 'Miền Nam' },
  { name: 'Kon Tum', code: 'KT', region: 'Miền Trung' },
  { name: 'Lai Châu', code: 'LC', region: 'Miền Bắc' },
  { name: 'Lâm Đồng', code: 'LD', region: 'Miền Trung' },
  { name: 'Lạng Sơn', code: 'LS', region: 'Miền Bắc' },
  { name: 'Lào Cai', code: 'LC2', region: 'Miền Bắc' },
  { name: 'Long An', code: 'LA', region: 'Miền Nam' },
  { name: 'Nam Định', code: 'ND', region: 'Miền Bắc' },
  { name: 'Nghệ An', code: 'NA', region: 'Miền Trung' },
  { name: 'Ninh Bình', code: 'NB', region: 'Miền Bắc' },
  { name: 'Ninh Thuận', code: 'NT', region: 'Miền Trung' },
  { name: 'Phú Thọ', code: 'PT', region: 'Miền Bắc' },
  { name: 'Phú Yên', code: 'PY', region: 'Miền Trung' },
  { name: 'Quảng Bình', code: 'QB', region: 'Miền Trung' },
  { name: 'Quảng Nam', code: 'QNam', region: 'Miền Trung' },
  { name: 'Quảng Ngãi', code: 'QNG', region: 'Miền Trung' },
  { name: 'Quảng Ninh', code: 'QN', region: 'Miền Bắc' },
  { name: 'Quảng Trị', code: 'QT', region: 'Miền Trung' },
  { name: 'Sóc Trăng', code: 'ST', region: 'Miền Nam' },
  { name: 'Sơn La', code: 'SL', region: 'Miền Bắc' },
  { name: 'Tây Ninh', code: 'TN', region: 'Miền Nam' },
  { name: 'Thái Bình', code: 'TB', region: 'Miền Bắc' },
  { name: 'Thái Nguyên', code: 'TNG', region: 'Miền Bắc' },
  { name: 'Thanh Hóa', code: 'TH', region: 'Miền Trung' },
  { name: 'Thừa Thiên - Huế', code: 'TTH', region: 'Miền Trung' },
  { name: 'Tiền Giang', code: 'TG', region: 'Miền Nam' },
  { name: 'Tuyên Quang', code: 'TQ', region: 'Miền Bắc' },
  { name: 'Vĩnh Long', code: 'VL', region: 'Miền Nam' },
  { name: 'Vĩnh Phúc', code: 'VP', region: 'Miền Bắc' },
  { name: 'Yên Bái', code: 'YB', region: 'Miền Bắc' },
];

async function main() {
  console.log('🌱 Bắt đầu quá trình Reset và Seed toàn bộ dữ liệu (Master Seed)...');

  // 1. Provinces
  console.log('📍 Seeding Provinces...');
  for (const province of provinces) {
    await prisma.province.upsert({
      where: { code: province.code },
      update: {},
      create: { name: province.name, code: province.code, region: province.region },
    });
  }

  // Mật khẩu mặc định: 12345678
  const defaultPassword = await bcrypt.hash('12345678', 10);

  // 2. Admin User
  console.log('👑 Seeding Admin...');
  await prisma.user.upsert({
    where: { email: 'admin@jobfy.vn' },
    update: {
      passwordHash: defaultPassword,
    },
    create: {
      email: 'admin@jobfy.vn',
      passwordHash: defaultPassword,
      role: 'admin',
      status: 'active',
      emailVerified: true,
    }
  });

  // 3. Industries & Categories
  console.log('🏢 Seeding Industries & Job Categories...');
  const industries = [
    { name: 'Công nghệ thông tin', slug: 'it', categories: ['Software Engineer', 'Frontend Developer', 'Backend Developer', 'DevOps', 'Data Scientist'] },
    { name: 'Marketing & PR', slug: 'marketing', categories: ['Digital Marketing', 'Content Creator', 'SEO Specialist', 'Event Manager'] },
    { name: 'Kế toán & Tài chính', slug: 'finance', categories: ['Kế toán tổng hợp', 'Chuyên viên tài chính', 'Kiểm toán viên'] },
    { name: 'Thiết kế & Nghệ thuật', slug: 'design', categories: ['UI/UX Designer', 'Graphic Designer', 'Video Editor'] },
    { name: 'Kinh doanh & Bán hàng', slug: 'sales', categories: ['Nhân viên kinh doanh', 'Quản lý bán hàng', 'Tư vấn viên'] },
  ];

  const dbIndustries = [];
  const dbCategories = [];
  for (const ind of industries) {
    const industry = await prisma.industry.upsert({
      where: { slug: ind.slug },
      update: {},
      create: { name: ind.name, slug: ind.slug, sortOrder: 1 }
    });
    dbIndustries.push(industry);
    for (const catName of ind.categories) {
      const slug = faker.helpers.slugify(catName).toLowerCase();
      const cat = await prisma.jobCategory.upsert({
        where: { slug },
        update: {},
        create: { name: catName, slug, industryId: industry.id }
      });
      dbCategories.push(cat);
    }
  }

  // 4. Skills
  console.log('🎯 Seeding Skills...');
  const skillList = ['ReactJS', 'Node.js', 'Python', 'Java', 'UI/UX', 'SEO', 'Marketing', 'Sales', 'Figma', 'Photoshop', 'English', 'Communication', 'Leadership', 'Data Analysis', 'Docker'];
  const dbSkills = [];
  for (const skillName of skillList) {
    const slug = faker.helpers.slugify(skillName).toLowerCase();
    const skill = await prisma.skill.upsert({
      where: { slug },
      update: {},
      create: { name: skillName, slug }
    });
    dbSkills.push(skill);
  }

  // 5. Employers & Companies
  console.log('👔 Seeding Employers & Companies (10)...');
  const dbCompanies = [];
  const dbEmployers = [];
  const allProvinces = await prisma.province.findMany();

  for (let i = 1; i <= 10; i++) {
    const email = `employer${i}@jobfy.vn`;
    const empUser = await prisma.user.upsert({
      where: { email },
      update: {},
      create: {
        email,
        passwordHash: defaultPassword,
        role: 'employer',
        status: 'active',
        emailVerified: true,
      }
    });
    dbEmployers.push(empUser);

    const ind = faker.helpers.arrayElement(dbIndustries);
    const prov = faker.helpers.arrayElement(allProvinces);
    const companyName = faker.company.name() + " " + i;

    const company = await prisma.company.upsert({
      where: { slug: faker.helpers.slugify(companyName).toLowerCase() },
      update: {},
      create: {
        ownerId: empUser.id,
        name: companyName,
        slug: faker.helpers.slugify(companyName).toLowerCase(),
        description: faker.lorem.paragraphs(2),
        shortDescription: faker.company.catchPhrase(),
        address: faker.location.streetAddress(),
        industryId: ind.id,
        provinceId: prov.id,
        size: faker.helpers.arrayElement(Object.values(CompanySize)),
        isVerified: true,
        logoUrl: faker.image.urlLoremFlickr({ category: 'business' }),
        website: faker.internet.url(),
      }
    });
    dbCompanies.push(company);
  }

  // 6. Candidates
  console.log('🧑‍🎓 Seeding Candidates (100)...');
  const dbCandidates = [];
  for (let i = 1; i <= 100; i++) {
    const email = `candidate${i}@jobfy.vn`;
    const candUser = await prisma.user.upsert({
      where: { email },
      update: {},
      create: {
        email,
        passwordHash: defaultPassword,
        role: 'candidate',
        status: 'active',
        emailVerified: true,
      }
    });

    const candProfile = await prisma.candidateProfile.upsert({
      where: { userId: candUser.id },
      update: {},
      create: {
        userId: candUser.id,
        fullName: faker.person.fullName(),
        headline: faker.person.jobTitle(),
        gender: faker.helpers.arrayElement(Object.values(GenderType)),
        experienceLevel: faker.helpers.arrayElement(Object.values(ExperienceLevel)),
        desiredSalaryMin: faker.number.int({ min: 8, max: 15 }) * 1000000,
        desiredSalaryMax: faker.number.int({ min: 20, max: 40 }) * 1000000,
        provinceId: faker.helpers.arrayElement(allProvinces).id,
      }
    });

    const resume = await prisma.resume.findFirst({ where: { candidateId: candProfile.id, isPrimary: true } }) 
      || await prisma.resume.create({
      data: {
        candidateId: candProfile.id,
        title: 'CV - ' + candProfile.fullName,
        isPrimary: true,
        fileUrl: 'https://example.com/cv.pdf',
      }
    });

    // Add random skills to resume
    await prisma.resumeSkill.deleteMany({ where: { resumeId: resume.id } });
    const randomSkills = faker.helpers.arrayElements(dbSkills, faker.number.int({ min: 2, max: 5 }));
    for (const sk of randomSkills) {
      await prisma.resumeSkill.create({
        data: { resumeId: resume.id, skillId: sk.id }
      });
    }

    dbCandidates.push({ profile: candProfile, resume });
  }

  // 7. Jobs
  console.log('💼 Seeding Jobs (50)...');
  const dbJobs = [];
  for (let i = 1; i <= 50; i++) {
    const comp = faker.helpers.arrayElement(dbCompanies);
    const cat = faker.helpers.arrayElement(dbCategories);
    const publishedAt = faker.date.recent({ days: 30 });
    const expiresAt = new Date(publishedAt);
    expiresAt.setDate(expiresAt.getDate() + 30);
    const title = faker.person.jobTitle() + " " + i;

    const job = await prisma.jobs.create({
      data: {
        companyId: comp.id,
        postedBy: comp.ownerId,
        categoryId: cat.id,
        title: title,
        slug: faker.helpers.slugify(title + Date.now()).toLowerCase(),
        description: faker.lorem.paragraphs(3),
        requirements: faker.lorem.paragraphs(2),
        benefits: faker.lorem.paragraphs(1),
        jobType: faker.helpers.arrayElement(Object.values(JobType)),
        experienceLevel: faker.helpers.arrayElement(Object.values(ExperienceLevel)),
        salaryMin: faker.number.int({ min: 10, max: 15 }) * 1000000,
        salaryMax: faker.number.int({ min: 20, max: 40 }) * 1000000,
        salaryType: SalaryType.monthly,
        status: JobStatus.published,
        publishedAt: publishedAt,
        expiresAt: expiresAt,
        provinceId: comp.provinceId,
        viewCount: faker.number.int({ min: 50, max: 1000 }),
      }
    });
    dbJobs.push(job);
  }

  // 8. Applications
  console.log('📄 Seeding Applications...');
  const statuses = Object.values(ApplicationStatus);
  for (const job of dbJobs) {
    const applyCount = faker.number.int({ min: 2, max: 15 });
    const shuffledCands = [...dbCandidates].sort(() => 0.5 - Math.random());
    const selected = shuffledCands.slice(0, applyCount);

    for (const cand of selected) {
      const appliedAt = faker.date.between({ from: job.publishedAt!, to: new Date() });
      const status = faker.helpers.arrayElement(statuses);
      
      const app = await prisma.application.create({
        data: {
          jobId: job.id,
          candidateId: cand.profile.id,
          resumeId: cand.resume.id,
          status: status,
          appliedAt: appliedAt,
        }
      });

      if (status !== 'pending') {
        await prisma.applicationStatusHistory.create({
          data: {
            applicationId: app.id,
            oldStatus: 'pending',
            newStatus: status,
            changedBy: job.postedBy,
            changedAt: new Date(appliedAt.getTime() + 86400000), // +1 day
          }
        });
      }
    }

    // Update job apply count
    await prisma.jobs.update({
      where: { id: job.id },
      data: { applyCount }
    });
  }

  console.log('✅ SEED TOÀN BỘ DỮ LIỆU HOÀN TẤT!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
