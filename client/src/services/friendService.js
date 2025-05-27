const mockFriends = [
{
id: 'friend1',
userId: 'user1',
friendId: 'user2',
status: 'accepted',
createdAt: '2025-02-10T14:30:00Z'
},
{
id: 'friend2',
userId: 'user1',
friendId: 'user3',
status: 'accepted',
createdAt: '2025-02-15T10:15:00Z'
},
{
id: 'friend3',
userId: 'user2',
friendId: 'user1',
status: 'accepted',
createdAt: '2025-02-10T14:30:00Z'
}
];

// Action Types
export const GET_FRIENDS = 'GET_FRIENDS';
export const SEND_FRIEND_REQUEST = 'SEND_FRIEND_REQUEST';
export const ACCEPT_FRIEND_REQUEST = 'ACCEPT_FRIEND_REQUEST';
export const REJECT_FRIEND_REQUEST = 'REJECT_FRIEND_REQUEST';
export const REMOVE_FRIEND = 'REMOVE_FRIEND';

// Action Creators
export const getFriends = (userId) => async (dispatch) => {
try {
// Simulate API delay
await new Promise(resolve => setTimeout(resolve, 1000));


  // In a real app, you'd filter on the server
  const userFriends = mockFriends.filter(
    friend => friend.userId === userId || friend.friendId === userId
  );
  
  dispatch({
    type: GET_FRIENDS,
    payload: userFriends
  });
  
  return userFriends;
} catch (error) {
  console.error('Error fetching friends:', error);
  throw error;
}
};

export const sendFriendRequest = (userId, friendId) => async (dispatch) => {
try {
// Simulate API delay
await new Promise(resolve => setTimeout(resolve, 500));


  const newFriendship = {
    id: Date.now().toString(),
    userId,
    friendId,
    status: 'pending',
    createdAt: new Date().toISOString()
  };
  
  dispatch({
    type: SEND_FRIEND_REQUEST,
    payload: newFriendship
  });
  
  return newFriendship;
} catch (error) {
  console.error('Error sending friend request:', error);
  throw error;
}
};

export const acceptFriendRequest = (friendshipId) => async (dispatch) => {
try {
// Simulate API delay
await new Promise(resolve => setTimeout(resolve, 500));


  dispatch({
    type: ACCEPT_FRIEND_REQUEST,
    payload: { friendshipId }
  });
} catch (error) {
  console.error('Error accepting friend request:', error);
  throw error;
}
};

export const rejectFriendRequest = (friendshipId) => async (dispatch) => {
try {
// Simulate API delay
await new Promise(resolve => setTimeout(resolve, 500));


  dispatch({
    type: REJECT_FRIEND_REQUEST,
    payload: { friendshipId }
  });
} catch (error) {
  console.error('Error rejecting friend request:', error);
  throw error;
}
};

export const removeFriend = (friendshipId) => async (dispatch) => {
try {
// Simulate API delay
await new Promise(resolve => setTimeout(resolve, 500));


  dispatch({
    type: REMOVE_FRIEND,
    payload: { friendshipId }
  });
} catch (error) {
  console.error('Error removing friend:', error);
  throw error;
}
};
