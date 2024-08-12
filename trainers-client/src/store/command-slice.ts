import { createSlice } from "@reduxjs/toolkit";


const commandSlice = createSlice({
    name: "command",
    initialState: {
        commandData: null,
    },
    reducers: {
        setCommandData: (state, action) => {
            state.commandData = action.payload;
        },
    },
});

export const commandActions = commandSlice.actions;
export default commandSlice;