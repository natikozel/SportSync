import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
    name: "user",
    initialState: {
        email: null,
        role: null,
        userSuperapp: null,
        submitted: false,
        type: null
    },
    reducers: {
        setEmail: (state, action) => {
            state.email = action.payload;
        },
        setRole(state ,action) {
            state.role = action.payload;
        },
        setUserSuperapp(state ,action) {
            state.userSuperapp = action.payload;
        },
        setSubmitted(state ,action) {
            state.submitted = action.payload;
        },
        setType(state, action) {
            state.type = action.payload;
        }
    },
});

export const userActions = userSlice.actions;
export default userSlice;