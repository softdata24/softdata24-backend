import { Router } from "express";
import { AuthController } from "@controllers/Auth.controller";

const router = Router({ mergeParams: true });

router.get("/",AuthController.test);

// Direct login/register
router.post("/register", AuthController.registerDirect);
router.post("/login", AuthController.loginDirect);

// OAuth login
router.post("/oauth-login", AuthController.loginOAuth);

// Admin: soft delete / restore
router.patch("/soft-delete/:id", AuthController.softDelete);
router.patch("/restore/:id", AuthController.restore);

export default router;
