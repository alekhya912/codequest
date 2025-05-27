import * as api from "../api";

// Action Types
export const FETCH_USERS = 'FETCH_USERS';
export const UPDATE_CURRENT_USER = 'UPDATE_CURRENT_USER';
export const UPDATE_AVATAR = 'UPDATE_AVATAR';

// Action Creators
export const fetchAllUsers = () => async (dispatch) => {
  try {
    const { data } = await api.getallusers();
    
    dispatch({
      type: FETCH_USERS,
      payload: data
    });
    
    return data;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

export const updateProfile = (id, updateData) => async (dispatch) => {
  try {
    const { data } = await api.updateProfile(id, updateData);
    
    dispatch({
      type: UPDATE_CURRENT_USER,
      payload: data
    });
    
    return data;
  } catch (error) {
    console.error('Error updating profile:', error);
    throw error;
  }
};

export const updateAvatar = (userId, avatarUrl) => async (dispatch) => {
  try {
    const { data } = await api.updateAvatar(userId, avatarUrl);
    
    dispatch({
      type: UPDATE_AVATAR,
      payload: { userId, avatarUrl }
    });
    
    return data;
  } catch (error) {
    console.error('Error updating avatar:', error);
    throw error;
  }
};
