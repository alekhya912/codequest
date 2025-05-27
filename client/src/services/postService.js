const mockPosts = [
{
id: '1',
content: 'Just finished a great book! Would highly recommend "The Midnight Library" by Matt Haig.',
media: [
{ type: 'image', url: 'https://images.pexels.com/photos/159866/books-book-pages-read-literature-159866.jpeg' }
],
author: {
id: 'user1',
name: 'Alexandra Chen',
avatar: 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg'
},
likes: 24,
comments: [
{
id: 'comment1',
content: 'I loved that book too! The concept is so fascinating.',
author: {
id: 'user2',
name: 'Michael Johnson',
avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg'
},
createdAt: '2025-03-15T14:30:00Z'
}
],
createdAt: '2025-03-15T12:00:00Z'
},
{
id: '2',
content: 'Sunset at the beach today was incredible!',
media: [
{ type: 'image', url: 'https://images.pexels.com/photos/1126997/pexels-photo-1126997.jpeg' }
],
author: {
id: 'user3',
name: 'Emily Rodriguez',
avatar: 'https://images.pexels.com/photos/712513/pexels-photo-712513.jpeg'
},
likes: 42,
comments: [],
createdAt: '2025-03-14T19:45:00Z'
},
{
id: '3',
content: 'Just launched our new product! Check out the demo video.',
media: [
{ type: 'video', url: 'https://www.w3schools.com/html/mov_bbb.mp4' }
],
author: {
id: 'user4',
name: 'David Kim',
avatar: 'https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg'
},
likes: 18,
comments: [
{
id: 'comment2',
content: 'This looks amazing! Great work on the UI.',
author: {
id: 'user1',
name: 'Alexandra Chen',
avatar: 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg'
},
createdAt: '2025-03-13T10:20:00Z'
},
{
id: 'comment3',
content: 'When will this be available for purchase?',
author: {
id: 'user5',
name: 'Sophia Williams',
avatar: null
},
createdAt: '2025-03-13T11:15:00Z'
}
],
createdAt: '2025-03-13T09:30:00Z'
}
];

// Action Types
export const GET_POSTS = 'GET_POSTS';
export const CREATE_POST = 'CREATE_POST';
export const LIKE_POST = 'LIKE_POST';
export const ADD_COMMENT = 'ADD_COMMENT';
export const SHARE_POST = 'SHARE_POST';

// Action Creators
export const getPosts = () => async (dispatch) => {
try {
// Simulate API delay
await new Promise(resolve => setTimeout(resolve, 1000));


  dispatch({
    type: GET_POSTS,
    payload: mockPosts
  });
  
  return mockPosts;
} catch (error) {
  console.error('Error fetching posts:', error);
  throw error;
}
};

export const createPost = (postData) => async (dispatch) => {
try {
// Simulate API delay
await new Promise(resolve => setTimeout(resolve, 1500));


  // In a real app, you'd get the response from the API
  const newPost = {
    id: Date.now().toString(),
    ...postData,
    author: {
      id: 'currentUser',
      name: 'Current User',
      avatar: null
    },
    likes: 0,
    comments: []
  };
  
  dispatch({
    type: CREATE_POST,
    payload: newPost
  });
  
  return newPost;
} catch (error) {
  console.error('Error creating post:', error);
  throw error;
}
};

export const likePost = (postId) => async (dispatch) => {
try {
// Simulate API delay
await new Promise(resolve => setTimeout(resolve, 500));


  dispatch({
    type: LIKE_POST,
    payload: { postId }
  });
} catch (error) {
  console.error('Error liking post:', error);
  throw error;
}
};

export const addComment = (postId, commentData) => async (dispatch) => {
try {
// Simulate API delay
await new Promise(resolve => setTimeout(resolve, 500));


  const newComment = {
    id: Date.now().toString(),
    ...commentData,
    createdAt: new Date().toISOString()
  };
  
  dispatch({
    type: ADD_COMMENT,
    payload: { postId, comment: newComment }
  });
  
  return newComment;
} catch (error) {
  console.error('Error adding comment:', error);
  throw error;
}
};

export const sharePost = (postId) => async (dispatch) => {
try {
// Simulate API delay
await new Promise(resolve => setTimeout(resolve, 500));


  dispatch({
    type: SHARE_POST,
    payload: { postId }
  });
} catch (error) {
  console.error('Error sharing post:', error);
  throw error;
}
};