import { api } from "../../services/api";
import { loginFail, loginSuccess, setLoading, setUser } from "../reducers/userSlice";



// Register User Action *************

export const registerUserAction = (registerData) => async (dispatch, getstate) => {
    try {
        dispatch(setLoading());
        const { data } = await api.post('/auth/admin/register', registerData)
        if (data.admin) {
            dispatch(loginSuccess(data.admin));
        }
        return data;
    } catch (err) {
        const message = err?.response?.data?.message || "Something went wrong";
        dispatch(loginFail(message));
        throw err;
    }
}


// Login User Action *************

export const loginUserAction = (loginData) => async (dispatch, getstate) => {
    try {
        dispatch(setLoading());
        const { data } = await api.post('/auth/admin/login', loginData);
        if (data.admin) {
            dispatch(loginSuccess(data.admin));
        }
        return data;
    } catch (err) {
        const message = err?.response?.data?.message || "Something went wrong";
        dispatch(loginFail(message));
        throw err;
    }
}

// Current User Action *************

export const currentUserAction = () => async (dispatch, getstate) => {
    try {
        dispatch(setLoading());
        const { data } = await api.get('/auth/admin/get-details');

        // console.log("currentUser Response" , data);
        if (data.admin) {
            dispatch(setUser(data.admin));
        }
        return data;

    } catch (err) {
        dispatch(setUser(null));
        console.log("Error in currentUserAction", err);
        return null;
    }
}