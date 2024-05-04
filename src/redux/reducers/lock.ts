import {createSlice} from "@reduxjs/toolkit";

interface initialStateState {
    nAttemptConnect: number,
    fetching: boolean,
}

const initialState: initialStateState = {
    nAttemptConnect: 0,
    fetching: false,
};

const lockSlice = createSlice({
    name: "lock",
    initialState: initialState,
    reducers: {
        setNAttemptConnect(state, action) {
            state.nAttemptConnect = action.payload;
        },
        addNAttemptConnect(state) {
            state.nAttemptConnect = state.nAttemptConnect + 1;
        },
        setLockFetching(state, action) {
            state.fetching = action.payload;
        },
    },
});

export default lockSlice.reducer;

// ACTIONS
export const {
    setNAttemptConnect,
    addNAttemptConnect,
    setLockFetching,
} = lockSlice.actions;
