// routes/user.js
import express from 'express';
import {
  authUser,
  registerUser,
  getUserProfile,
  updateUserProfile,
  searchUsers
} from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';
import multer from 'multer';

const router = express.Router();

// Configure storage
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

router.post('/login', authUser);
router.post('/register', registerUser);
router.get('/search', protect, searchUsers);

router.route('/profile')
  .get(protect, getUserProfile)
  .put(protect, upload.single('avatar'), updateUserProfile);

export default router;