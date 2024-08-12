import {configureStore} from "@reduxjs/toolkit";

import userSlice from "./user-slice";
import searchSlice from "./search-slice";
import superappSlice from "./superapp-slice";
import commandSlice from "./command-slice";
import objectSlice from "./object-slice";

const store = configureStore({
    reducer: {
        user: userSlice.reducer,
        search: searchSlice.reducer,
        superapp: superappSlice.reducer,
        command: commandSlice.reducer,
        object: objectSlice.reducer
    }
});

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>

export default store;