import { createSlice } from "@reduxjs/toolkit";


const searchSlice = createSlice({
    name: "search",
    initialState: {
        searchBy: null,
        searchValue: null
    },
    reducers: {
        setSearchBy: (state, action) => {
            state.searchBy = action.payload;
        },
        setSearchValue(state ,action) {
            state.searchValue = action.payload;
        }
    },
});

export const searchActions = searchSlice.actions;
export default searchSlice;