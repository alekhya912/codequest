import express from "express";
import { login, signup, updateProfile } from "../controller/auth.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.post("/login", login);
router.post("/signup", signup);
router.patch("/profile/:id", auth, updateProfile);

export default router;