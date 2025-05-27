import * as api from "../api"

export const fetchallusers = () => async (dispatch) => {
    try {
        const { data } = await api.getallusers()
        dispatch({ type: "FETCH_USERS", payload: data })
    } catch (error) {
        console.log(error)
    }
}

export const updateprofile = (id, updatedata) => async (dispatch) => {
    try {
        const { data } = await api.updateprofile(id, updatedata)
        dispatch({ type: "UPDATE_CURRENT_USER", payload: data })
    } catch (error) {
        console.log(error)
    }
}

export const updateAvatar = (userId, avatarUrl) => async (dispatch) => {
    try {
        dispatch({
            type: 'UPDATE_AVATAR',
            payload: { userId, avatarUrl }
        })
    } catch (error) {
        console.log(error)
    }
}

export const updateFriendCount = (userId, count) => async (dispatch) => {
    try {
        dispatch({
            type: 'UPDATE_FRIEND_COUNT',
            payload: { userId, count }
        })
    } catch (error) {
        console.log(error)
    }
}

export const updatePostCount = (userId, count) => async (dispatch) => {
    try {
        dispatch({
            type: 'UPDATE_POST_COUNT',
            payload: { userId, count }
        })
    } catch (error) {
        console.log(error)
    }
}