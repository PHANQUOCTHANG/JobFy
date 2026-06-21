import { Router } from "express";
import { locationController } from "./location.controller";

const router = Router();

router.route("/industries").get(locationController.getIndustries);
router.route("/provinces").get(locationController.getProvinces);
router.route("/districts").get(locationController.getDistricts);

export default router;
