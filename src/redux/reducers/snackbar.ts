import {createSlice, PayloadAction} from "@reduxjs/toolkit";

interface initialStateState {
    timestamp: number,
    message: string | null,
    type: "normal" | "success" | "danger" | "warning" | null,
}

const initialState: initialStateState = {
    timestamp: Date.now() / 1000,
    message: null,
    type: null,
};

const snackbarSlice = createSlice({
    name: "snackbar",
    initialState: initialState,
    reducers: {
        setSnackbar(state, action: PayloadAction<{message: typeof initialState.message, type: typeof initialState.type}>) {
            state.timestamp = Date.now() / 1000;
            state.message = action.payload.message;
            state.type = action.payload.type;
        }
    }
});

export default snackbarSlice.reducer;

// ACTIONS
export const {setSnackbar} = snackbarSlice.actions;
