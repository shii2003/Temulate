import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RESET_ALL } from '../../store'; // adjust path as needed

interface User {
    id: number;
    username: string;
};

interface RoomState {
    currentRoomId: number | null;
    currentRoomName: string | null
    members: User[];
};

const initialState: RoomState = {
    currentRoomId: null,
    currentRoomName: null,
    members: [],
}

const roomSlice = createSlice({
    name: 'room',
    initialState,
    reducers: {
        setCurrentRoom: (state, action: PayloadAction<{ id: number | null; name: string | null }>) => {
            state.currentRoomId = action.payload.id;
            state.currentRoomName = action.payload.name;
            if (action.payload.id === null) {
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
    extraReducers: (builder) => {
        builder.addCase(RESET_ALL, () => initialState);
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