import mongoose from "mongoose";
import Post from "../models/post.js";
import User from "../models/User.js";
import Friendship from "../models/Friend.js";
import { checkPostingLimit } from "../middleware/postLimit.js";

// Get all posts for the public space
export const getPosts = async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.status(200).json(posts);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

// Create a new post
export const createPost = async (req, res) => {
  const { content, media } = req.body;
  const userId = req.userId;
  
  try {
    // Check if user can post today based on their friend count
    const canPost = await checkPostingLimit(userId);
    
    if (!canPost.allowed) {
      return res.status(403).json({ message: canPost.message });
    }
    
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    // Create the post
    const newPost = new Post({
      content,
      media: media || [],
      author: {
        id: userId,
        name: user.name,
        avatar: user.avatar
      },
      createdAt: new Date()
    });
    
    await newPost.save();
    
    // Update the user's post count for today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Reset post count if it's a new day
    if (!user.lastPostDate || new Date(user.lastPostDate).toDateString() !== today.toDateString()) {
      user.postsToday = 1;
    } else {
      user.postsToday += 1;
    }
    
    user.lastPostDate = new Date();
    await user.save();
    
    res.status(201).json(newPost);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

// Like a post
export const likePost = async (req, res) => {
  const { id } = req.params;
  const userId = req.userId;
  
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).send('No post with that id');
  }
  
  try {
    const post = await Post.findById(id);
    
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    
    // Check if user already liked the post
    const alreadyLiked = post.likedBy.includes(userId);
    
    if (alreadyLiked) {
      // Unlike the post
      post.likedBy = post.likedBy.filter(id => id.toString() !== userId);
      post.likes -= 1;
    } else {
      // Like the post
      post.likedBy.push(userId);
      post.likes += 1;
    }
    
    await post.save();
    
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add a comment to a post
export const commentPost = async (req, res) => {
  const { id } = req.params;
  const { content } = req.body;
  const userId = req.userId;
  
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).send('No post with that id');
  }
  
  try {
    const post = await Post.findById(id);
    const user = await User.findById(userId);
    
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    const comment = {
      id: new mongoose.Types.ObjectId().toString(),
      content,
      author: {
        id: userId,
        name: user.name,
        avatar: user.avatar
      },
      createdAt: new Date()
    };
    
    post.comments.push(comment);
    await post.save();
    
    res.status(200).json(comment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get posts by user
export const getUserPosts = async (req, res) => {
  const { userId } = req.params;
  
  try {
    const posts = await Post.find({ 'author.id': userId }).sort({ createdAt: -1 });
    res.status(200).json(posts);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};