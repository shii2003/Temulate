import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface User {
    id: number;
    username: string;
};

interface RoomState {
    currentRoomId: number | null;
    members: User[];
};

const initialState: RoomState = {
    currentRoomId: null,
    members: [],
}

const roomSlice = createSlice({
    name: 'room',
    initialState,
    reducers: {
        setCurrentRoom: (state, action: PayloadAction<number | null>) => {
            state.currentRoomId = action.payload;

            if (action.payload === null) {
                state.members = [];
            }
        },
        setRoomMembers: (state, action: PayloadAction<User[]>) => {
            state.members = action.payload;
        },
        addRoomMember: (state, action: PayloadAction<User>) => {
            if (!state.members.some(member => member.id === action.payload.id)) {
                state.members.push(action.payload);
            }
        },
        removeRoomMember: (state, action: PayloadAction<number>) => {
            state.members = state.members.filter(member => member.id !== action.payload);
        },
        resetRoomState: () => initialState,
    },
});

export const {
    setCurrentRoom,
    setRoomMembers,
    addRoomMember,
    removeRoomMember,
    resetRoomState
} = roomSlice.actions;

export default roomSlice.reducer;