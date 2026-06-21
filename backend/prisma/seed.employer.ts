import { PrismaClient, JobStatus, ApplicationStatus, JobType, ExperienceLevel, SalaryType, CompanySize } from '@prisma/client';
import { fakerVI as faker } from '@faker-js/faker';

const prisma = new PrismaClient();

async function main() {
  console.log('🚀 Bắt đầu seed dữ liệu cho Employer Dashboard...');

  // 1. Lấy user Employer đầu tiên hoặc tạo mới
  let employerUser = await prisma.user.findFirst({
    where: { role: 'employer' },
  });

  if (!employerUser) {
    employerUser = await prisma.user.create({
      data: {
        email: 'employer.test@example.com',
        role: 'employer',
        status: 'active',
        emailVerified: true,
      },
    });
    console.log(`👤 Tạo mới Employer User: ${employerUser.email}`);
  } else {
    console.log(`👤 Tìm thấy Employer User: ${employerUser.email}`);
  }

  // 2. Tạo Company cho Employer
  let company = await prisma.company.findFirst({
    where: { ownerId: employerUser.id },
  });

  let industry = await prisma.industry.findFirst() || await prisma.industry.create({
    data: { name: 'Công nghệ thông tin', slug: 'it', sortOrder: 1 },
  });

  if (!company) {
    // Cần tạo Industry và Location trước (đơn giản hóa)
    const province = await prisma.province.findFirst() || await prisma.province.create({
      data: { name: 'Hà Nội', code: 'HN' },
    });

    company = await prisma.company.create({
      data: {
        ownerId: employerUser.id,
        name: 'Công ty Cổ phần ' + faker.company.name(),
        slug: faker.helpers.slugify(faker.company.name() + Date.now()).toLowerCase(),
        description: faker.lorem.paragraphs(2),
        shortDescription: faker.company.catchPhrase(),
        address: faker.location.streetAddress(),
        industryId: industry.id,
        provinceId: province.id,
        size: CompanySize.value_11_50,
        isVerified: true,
        logoUrl: faker.image.urlLoremFlickr({ category: 'business' }),
        website: faker.internet.url(),
      },
    });
    console.log(`🏢 Tạo mới Company: ${company.name}`);
  }

  // 3. Tạo Danh sách Candidate Users
  console.log('👥 Đang tạo 50 Candidates...');
  const candidates = [];
  for (let i = 0; i < 50; i++) {
    const user = await prisma.user.create({
      data: {
        email: faker.internet.email(),
        role: 'candidate',
        status: 'active',
      },
    });

    const profile = await prisma.candidateProfile.create({
      data: {
        userId: user.id,
        fullName: faker.person.fullName(),
        headline: faker.person.jobTitle(),
        experienceLevel: faker.helpers.arrayElement(Object.values(ExperienceLevel)),
        desiredSalaryMin: faker.number.int({ min: 10000000, max: 20000000 }),
        desiredSalaryMax: faker.number.int({ min: 25000000, max: 50000000 }),
      },
    });

    // Tạo Resume cho Candidate
    const resume = await prisma.resume.create({
      data: {
        candidateId: profile.id,
        title: 'CV Frontend Developer',
        isPrimary: true,
        fileUrl: 'https://example.com/cv.pdf',
      },
    });

    // Tạo skill ngẫu nhiên cho Resume
    const skillList = ['ReactJS', 'Node.js', 'Figma', 'Python', 'Marketing', 'UI/UX', 'SEO', 'DevOps', 'Sales', 'Data Analysis'];
    // Chọn 1-3 kỹ năng ngẫu nhiên
    const randomSkills = faker.helpers.arrayElements(skillList, faker.number.int({ min: 1, max: 3 }));
    
    for (const skillName of randomSkills) {
      let skill = await prisma.skill.findFirst({ where: { name: skillName } });
      if (!skill) {
        skill = await prisma.skill.create({
          data: { name: skillName, slug: faker.helpers.slugify(skillName).toLowerCase() },
        });
      }
      await prisma.resumeSkill.create({
        data: { resumeId: resume.id, skillId: skill.id },
      });
    }

    candidates.push({ user, profile, resume });
  }

  // 4. Tạo Jobs cho Company (Trong 12 tháng qua)
  console.log('💼 Đang tạo 20 Jobs...');
  const jobs = [];
  const category = await prisma.jobCategory.findFirst() || await prisma.jobCategory.create({
    data: { name: 'Software Engineer', slug: 'sw-eng', industryId: company.industryId || industry.id },
  });

  for (let i = 0; i < 20; i++) {
    const publishedAt = faker.date.past({ years: 1 });
    const expiresAt = new Date(publishedAt);
    expiresAt.setDate(expiresAt.getDate() + 30);

    const job = await prisma.jobs.create({
      data: {
        companyId: company.id,
        postedBy: employerUser.id,
        categoryId: category.id,
        title: faker.person.jobTitle(),
        slug: faker.helpers.slugify(faker.person.jobTitle() + Date.now()).toLowerCase(),
        description: faker.lorem.paragraphs(3),
        requirements: faker.lorem.paragraphs(2),
        benefits: faker.lorem.paragraphs(1),
        jobType: faker.helpers.arrayElement(Object.values(JobType)),
        experienceLevel: faker.helpers.arrayElement(Object.values(ExperienceLevel)),
        salaryMin: faker.number.int({ min: 10, max: 20 }) * 1000000,
        salaryMax: faker.number.int({ min: 25, max: 50 }) * 1000000,
        salaryType: SalaryType.monthly,
        status: faker.helpers.arrayElement([JobStatus.published, JobStatus.closed]),
        publishedAt: publishedAt,
        expiresAt: expiresAt,
        viewCount: faker.number.int({ min: 100, max: 5000 }),
        applyCount: 0,
        createdAt: publishedAt,
      },
    });
    jobs.push(job);
  }

  // 5. Tạo Applications (Rải rác trong 12 tháng)
  console.log('📄 Đang tạo hàng trăm Applications (CV ứng tuyển)...');
  const statuses = Object.values(ApplicationStatus);
  
  for (const job of jobs) {
    const applyCountForJob = faker.number.int({ min: 5, max: 25 });
    
    // Pick random candidates for this job
    const shuffledCandidates = [...candidates].sort(() => 0.5 - Math.random());
    const selectedCandidates = shuffledCandidates.slice(0, applyCountForJob);

    for (const cand of selectedCandidates) {
      // Ứng tuyển luôn xảy ra sau khi job published
      const appliedAt = faker.date.between({ from: job.publishedAt!, to: job.expiresAt! });
      const status = faker.helpers.arrayElement(statuses);

      const application = await prisma.application.create({
        data: {
          jobId: job.id,
          candidateId: cand.profile.id,
          resumeId: cand.resume.id,
          status: status,
          appliedAt: appliedAt,
        },
      });

      // Nếu trạng thái không phải pending, thêm ApplicationStatusHistory
      if (status !== 'pending') {
        const reviewedAt = new Date(appliedAt);
        reviewedAt.setDate(reviewedAt.getDate() + faker.number.int({ min: 1, max: 10 }));

        await prisma.application.update({
          where: { id: application.id },
          data: { reviewedAt, reviewedBy: employerUser.id },
        });

        await prisma.applicationStatusHistory.create({
          data: {
            applicationId: application.id,
            oldStatus: 'pending',
            newStatus: status,
            changedBy: employerUser.id,
            changedAt: reviewedAt,
          },
        });

        // Nếu trạng thái interviewed, tự động tạo ApplicationNote lịch phỏng vấn
        if (status === 'interviewed' || status === 'offered') {
          const scheduledAt = new Date(reviewedAt);
          scheduledAt.setDate(scheduledAt.getDate() + 3);

          await prisma.applicationNote.create({
            data: {
              applicationId: application.id,
              authorId: employerUser.id,
              content: JSON.stringify({
                scheduledAt: scheduledAt,
                duration: 60,
                type: 'online',
                location: 'Google Meet',
                note: 'Phỏng vấn Technical',
              }),
              isInternal: false,
              createdAt: reviewedAt,
            },
          });
        }
        
        // Randomly add internal notes
        if (faker.datatype.boolean()) {
          await prisma.applicationNote.create({
            data: {
              applicationId: application.id,
              authorId: employerUser.id,
              content: faker.lorem.sentence(),
              isInternal: true,
              createdAt: reviewedAt,
            },
          });
        }
      }
    }

    // Cập nhật lại applyCount cho Job
    await prisma.jobs.update({
      where: { id: job.id },
      data: { applyCount: applyCountForJob },
    });
  }

  console.log('✅ Đã seed dữ liệu thành công!');
}

main()
  .catch((e) => {
    console.error(e);
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
