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
import savedJobRoute from "@/module/saved-job/saved-job.route";
import jobAlertRoute from "@/module/job-alert/job-alert.route";
import messagingRoute from "@/module/messaging/messaging.route";
import companyReviewRoute from "@/module/company-review/company-review.route";
import notificationRoute from "@/module/notification/notification.route";
import subscriptionRoute, { paymentRouter } from "@/module/subscription/subscription.route";
import reportRoute from "@/module/report/report.route";
import adminRoute from "@/module/admin/admin.route";
import locationRoute from "@/module/location/location.route";
import aiRoute from "@/module/ai/ai.route";
import coverLetterRoute from "@/module/cover-letter/cover-letter.route";
import { requireAuth, requireRole } from "@/middleware/auth.middleware";
import employerRoute from "@/module/employer/employer.routes";
import adminEmployerRoute from "@/module/admin-employer/admin-employer.routes";



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
  app.use(path, locationRoute);
  
  // New Modules
  app.use(path + "/saved-jobs", requireAuth, savedJobRoute);
  app.use(path + "/job-alerts", requireAuth, jobAlertRoute);
  app.use(path + "/conversations", requireAuth, messagingRoute);
  app.use(path + "/company-reviews", companyReviewRoute);
  app.use(path + "/notifications", requireAuth, notificationRoute);
  app.use(path + "/subscriptions", subscriptionRoute);
  app.use(path + "/payments", requireAuth, paymentRouter);
  app.use(path + "/reports", reportRoute);

  // Employer Module
  app.use(path + "/employer", employerRoute);
  app.use(path + "/ai", requireAuth, aiRoute);
  app.use(path + "/cover-letters", coverLetterRoute);

  // Admin Module
  app.use(path + "/admin", requireAuth, requireRole("admin"), adminRoute);

  // Admin Employer Module (pending/verify)
  app.use(path + "/admin/employer", adminEmployerRoute);
};


export default clientRoute;
