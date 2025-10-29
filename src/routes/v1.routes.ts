import { Router } from "express";
import authRoutes from "./Auth.route";
import userRoutes from "./users/user.route";

const router = Router({ mergeParams: true });

router.use("/auth", authRoutes);
router.use("/users", userRoutes);

export default router;