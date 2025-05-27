import express from "express";
import { 
  getAllUsers, 
  getUser, 
  updateAvatar
} from "../controller/users.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.get("/", getAllUsers);
router.get("/:id", getUser);
router.patch("/:id/avatar", auth, updateAvatar);

export default router;