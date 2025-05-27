import React, { useState, useRef, useEffect } from 'react';
import { Image, X, Film, Calendar, Info } from 'lucide-react';
import './postCreation.css';

const PostCreation = ({ onCreatePost, canPost, remainingPosts }) => {
  const [content, setContent] = useState('');
  const [mediaFiles, setMediaFiles] = useState([]);
  const [mediaPreviewUrls, setMediaPreviewUrls] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showLimitInfo, setShowLimitInfo] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    return () => {
      mediaPreviewUrls.forEach(url => URL.revokeObjectURL(url));
    };
  }, [mediaPreviewUrls]);

  const handleContentChange = (e) => {
    setContent(e.target.value);
  };

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      const newPreviewUrls = newFiles.map(file => URL.createObjectURL(file));

      setMediaFiles(prev => [...prev, ...newFiles]);
      setMediaPreviewUrls(prev => [...prev, ...newPreviewUrls]);
    }
  };

  const removeMedia = (index) => {
    URL.revokeObjectURL(mediaPreviewUrls[index]);

    const updatedFiles = [...mediaFiles];
    updatedFiles.splice(index, 1);
    setMediaFiles(updatedFiles);

    const updatedPreviewUrls = [...mediaPreviewUrls];
    updatedPreviewUrls.splice(index, 1);
    setMediaPreviewUrls(updatedPreviewUrls);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!canPost) {
      setShowLimitInfo(true);
      setTimeout(() => setShowLimitInfo(false), 3000);
      return;
    }

    if (!content.trim() && mediaFiles.length === 0) {
      return;
    }

    setIsSubmitting(true);

    try {
      const postData = {
        content: content.trim(),
        media: mediaFiles.length > 0
          ? mediaFiles.map(file => ({
              type: file.type.startsWith('image/') ? 'image' : 'video',
              url: URL.createObjectURL(file) // Temporary preview URL
            }))
          : [],
        createdAt: new Date().toISOString(),
      };

      await onCreatePost(postData);

      setContent('');
      mediaPreviewUrls.forEach(url => URL.revokeObjectURL(url));
      setMediaFiles([]);
      setMediaPreviewUrls([]);
    } catch (error) {
      console.error('Error creating post:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const triggerFileInput = (type) => {
    if (fileInputRef.current) {
      fileInputRef.current.accept = type === 'image' ? 'image/*' : 'video/*';
      fileInputRef.current.click();
    }
  };

  return (
    <div className={`post-creation ${!canPost ? 'post-creation-disabled' : ''}`}>
      <form onSubmit={handleSubmit}>
        <div className="post-creation-header">
          <h3>Create Post</h3>
          {!canPost && (
            <div className="post-limit-badge" onClick={() => setShowLimitInfo(!showLimitInfo)}>
              <Calendar size={16} />
              <span>Daily limit reached</span>
              {showLimitInfo && (
                <div className="post-limit-info">
                  <p>You've reached your daily posting limit.</p>
                  <p>Connect with more friends to increase your limit!</p>
                </div>
              )}
            </div>
          )}
          {canPost && remainingPosts !== 999 && (
            <div className="post-limit-badge post-limit-available">
              <Calendar size={16} />
              <span>{remainingPosts} post{remainingPosts !== 1 ? 's' : ''} remaining today</span>
            </div>
          )}
        </div>

        <textarea
          placeholder={
            canPost
              ? "What's on your mind today?"
              : "Connect with friends to start posting"
          }
          value={content}
          onChange={handleContentChange}
          disabled={!canPost || isSubmitting}
          rows={3}
          className="post-content-input"
        />

        {mediaPreviewUrls.length > 0 && (
          <div className="media-preview-container">
            {mediaPreviewUrls.map((url, index) => (
              <div key={index} className="media-preview">
                {mediaFiles[index]?.type.includes('image') ? (
                  <img src={url} alt="Preview" />
                ) : (
                  <video src={url} controls />
                )}
                <button
                  type="button"
                  className="remove-media-btn"
                  onClick={() => removeMedia(index)}
                >
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="post-creation-actions">
          <div className="media-buttons">
            <button
              type="button"
              onClick={() => triggerFileInput('image')}
              disabled={!canPost || isSubmitting}
              className="media-btn"
            >
              <Image size={20} />
              <span>Photo</span>
            </button>
            <button
              type="button"
              onClick={() => triggerFileInput('video')}
              disabled={!canPost || isSubmitting}
              className="media-btn"
            >
              <Film size={20} />
              <span>Video</span>
            </button>
          </div>

          <button
            type="submit"
            className="post-submit-btn"
            disabled={!canPost || isSubmitting || (!content.trim() && mediaFiles.length === 0)}
          >
            {isSubmitting ? 'Posting...' : 'Post'}
          </button>
        </div>

        <input
          type="file"
          ref={fileInputRef}
          style={{ display: 'none' }}
          onChange={handleFileSelect}
          accept="image/*,video/*"
        />
      </form>

      {!canPost && (
        <div className="post-limit-explainer">
          <Info size={16} />
          <p>
            You need at least one friend to post.
            <br />
            <span>Connect with others to unlock posting!</span>
          </p>
        </div>
      )}
    </div>
  );
};

export default PostCreation;
