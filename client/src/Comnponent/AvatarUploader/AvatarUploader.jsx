import React, { useState, useEffect } from 'react';
import './AvatarUploader.css';

const AvatarUploader = ({ onAvatarSelect, onClose }) => {
  const [view, setView] = useState('options'); // 'options' | 'upload' | 'generate'
  const [previewUrl, setPreviewUrl] = useState(null);
  const [seedList, setSeedList] = useState([]);
  const [selectedSeed, setSelectedSeed] = useState(null);

  useEffect(() => {
    const seeds = Array.from({ length: 20 }, () => Math.random().toString(36).substring(7));
    setSeedList(seeds);
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setPreviewUrl(reader.result);
    reader.readAsDataURL(file);
  };

  const handleAvatarClick = (seed) => {
    setSelectedSeed(seed);
    const url = `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}`;
    setPreviewUrl(url);
  };

  const handleConfirm = () => {
    if (previewUrl) {
      onAvatarSelect(previewUrl);
    }
  };

  return (
    <div className="avatar-popup-overlay">
      <div className="avatar-popup">
        <button className="close-popup" onClick={onClose}>×</button>
        <h2>Change Profile Picture</h2>

        {view === 'options' && (
          <div className="avatar-type-selector">
            <button onClick={() => setView('upload')}>Upload Photo</button>
            <button onClick={() => setView('generate')}>Generate Avatar</button>
          </div>
        )}

        {view === 'upload' && (
          <div className="upload-section">
            <input type="file" id="upload" accept="image/*" onChange={handleFileChange} hidden />
            <label htmlFor="upload" className="upload-button">Choose File</label>
          </div>
        )}

        {view === 'generate' && (
          <div className="avatar-scroll-section">
            <div className="avatar-scroll-container">
              {seedList.map(seed => (
                <img
                  key={seed}
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}`}
                  className={`scroll-avatar ${seed === selectedSeed ? 'selected' : ''}`}
                  onClick={() => handleAvatarClick(seed)}
                  alt="avatar"
                />
              ))}
            </div>
          </div>
        )}

        {previewUrl && (
          <div className="avatar-preview-area">
            <h4>Preview</h4>
            <img src={previewUrl} className="avatar-preview-large" alt="Preview" />
            <button className="confirm-button" onClick={handleConfirm}>Confirm</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AvatarUploader;
