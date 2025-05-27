import mongoose from "mongoose";
import User from "../models/User.js";

// Get all users
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.status(200).json(users);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

// Get a single user
export const getUser = async (req, res) => {
  const { id } = req.params;
  
  try {
    const user = await User.findById(id).select('-password');
    res.status(200).json(user);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

// Update user avatar
export const updateAvatar = async (req, res) => {
  const { id } = req.params;
  const { avatarUrl } = req.body;
  
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).send('No user with that id');
  }
  
  try {
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { avatar: avatarUrl },
      { new: true }
    ).select('-password');
    
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Reset daily post count
// This could be called by a scheduled job at midnight
export const resetDailyPostCount = async (req, res) => {
  try {
    await User.updateMany({}, { postsToday: 0 });
    res.status(200).json({ message: "All user post counts reset successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};