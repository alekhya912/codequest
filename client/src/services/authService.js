import API from './api';

// Action Types
export const LOGIN = 'LOGIN';
export const REGISTER = 'REGISTER';
export const LOGOUT = 'LOGOUT';

// Action Creators
export const login = (formData) => async (dispatch) => {
  try {
    const { data } = await API.post('/users/login', formData);
    
    localStorage.setItem('user', JSON.stringify(data));
    
    dispatch({
      type: LOGIN,
      payload: data
    });
    
    return data;
  } catch (error) {
    console.error('Login error:', error.response?.data?.message || error.message);
    throw error;
  }
};

export const register = (formData) => async (dispatch) => {
  try {
    const { data } = await API.post('/users', formData);
    
    localStorage.setItem('user', JSON.stringify(data));
    
    dispatch({
      type: REGISTER,
      payload: data
    });
    
    return data;
  } catch (error) {
    console.error('Registration error:', error.response?.data?.message || error.message);
    throw error;
  }
};

export const logout = () => (dispatch) => {
  localStorage.removeItem('user');
  
  dispatch({
    type: LOGOUT
  });
};

export const updateProfile = (profileData) => async (dispatch) => {
  try {
    const { data } = await API.put('/users/profile', profileData);
    
    // Update localStorage with new user data
    const currentUser = JSON.parse(localStorage.getItem('user'));
    localStorage.setItem('user', JSON.stringify({
      ...currentUser,
      ...data
    }));
    
    dispatch({
      type: LOGIN, // Reusing LOGIN action to update user state
      payload: data
    });
    
    return data;
  } catch (error) {
    console.error('Profile update error:', error.response?.data?.message || error.message);
    throw error;
  }
};