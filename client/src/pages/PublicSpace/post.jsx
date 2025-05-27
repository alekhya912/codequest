import React, { useState } from 'react';
import { Heart, MessageCircle, Share, MoreHorizontal, Clock } from 'lucide-react';
import './post.css';

const Post = ({ post, currentUser }) => {
const [liked, setLiked] = useState(false);
const [likeCount, setLikeCount] = useState(post.likes || 0);
const [showComments, setShowComments] = useState(false);
const [comment, setComment] = useState('');
const [comments, setComments] = useState(post.comments || []);
const [menuOpen, setMenuOpen] = useState(false);

const formatDate = (dateString) => {
const date = new Date(dateString);
return date.toLocaleDateString('en-US', {
year: 'numeric',
month: 'short',
day: 'numeric',
hour: '2-digit',
minute: '2-digit'
});
};

const handleLike = () => {
// In a real app, you'd make an API call to like/unlike the post
if (!liked) {
setLikeCount(likeCount + 1);
} else {
setLikeCount(likeCount - 1);
}
setLiked(!liked);
};

const handleCommentSubmit = (e) => {
e.preventDefault();
if (!comment.trim()) return;


// In a real app, you'd make an API call to add the comment
const newComment = {
  id: Date.now().toString(),
  content: comment,
  author: {
    id: currentUser.id,
    name: currentUser.name,
    avatar: currentUser.avatar
  },
  createdAt: new Date().toISOString()
};

setComments([...comments, newComment]);
setComment('');
};

const toggleComments = () => {
setShowComments(!showComments);
};

const toggleMenu = () => {
setMenuOpen(!menuOpen);
};

return (
<div className="post">
<div className="post-header">
<div className="post-user">
<div className="post-avatar">
{post.author.avatar ? (
<img src={post.author.avatar} alt={post.author.name} />
) : (
<div className="post-avatar-placeholder">
{post.author.name.charAt(0).toUpperCase()}
</div>
)}
</div>
<div className="post-user-info">
<h4>{post.author.name}</h4>
<div className="post-time">
<Clock size={14} />
<span>{formatDate(post.createdAt)}</span>
</div>
</div>
</div>
<div className="post-menu">
<button className="post-menu-btn" onClick={toggleMenu}>
<MoreHorizontal size={20} />
</button>
{menuOpen && (
<div className="post-menu-dropdown">
<button>Save post</button>
<button>Report post</button>
{currentUser.id === post.author.id && (
<button className="delete-post">Delete post</button>
)}
</div>
)}
</div>
</div>


  <div className="post-content">
    <p>{post.content}</p>
  </div>
  
  {post.media && post.media.length > 0 && (
    <div className={`post-media ${post.media.length > 1 ? 'post-media-grid' : ''}`}>
      {post.media.map((media, index) => (
        <div key={index} className="post-media-item">
          {media.type === 'image' ? (
            <img src={media.url} alt="Post media" />
          ) : (
            <video src={media.url} controls />
          )}
        </div>
      ))}
    </div>
  )}
  
  <div className="post-stats">
    <div className="post-likes">
      <Heart size={14} fill={liked ? "#ef4444" : "none"} color={liked ? "#ef4444" : "#6b7280"} />
      <span>{likeCount} {likeCount === 1 ? 'like' : 'likes'}</span>
    </div>
    <div className="post-comments-count">
      <span>{comments.length} {comments.length === 1 ? 'comment' : 'comments'}</span>
    </div>
  </div>
  
  <div className="post-actions">
    <button 
      className={`post-action-btn ${liked ? 'post-action-liked' : ''}`} 
      onClick={handleLike}
    >
      <Heart size={20} />
      <span>Like</span>
    </button>
    <button className="post-action-btn" onClick={toggleComments}>
      <MessageCircle size={20} />
      <span>Comment</span>
    </button>
    <button className="post-action-btn">
      <Share size={20} />
      <span>Share</span>
    </button>
  </div>
  
  {showComments && (
    <div className="post-comments">
      <form onSubmit={handleCommentSubmit} className="post-comment-form">
        <div className="comment-avatar">
          {currentUser.avatar ? (
            <img src={currentUser.avatar} alt={currentUser.name} />
          ) : (
            <div className="comment-avatar-placeholder">
              {currentUser.name.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
        <input
          type="text"
          placeholder="Write a comment..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
        <button type="submit" disabled={!comment.trim()}>Post</button>
      </form>
      
      <div className="comments-list">
        {comments.map((comment) => (
          <div key={comment.id} className="comment">
            <div className="comment-avatar">
              {comment.author.avatar ? (
                <img src={comment.author.avatar} alt={comment.author.name} />
              ) : (
                <div className="comment-avatar-placeholder">
                  {comment.author.name.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <div className="comment-content">
              <div className="comment-author">{comment.author.name}</div>
              <p>{comment.content}</p>
              <div className="comment-actions">
                <button>Like</button>
                <button>Reply</button>
                <span className="comment-time">
                  {formatDate(comment.createdAt)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )}
</div>
);
};

export default Post;