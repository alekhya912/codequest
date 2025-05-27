const usersReducer = (state = [], action) => {
  switch (action.type) {
    case 'FETCH_USERS':
      return action.payload;
    case 'UPDATE_CURRENT_USER':
      return state.map(user => 
        user._id === action.payload._id ? action.payload : user
      );
    case 'UPDATE_AVATAR':
      return state.map(user =>
        user._id === action.payload.userId 
          ? { ...user, avatar: action.payload.avatarUrl }
          : user
      );
    case 'UPDATE_FRIEND_COUNT':
      return state.map(user =>
        user._id === action.payload.userId
          ? { ...user, friendCount: action.payload.count }
          : user
      );
    default:
      return state;
  }
};

export default usersReducer;