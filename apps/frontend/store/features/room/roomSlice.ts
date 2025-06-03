import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface RoomState {
    currentRoom: { id: number; name: string } | null;
    error: string | null;
}

const initialState: RoomState = {
    currentRoom: null,
    error: null,
};

const roomSlice = createSlice({
    name: 'room',
    initialState,
    reducers: {
        setRoom: (state, action: PayloadAction<{ id: number; name: string } | null>) => {
            state.currentRoom = action.payload;
            state.error = null; // Clear error on successful room set
        },
        setRoomError: (state, action: PayloadAction<string | null>) => {
            state.error = action.payload;
        },
    },
});

export const { setRoom, setRoomError } = roomSlice.actions;
export default roomSlice.reducer;