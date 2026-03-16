import { Router } from "express";
import { getStats } from "../controllers/stats.controller.js";
import { isLoggedIn } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/", isLoggedIn, getStats);

export default router;
