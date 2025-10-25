import { Router } from "express";
import authRoutes from "./Auth.route";

const router = Router({ mergeParams: true });

router.use("/auth", authRoutes);

export default router;