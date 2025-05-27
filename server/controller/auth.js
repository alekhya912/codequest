import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import User from "../models/User.js";

export const signup = async (req, res) => {
  const { name, email, password } = req.body;
  
  try {
    const existingUser = await User.findOne({ email });
    
    if (existingUser) {
      return res.status(400).json({ message: "User already exists." });
    }
    
    const hashedPassword = await bcrypt.hash(password, 12);
    
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      joinedOn: new Date()
    });
    
    const token = jwt.sign(
      { email: newUser.email, id: newUser._id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    
    res.status(201).json({ 
      result: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        joinedOn: newUser.joinedOn,
        friendCount: 0,
        postsToday: 0,
        avatar: null
      }, 
      token 
    });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
    console.log(error);
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  
  try {
    const existingUser = await User.findOne({ email });
    
    if (!existingUser) {
      return res.status(404).json({ message: "User doesn't exist." });
    }
    
    const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);
    
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid credentials." });
    }
    
    const token = jwt.sign(
      { email: existingUser.email, id: existingUser._id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    
    res.status(200).json({ 
      result: {
        _id: existingUser._id,
        name: existingUser.name,
        email: existingUser.email,
        joinedOn: existingUser.joinedOn,
        friendCount: existingUser.friendCount || 0,
        postsToday: existingUser.postsToday || 0,
        avatar: existingUser.avatar
      }, 
      token 
    });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
    console.log(error);
  }
};

export const updateProfile = async (req, res) => {
  const { id } = req.params;
  const { name, about, tags, avatar } = req.body;
  
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).send('No user with that id');
  }
  
  try {
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { name, about, tags, avatar },
      { new: true }
    );
    
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
    console.log(error);
  }
};