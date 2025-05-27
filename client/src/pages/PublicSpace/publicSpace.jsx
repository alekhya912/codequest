import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getPosts, createPost } from '../../services/postService';
import PostList from './postList';
import PostCreation from './postCreation';
import FriendSuggestions from './friendSuggestions';
import './publicSpace.css';
import { AlertCircle } from 'lucide-react';

const PublicSpace = ({ slidein }) => {
const dispatch = useDispatch();
const currentUser = useSelector((state) => state.currentuserreducer);
const posts = useSelector((state) => state.postsReducer || []);
const [canPost, setCanPost] = useState(false);
const [remainingPosts, setRemainingPosts] = useState(0);
const [loading, setLoading] = useState(true);

useEffect(() => {
const fetchPosts = async () => {
setLoading(true);
try {
await dispatch(getPosts());
} catch (error) {
console.error('Error fetching posts:', error);
} finally {
setLoading(false);
}
};


fetchPosts();
}, [dispatch]);

useEffect(() => {
if (currentUser?.result) {
const checkPostingAbility = () => {
const { friendCount, postsToday } = currentUser.result;


    if (friendCount === 0) {
      setCanPost(false);
      setRemainingPosts(0);
    } else if (friendCount === 1) {
      setCanPost(postsToday < 1);
      setRemainingPosts(Math.max(0, 1 - postsToday));
    } else if (friendCount >= 2 && friendCount < 10) {
      setCanPost(postsToday < 2);
      setRemainingPosts(Math.max(0, 2 - postsToday));
    } else {
      setCanPost(true);
      setRemainingPosts(999); // Unlimited
    }
  };
  
  checkPostingAbility();
}
}, [currentUser]);

const handleCreatePost = async (postData) => {
if (!canPost) return;


try {
  await dispatch(createPost(postData));
  // Update the user's post count for today
  // This would be handled by the backend, but we simulate it here
} catch (error) {
  console.error('Error creating post:', error);
}
};

if (!currentUser?.result) {
return (
<div className="public-space-container">
<div className="login-required">
<AlertCircle size={48} />
<h2>Please log in to access the public space</h2>
<p>You need to be logged in to view and create posts.</p>
</div>
</div>
);
}

return (
<div className="public-space-container">
<div className="public-space-main">
<div className="public-space-feed">
<div className="post-creation-wrapper">
<PostCreation
onCreatePost={handleCreatePost}
canPost={canPost}
remainingPosts={remainingPosts}
/>
</div>


      {loading ? (
        <div className="loading-posts">
          <div className="loading-spinner"></div>
          <p>Loading posts...</p>
        </div>
      ) : (
        <PostList posts={posts} currentUser={currentUser.result} />
      )}
    </div>
    
    <div className="public-space-sidebar">
      <div className="posting-rules">
        <h3>Posting Rules</h3>
        <ul>
          <li>0 friends: Cannot post</li>
          <li>1 friend: 1 post per day</li>
          <li>2-9 friends: 2 posts per day</li>
          <li>10+ friends: Unlimited posts</li>
        </ul>
        <div className="posting-status">
          <h4>Your Status</h4>
          <p>Friends: {currentUser.result.friendCount || 0}</p>
          <p>Remaining posts today: {remainingPosts === 999 ? "Unlimited" : remainingPosts}</p>
        </div>
      </div>
      
      <FriendSuggestions />
    </div>
  </div>
</div>
);
};

export default PublicSpace;