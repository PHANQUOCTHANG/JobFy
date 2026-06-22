import { Router } from "express";
import { z } from "zod";
import * as companyCtrl from "./company.controller";
import validationMiddleware from "@/middleware/validate.middleware";
import { requireAuth, requireRole } from "@/middleware/auth.middleware";
import {
  CreateCompanySchema,
  UpdateCompanySchema,
  CreateCompanyLocationSchema,
  UpdateCompanyLocationSchema,
  CreateCompanyMemberSchema,
  UpdateCompanyMemberSchema,
  UuidParamSchema,
} from "./company.request";

const router = Router();

// ================= COMPANY =================
router
  .route("/")
  .get(companyCtrl.getCompanies)
  .post(
    requireAuth,
    requireRole("employer"),
    validationMiddleware(CreateCompanySchema),
    companyCtrl.createCompany
  );

router
  .route("/:id")
  .get(
    validationMiddleware(z.object({ id: z.string().min(1) }), "params"),
    companyCtrl.getCompany
  )
  .patch(
    requireAuth,
    requireRole("employer"),
    validationMiddleware(UuidParamSchema, "params"),
    validationMiddleware(UpdateCompanySchema),
    companyCtrl.updateCompany
  )
  .delete(
    requireAuth,
    requireRole("employer"),
    validationMiddleware(UuidParamSchema, "params"),
    companyCtrl.deleteCompany
  );

// Admin-only: verify / unverify a company
router.patch(
  "/:id/verify",
  requireAuth,
  requireRole("admin"),
  validationMiddleware(UuidParamSchema, "params"),
  companyCtrl.verifyCompany
);

// ================= LOCATION =================
router
  .route("/:companyId/locations")
  .get(
    validationMiddleware(z.object({ companyId: z.string().uuid() }), "params"),
    companyCtrl.getLocations
  )
  .post(
    requireAuth,
    requireRole("employer"),
    validationMiddleware(z.object({ companyId: z.string().uuid() }), "params"),
    validationMiddleware(CreateCompanyLocationSchema),
    companyCtrl.addLocation
  );

router
  .route("/:companyId/locations/:locationId")
  .patch(
    requireAuth,
    requireRole("employer"),
    validationMiddleware(z.object({ companyId: z.string().uuid(), locationId: z.string().regex(/^\d+$/).transform(Number) }), "params"),
    validationMiddleware(UpdateCompanyLocationSchema),
    companyCtrl.updateLocation
  )
  .delete(
    requireAuth,
    requireRole("employer"),
    validationMiddleware(z.object({ companyId: z.string().uuid(), locationId: z.string().regex(/^\d+$/).transform(Number) }), "params"),
    companyCtrl.deleteLocation
  );

// ================= MEMBER =================
router
  .route("/:companyId/members")
  .get(
    requireAuth, // Ai có quyền mới được xem member list (thường là vậy)
    validationMiddleware(z.object({ companyId: z.string().uuid() }), "params"),
    companyCtrl.getMembers
  )
  .post(
    requireAuth,
    requireRole("employer"),
    validationMiddleware(z.object({ companyId: z.string().uuid() }), "params"),
    validationMiddleware(CreateCompanyMemberSchema),
    companyCtrl.addMember
  );

router
  .route("/:companyId/members/:memberId")
  .patch(
    requireAuth,
    requireRole("employer"),
    validationMiddleware(z.object({ companyId: z.string().uuid(), memberId: z.string().regex(/^\d+$/).transform(Number) }), "params"),
    validationMiddleware(UpdateCompanyMemberSchema),
    companyCtrl.updateMember
  )
  .delete(
    requireAuth,
    requireRole("employer"),
    validationMiddleware(z.object({ companyId: z.string().uuid(), memberId: z.string().regex(/^\d+$/).transform(Number) }), "params"),
    companyCtrl.removeMember
  );

export default router;
