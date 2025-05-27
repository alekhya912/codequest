import React, { useState, useEffect } from 'react';
import Leftsidebar from '../../Comnponent/Leftsidebar/Leftsidebar';
import { useParams } from 'react-router-dom';
import moment from 'moment';
import { useSelector } from 'react-redux';
import Profilebio from './Profilebio';
import Edirprofileform from './Edirprofileform';
import AvatarUploader from '../../Comnponent/AvatarUploader/AvatarUploader';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBirthdayCake, faPen } from '@fortawesome/free-solid-svg-icons';
import './Userprofile.css';

const Userprofile = ({ slidein }) => {
  const { id } = useParams();
  const [Switch, setswitch] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [showUploader, setShowUploader] = useState(false);
  const users = useSelector((state) => state.usersreducer);
  const currentprofile = users.find((user) => user._id === id);
  const currentuser = useSelector((state) => state.currentuserreducer);

  useEffect(() => {
    const saved = localStorage.getItem(`avatar-${id}`);
    if (saved) setAvatarUrl(saved);
  }, [id]);

  const handleAvatarSelect = (url) => {
    setAvatarUrl(url);
    localStorage.setItem(`avatar-${id}`, url);
    setShowUploader(false);
  };

  return (
    <div className="user-profile-container">
      <Leftsidebar slidein={slidein} />
      <div className="user-profile-content">
        <section className="profile-section">
          <div className="user-details-container">
            <div className="avatar-section">
              <div className="avatar-click-area" onClick={() => setShowUploader(true)}>
                {avatarUrl ? (
                  <img src={avatarUrl} alt="avatar" className="profile-avatar" />
                ) : (
                  <div className="generated-avatar">
                    {currentprofile?.name?.charAt(0).toUpperCase() || "U"}
                  </div>
                )}
              </div>
            </div>
            <div className="user-info">
              <h1>{currentprofile?.name}</h1>
              <p>
                <FontAwesomeIcon icon={faBirthdayCake} /> Joined{' '}
                {moment(currentprofile?.joinedon).fromNow()}
              </p>
            </div>
            {currentuser?.result?._id === id && (
              <button className="edit-profile-btn" onClick={() => setswitch(true)}>
                <FontAwesomeIcon icon={faPen} /> Edit Profile
              </button>
            )}
          </div>

          {Switch ? (
            <Edirprofileform currentuser={currentuser} setswitch={setswitch} />
          ) : (
            <Profilebio currentprofile={currentprofile} />
          )}
        </section>

        {showUploader && currentuser?.result?._id === id && (
          <div className="fullscreen-avatar-uploader">
            <AvatarUploader onAvatarSelect={handleAvatarSelect} onClose={() => setShowUploader(false)} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Userprofile;
