import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    // We will check for user data in localStorage to keep them logged in
    isAuthenticated: false,
    user: null, 
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        login: (state, action) => {
            state.isAuthenticated = true;
            state.user = action.payload;
        },
        logout: (state) => {
            state.isAuthenticated = false;
            state.user = null;
        },
    },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;