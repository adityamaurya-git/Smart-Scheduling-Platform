import { createSlice } from "@reduxjs/toolkit";


const initialState ={
    user: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
}

export const userSlice = createSlice({
    name:"user",
    initialState,
    reducers:{
        setLoading: (state) => {
            state.isLoading = true;
            state.error = null;
        },
        loginSuccess: (state, action) => {
            state.isLoading = false;
            state.user = action.payload;
            state.isAuthenticated = true;
            state.error = null;
        },
        loginFail: (state, action) => {
            state.isLoading = false;
            state.error = action.payload || "Something went wrong";
            state.isAuthenticated = false;
        },
        logout: (state) => {
            state.user = null;
            state.isAuthenticated = false;
            state.error = null;
            state.isLoading = false;
        },
        setUser: (state, action) => { // for currentUser fetch
            state.user = action.payload;
            state.isAuthenticated = !!action.payload;
            state.isLoading = false;
            state.error = null;
        },
    }
})

export const {setLoading , loginSuccess , loginFail , logout , setUser} = userSlice.actions;