import { Application } from "express";
import userRoute from "@/module/user/user.route";
import authRoute from "@/module/auth/auth.routes";
import { requireAuth } from "@/middleware/auth.middleware";


const clientRoute = (app: Application) => {
  const path = "/api/v1";
  app.use(path + "/users", requireAuth, userRoute);
  app.use(path + "/auth", authRoute);
};

export default clientRoute;
