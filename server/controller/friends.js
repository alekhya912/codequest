import mongoose from "mongoose";
import Friendship from "../models/Friend.js";
import User from "../models/User.js";

// Get all friend relationships for a user
export const getFriends = async (req, res) => {
  const { userId } = req.params;
  
  try {
    // Find all friendships where the user is either the sender or receiver
    const friendships = await Friendship.find({
      $or: [
        { userId: userId },
        { friendId: userId }
      ]
    });
    
    res.status(200).json(friendships);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

// Send a friend request
export const sendFriendRequest = async (req, res) => {
  const { friendId } = req.body;
  const userId = req.userId;
  
  // Validate IDs
  if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(friendId)) {
    return res.status(404).send('Invalid user ID');
  }
  
  // Prevent self-friending
  if (userId === friendId) {
    return res.status(400).json({ message: "You cannot add yourself as a friend" });
  }
  
  try {
    // Check if the friendship already exists
    const existingFriendship = await Friendship.findOne({
      $or: [
        { userId: userId, friendId: friendId },
        { userId: friendId, friendId: userId }
      ]
    });
    
    if (existingFriendship) {
      return res.status(400).json({ message: "Friendship request already exists" });
    }
    
    // Create new friendship request
    const newFriendship = new Friendship({
      userId,
      friendId,
      status: 'pending',
      createdAt: new Date()
    });
    
    await newFriendship.save();
    
    res.status(201).json(newFriendship);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

// Accept a friend request
export const acceptFriendRequest = async (req, res) => {
  const { id } = req.params; // friendship id
  const userId = req.userId;
  
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).send('No friendship with that id');
  }
  
  try {
    const friendship = await Friendship.findById(id);
    
    if (!friendship) {
      return res.status(404).json({ message: "Friendship request not found" });
    }
    
    // Ensure the current user is the recipient of the request
    if (friendship.friendId.toString() !== userId) {
      return res.status(403).json({ message: "You cannot accept this request" });
    }
    
    // Update friendship status
    friendship.status = 'accepted';
    await friendship.save();
    
    // Update the friend count for both users
    const user1 = await User.findById(friendship.userId);
    const user2 = await User.findById(friendship.friendId);
    
    user1.friendCount = user1.friendCount ? user1.friendCount + 1 : 1;
    user2.friendCount = user2.friendCount ? user2.friendCount + 1 : 1;
    
    await user1.save();
    await user2.save();
    
    res.status(200).json(friendship);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Reject a friend request
export const rejectFriendRequest = async (req, res) => {
  const { id } = req.params; // friendship id
  const userId = req.userId;
  
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).send('No friendship with that id');
  }
  
  try {
    const friendship = await Friendship.findById(id);
    
    if (!friendship) {
      return res.status(404).json({ message: "Friendship request not found" });
    }
    
    // Ensure the current user is the recipient of the request
    if (friendship.friendId.toString() !== userId) {
      return res.status(403).json({ message: "You cannot reject this request" });
    }
    
    // Delete the friendship request
    await Friendship.findByIdAndDelete(id);
    
    res.status(200).json({ message: "Friend request rejected successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Remove a friend
export const removeFriend = async (req, res) => {
  const { id } = req.params; // friendship id
  const userId = req.userId;
  
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).send('No friendship with that id');
  }
  
  try {
    const friendship = await Friendship.findById(id);
    
    if (!friendship) {
      return res.status(404).json({ message: "Friendship not found" });
    }
    
    // Ensure the current user is part of this friendship
    if (friendship.userId.toString() !== userId && friendship.friendId.toString() !== userId) {
      return res.status(403).json({ message: "You are not part of this friendship" });
    }
    
    // Only accepted friendships decrease friend count when removed
    if (friendship.status === 'accepted') {
      // Update the friend count for both users
      const user1 = await User.findById(friendship.userId);
      const user2 = await User.findById(friendship.friendId);
      
      user1.friendCount = Math.max(0, user1.friendCount - 1);
      user2.friendCount = Math.max(0, user2.friendCount - 1);
      
      await user1.save();
      await user2.save();
    }
    
    // Delete the friendship
    await Friendship.findByIdAndDelete(id);
    
    res.status(200).json({ message: "Friendship removed successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get friend suggestions
export const getFriendSuggestions = async (req, res) => {
  const userId = req.userId;
  
  try {
    // Get current user's friends
    const friendships = await Friendship.find({
      $or: [
        { userId: userId, status: 'accepted' },
        { friendId: userId, status: 'accepted' }
      ]
    });
    
    // Extract friend IDs
    const friendIds = friendships.map(friendship => 
      friendship.userId.toString() === userId 
        ? friendship.friendId.toString() 
        : friendship.userId.toString()
    );
    
    // Add current user to exclusion list
    const excludeIds = [...friendIds, userId];
    
    // Get all friendship requests (pending or accepted)
    const allConnections = await Friendship.find({
      $or: [
        { userId: userId },
        { friendId: userId }
      ]
    });
    
    // Get IDs of all users already connected or with pending requests
    const connectedIds = allConnections.flatMap(connection => [
      connection.userId.toString(),
      connection.friendId.toString()
    ]);
    
    // Find users who are not friends and have no pending requests
    const suggestions = await User.find({
      _id: { $nin: [...new Set(connectedIds)] },
      _id: { $ne: userId }
    }).limit(5);
    
    res.status(200).json(suggestions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};