import { Application } from "express";
import userRoute from "@/module/user/user.route";
import authRoute from "@/module/auth/auth.routes";
import industryRoute from "@/module/industry/industry.route";
import jobCategoryRoute from "@/module/job-category/job-category.route";
import skillCategoryRoute from "@/module/skill-category/skill-category.route";
import skillRoute from "@/module/skill/skill.route";
import companyRoute from "@/module/company/company.route";
import candidateProfileRoute from "@/module/candidate-profile/candidate-profile.route";
import resumeRoute from "@/module/resume/resume.route";
import jobRoute from "@/module/job/job.route";
import applicationRoute from "@/module/application/application.route";
import { requireAuth } from "@/middleware/auth.middleware";

const clientRoute = (app: Application) => {
  const path = "/api/v1";
  app.use(path + "/users", requireAuth, userRoute);
  app.use(path + "/auth", authRoute);
  
  // Modules
  app.use(path + "/industries", industryRoute);
  app.use(path + "/job-categories", jobCategoryRoute);
  app.use(path + "/skill-categories", skillCategoryRoute);
  app.use(path + "/skills", skillRoute);
  app.use(path + "/companies", companyRoute);
  app.use(path + "/candidate-profiles", candidateProfileRoute);
  app.use(path + "/resumes", resumeRoute);
  app.use(path + "/jobs", jobRoute);
  app.use(path + "/applications", applicationRoute);
};

export default clientRoute;
