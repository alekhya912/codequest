import {
GET_FRIENDS,
SEND_FRIEND_REQUEST,
ACCEPT_FRIEND_REQUEST,
REJECT_FRIEND_REQUEST,
REMOVE_FRIEND
} from '../services/friendService.js';

const friendsReducer = (state = [], action) => {
switch (action.type) {
case GET_FRIENDS:
return action.payload;


  case SEND_FRIEND_REQUEST:
    return [...state, action.payload];
    
  case ACCEPT_FRIEND_REQUEST:
    return state.map((friendship) => 
      friendship.id === action.payload.friendshipId 
        ? { ...friendship, status: 'accepted' } 
        : friendship
    );
    
  case REJECT_FRIEND_REQUEST:
  case REMOVE_FRIEND:
    return state.filter(
      (friendship) => friendship.id !== action.payload.friendshipId
    );
    
  default:
    return state;
}
};

export default friendsReducer;