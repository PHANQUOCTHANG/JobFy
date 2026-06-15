import { Router } from "express";
import * as locationCtrl from "./location.controller";

const router = Router();

router.route("/provinces").get(locationCtrl.getProvinces);

export default router;
