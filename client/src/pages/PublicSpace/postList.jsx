import React from 'react';
import Post from './post';
import { ChevronDown } from 'lucide-react';
import './postList.css';

const PostList = ({ posts, currentUser }) => {
if (!posts || posts.length === 0) {
return (
<div className="no-posts">
<div className="no-posts-image"></div>
<h3>No posts yet</h3>
<p>
When you or your friends create posts, they'll appear here.
{currentUser.friendCount === 0 &&
" Connect with friends to see their posts and unlock posting!"}
</p>
</div>
);
}

return (
<div className="post-list">
{posts.map((post) => (
<Post key={post.id} post={post} currentUser={currentUser} />
))}


  <div className="load-more">
    <button className="load-more-btn">
      <ChevronDown size={18} />
      <span>Load more</span>
    </button>
  </div>
</div>
);
};

export default PostList;