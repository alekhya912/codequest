import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Users, UserPlus, UserMinus, Check, X } from 'lucide-react';
import { getFriends, sendFriendRequest, acceptFriendRequest, rejectFriendRequest, removeFriend } from '../../services/friendService';
import './friendManager.css';

const FriendManager = () => {
const dispatch = useDispatch();
const [activeTab, setActiveTab] = useState('friends');
const [loading, setLoading] = useState(true);
const currentUser = useSelector(state => state.currentuserreducer.result);
const friends = useSelector(state => state.friendsReducer);
const allUsers = useSelector(state => state.usersreducer);

useEffect(() => {
const loadFriends = async () => {
try {
await dispatch(getFriends(currentUser.id));
} catch (error) {
console.error('Error loading friends:', error);
} finally {
setLoading(false);
}
};


loadFriends();
}, [dispatch, currentUser.id]);

const handleSendRequest = async (userId) => {
try {
await dispatch(sendFriendRequest(currentUser.id, userId));
} catch (error) {
console.error('Error sending friend request:', error);
}
};

const handleAcceptRequest = async (friendshipId) => {
try {
await dispatch(acceptFriendRequest(friendshipId));
} catch (error) {
console.error('Error accepting friend request:', error);
}
};

const handleRejectRequest = async (friendshipId) => {
try {
await dispatch(rejectFriendRequest(friendshipId));
} catch (error) {
console.error('Error rejecting friend request:', error);
}
};

const handleRemoveFriend = async (friendshipId) => {
try {
await dispatch(removeFriend(friendshipId));
} catch (error) {
console.error('Error removing friend:', error);
}
};

const acceptedFriends = friends.filter(friend => friend.status === 'accepted');
const pendingRequests = friends.filter(friend => friend.status === 'pending');
const discoveryUsers = allUsers.filter(user =>
user._id !== currentUser.id &&
!friends.some(friend =>
friend.userId === user._id || friend.friendId === user._id
)
);

if (loading) {
return (
<div className="friend-manager">
<div className="friend-loading">
<div className="loading-spinner"></div>
<p>Loading friends...</p>
</div>
</div>
);
}

return (
<div className="friend-manager">
<div className="friend-manager-header">
<h2>Friends</h2>
<span className="friend-count">{acceptedFriends.length} friends</span>
</div>


  <div className="friend-tabs">
    <button 
      className={`tab-btn ${activeTab === 'friends' ? 'active' : ''}`}
      onClick={() => setActiveTab('friends')}
    >
      <Users size={20} />
      <span>All Friends</span>
    </button>
    <button 
      className={`tab-btn ${activeTab === 'requests' ? 'active' : ''}`}
      onClick={() => setActiveTab('requests')}
    >
      <UserPlus size={20} />
      <span>Friend Requests</span>
      {pendingRequests.length > 0 && ` (${pendingRequests.length})`}
    </button>
    <button 
      className={`tab-btn ${activeTab === 'discover' ? 'active' : ''}`}
      onClick={() => setActiveTab('discover')}
    >
      <Users size={20} />
      <span>Discover People</span>
    </button>
  </div>

  <div className="friend-content">
    {activeTab === 'friends' && (
      <div className="friends-list">
        {acceptedFriends.length === 0 ? (
          <div className="no-friends">
            <Users size={48} />
            <p>You haven't added any friends yet.</p>
            <button 
              className="find-friends-btn"
              onClick={() => setActiveTab('discover')}
            >
              Find Friends
            </button>
          </div>
        ) : (
          acceptedFriends.map(friend => {
            const friendUser = allUsers.find(user => 
              user._id === (friend.userId === currentUser.id ? friend.friendId : friend.userId)
            );
            return (
              <div key={friend.id} className="friend-item">
                <div className="friend-avatar">
                  {friendUser?.avatar ? (
                    <img src={friendUser.avatar} alt={friendUser.name} />
                  ) : (
                    <div className="avatar-placeholder">
                      {friendUser?.name?.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <div className="friend-info">
                  <h4>{friendUser?.name}</h4>
                  <p>Friends since {new Date(friend.createdAt).toLocaleDateString()}</p>
                </div>
                <button 
                  className="remove-friend-btn"
                  onClick={() => handleRemoveFriend(friend.id)}
                >
                  <UserMinus size={18} />
                </button>
              </div>
            );
          })
        )}
      </div>
    )}

    {activeTab === 'requests' && (
      <div className="friend-requests">
        <h3>Friend Requests</h3>
        {pendingRequests.length === 0 ? (
          <div className="no-requests">
            <p>No pending friend requests</p>
          </div>
        ) : (
          pendingRequests.map(request => {
            const requester = allUsers.find(user => user._id === request.userId);
            return (
              <div key={request.id} className="request-item">
                <div className="requester-avatar">
                  {requester?.avatar ? (
                    <img src={requester.avatar} alt={requester.name} />
                  ) : (
                    <div className="avatar-placeholder">
                      {requester?.name?.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <div className="requester-info">
                  <h4>{requester?.name}</h4>
                  <p>Sent you a friend request</p>
                </div>
                <div className="request-actions">
                  <button 
                    className="accept-request-btn"
                    onClick={() => handleAcceptRequest(request.id)}
                  >
                    <Check size={16} />
                  </button>
                  <button 
                    className="reject-request-btn"
                    onClick={() => handleRejectRequest(request.id)}
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    )}

    {activeTab === 'discover' && (
      <div className="discover-users">
        <h3>People You May Know</h3>
        {discoveryUsers.length === 0 ? (
          <div className="no-discover">
            <p>No new people to discover right now</p>
          </div>
        ) : (
          discoveryUsers.map(user => (
            <div key={user._id} className="discover-item">
              <div className="discover-avatar">
                {user.avatar ? (
                  <img src={user.avatar} alt={user.name} />
                ) : (
                  <div className="avatar-placeholder">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              <div className="discover-info">
                <h4>{user.name}</h4>
                <p>Joined {new Date(user.joinedon).toLocaleDateString()}</p>
              </div>
              <button 
                className="send-request-btn"
                onClick={() => handleSendRequest(user._id)}
              >
                <UserPlus size={18} />
              </button>
            </div>
          ))
        )}
      </div>
    )}
  </div>
</div>
);
};

export default FriendManager;