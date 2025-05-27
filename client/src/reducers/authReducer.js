import { LOGIN, REGISTER, LOGOUT } from '../services/authService';

const storedUser = localStorage.getItem('user');
const initialState = storedUser ? { isLoggedIn: true, user: JSON.parse(storedUser) } : { isLoggedIn: false, user: null };

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN:
    case REGISTER:
      return {
        ...state,
        isLoggedIn: true,
        user: action.payload
      };
    case LOGOUT:
      return {
        ...state,
        isLoggedIn: false,
        user: null
      };
    default:
      return state;
  }
};

export default authReducer;