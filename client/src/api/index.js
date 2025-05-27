import axios from "axios";

// Base URL from .env or fallback to localhost
const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:5000/api",
});

// Attach token to all requests if user is logged in
API.interceptors.request.use((req) => {
  const profile = localStorage.getItem("Profile");
  if (profile) {
    req.headers.Authorization = `Bearer ${JSON.parse(profile).token}`;
  }
  return req;
});

//
// ========== Auth Routes =========
//
export const login = (formData) => API.post("/auth/login", formData);
export const signup = (formData) => API.post("/auth/signup", formData);
export const updateprofile = (id, updateData) => API.patch(`/auth/profile/${id}`, updateData);

//
// ========== User Routes =========
//
export const getallusers = () => API.get("/users");
export const getUser = (id) => API.get(`/users/${id}`);
export const updateAvatar = (id, avatarUrl) => API.patch(`/users/${id}/avatar`, { avatarUrl });

//
// ========== Public Space / Post Routes =========
//
export const getPosts = () => API.get("/posts");
export const createPost = (postData) => API.post("/posts", postData);
export const likePost = (id) => API.patch(`/posts/${id}/like`);
export const commentPost = (id, commentData) => API.post(`/posts/${id}/comment`, commentData);
export const getUserPosts = (userId) => API.get(`/posts/user/${userId}`);

//
// ========== Question Routes =========
//
export const postquestion = (questionData) => API.post("/questions/ask", questionData);
export const getallquestions = () => API.get("/questions/get");
export const deletequestion = (id) => API.delete(`/questions/delete/${id}`);
export const votequestion = (id, value) => API.patch(`/questions/vote/${id}`, { value });
export const postanswer = (id, noOfAnswers, answerBody, userAnswered) =>
  API.patch(`/answer/post/${id}`, { noOfAnswers, answerBody, userAnswered });
export const deleteanswer = (id, answerId, noOfAnswers) =>
  API.patch(`/answer/delete/${id}`, { answerId, noOfAnswers });

//
// ========== Friend Routes =========
//
export const getFriends = (userId) => API.get(`/friends/user/${userId}`);
export const sendFriendRequest = (friendId) => API.post("/friends/request", { friendId });
export const acceptFriendRequest = (id) => API.patch(`/friends/${id}/accept`);
export const rejectFriendRequest = (id) => API.delete(`/friends/${id}/reject`);
export const removeFriend = (id) => API.delete(`/friends/${id}`);
export const getFriendSuggestions = () => API.get("/friends/suggestions");

export default API;
