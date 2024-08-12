import { createSlice } from "@reduxjs/toolkit";


const superappSlice = createSlice({
    name: "superapp",
    initialState: {
        superapp: null,
        submitted: false
    },
    reducers: {
        setSuperapp: (state, action) => {
            state.superapp = action.payload;
        },
        setSubmitted: (state, action) => {
            state.submitted =action.payload;
        }
    },
});

export const superappActions = superappSlice.actions;
export default superappSlice;