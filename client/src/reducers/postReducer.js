import {
GET_POSTS,
CREATE_POST,
LIKE_POST,
ADD_COMMENT,
SHARE_POST
} from '../services/postService.js';

const postsReducer = (state = [], action) => {
switch (action.type) {
case GET_POSTS:
return action.payload;


  case CREATE_POST:
    return [action.payload, ...state];
    
  case LIKE_POST:
    return state.map((post) => 
      post.id === action.payload.postId 
        ? { ...post, likes: post.likes + 1 } 
        : post
    );
    
  case ADD_COMMENT:
    return state.map((post) => 
      post.id === action.payload.postId 
        ? { 
            ...post, 
            comments: [...post.comments, action.payload.comment] 
          } 
        : post
    );
    
  case SHARE_POST:
    // In a real app, you'd probably create a new post that references the original
    return state;
    
  default:
    return state;
}
};

export default postsReducer;