import { Router } from "express";
import { disconnectGoogle, getMe, login, logout, markBlock, register, updateAdvanceSettings, updatePassword, updateProfile } from "../controllers/doctor.controllers.js";
const router = Router();
import {isLoggedIn} from '../middlewares/auth.middleware.js'
import { getBlockSlots } from "../controllers/slot.controller.js";

router.post("/register", register);
router.post("/login", login);
router.get("/logout", logout);
router.get("/me", isLoggedIn, getMe);
router.get("/blocks", isLoggedIn,getBlockSlots);
router.post("/markBlock",isLoggedIn,markBlock)
router.patch("/update",isLoggedIn,updateProfile)
router.patch("/updatePassword",isLoggedIn,updatePassword)
router.patch("/updateAdvanceSettings",isLoggedIn,updateAdvanceSettings)
router.patch("/google/disconnect",isLoggedIn,disconnectGoogle)
// router.post("/reset", forgotPassword);
// router.post("/reset/:resetToken", resetPassword);
// router.post("/change-password", isLoggedIn, changePassword);
// router.put("/update/:id", isLoggedIn, upload.single('avatar'), updateUser);
export default router;