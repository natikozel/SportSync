import { createSlice, current } from "@reduxjs/toolkit";
import {MyObject} from "../components/ObjectAPI/Objects";

interface ObjectState {
    objectsData: Array<any>,
    requestsData: any
}

const INITIAL_OBJECT_STATE: ObjectState = {
    objectsData: [],
    requestsData: null

}

const objectSlice = createSlice({
    name: "object",
    initialState: INITIAL_OBJECT_STATE,
    reducers: {
        setObjectData: (state, action) => {
            const newObject = action.payload;
            if (!!newObject.length){
                state.objectsData = newObject
                return state
            }

            const existingObject = current(state).objectsData.find((obj: MyObject) => {
                return obj.objectId.id === newObject.objectId.id
            });

            if (!existingObject)
                state.objectsData.push(newObject);
        },
        setRequestsData(state, action) {
            state.requestsData = action.payload;
        }
    },
});

export const objectActions = objectSlice.actions;
export default objectSlice;