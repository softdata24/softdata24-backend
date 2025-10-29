import { Router } from "express";
import { UserController } from "@controllers/user.controller";
import { isLoggedIn } from "@middlewares/auth.middleware";

const router = Router({ mergeParams: true });

// Route to check if the current user is logged in
router.get("/current-user", isLoggedIn, UserController.getCurrentUser);

// Route for logging out
router.post("/logout", UserController.logout);

export default router;