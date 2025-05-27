import axios from "axios";

const API = axios.create({ baseURL: process.env.REACT_APP_API_URL || "http://localhost:5000/api" });

// Add auth token to requests
API.interceptors.request.use((req) => {
  if (localStorage.getItem("Profile")) {
    req.headers.authorization = `Bearer ${JSON.parse(localStorage.getItem("Profile")).token}`;
  }
  return req;
});

// Authentication endpoints
export const login = (formData) => API.post("/auth/login", formData);
export const signup = (formData) => API.post("/auth/signup", formData);
export const updateProfile = (id, updateData) => API.patch(`/auth/profile/${id}`, updateData);

// User endpoints
export const getallusers = () => API.get("/users");
export const getUser = (id) => API.get(`/users/${id}`);
export const updateAvatar = (id, avatarUrl) => API.patch(`/users/${id}/avatar`, { avatarUrl });

// Post endpoints
export const getPosts = () => API.get("/posts");
export const createPost = (postData) => API.post("/posts", postData);
export const likePost = (id) => API.patch(`/posts/${id}/like`);
export const commentPost = (id, commentData) => API.post(`/posts/${id}/comment`, commentData);
export const getUserPosts = (userId) => API.get(`/posts/user/${userId}`);

// Friend endpoints
export const getFriends = (userId) => API.get(`/friends/user/${userId}`);
export const sendFriendRequest = (friendId) => API.post("/friends/request", { friendId });
export const acceptFriendRequest = (id) => API.patch(`/friends/${id}/accept`);
export const rejectFriendRequest = (id) => API.delete(`/friends/${id}/reject`);
export const removeFriend = (id) => API.delete(`/friends/${id}`);
export const getFriendSuggestions = () => API.get("/friends/suggestions");

export default API;