import {createSlice} from "@reduxjs/toolkit";


interface initialStateState {
    name: string | null
}

const initialState: initialStateState = {
    name: null
};

const processSlice = createSlice({
    name: "process",
    initialState: initialState,
    reducers: {
        setProcess(state, action) {
            state.name = action.payload;
        }
    }
});

export default processSlice.reducer;

// ACTIONS
export const {
    setProcess
} = processSlice.actions;
