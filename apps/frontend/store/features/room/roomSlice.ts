import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface RoomState {
    currentRoom: {
        id: number | null;
        name: string | null;
    };
    isLoading: boolean;
    error: string | null;
}

const initialState: RoomState = {
    currentRoom: {
        id: null,
        name: null,
    },
    isLoading: false,
    error: null,
};

export const roomSlice = createSlice({
    name: "room",
    initialState,
    reducers: {
        setRoom: (state, action: PayloadAction<{ id: number; name: string }>) => {
            state.currentRoom = action.payload;
        },
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload;
        },
        setError: (state, action: PayloadAction<string | null>) => {
            state.error = action.payload;
        },
        leaveRoom: (state) => {
            state.currentRoom = { id: null, name: null };
        },
    },
});

export const { setRoom, setLoading, setError, leaveRoom } = roomSlice.actions;
export default roomSlice.reducer;