import { NewMessagePayload, UserJoinedPayload, UserLeftPayload } from "@/types/ws-types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ChatState {
    messages: NewMessagePayload[];
    usersInRoom: { id: number; username: string }[];
    error: string | null;
}

const initialState: ChatState = {
    messages: [],
    usersInRoom: [],
    error: null,
};

const chatSlice = createSlice({
    name: 'chat',
    initialState,
    reducers: {
        addMessage: (state, action: PayloadAction<NewMessagePayload>) => {
            state.messages.push(action.payload);
        },
        userJoined: (state, action: PayloadAction<UserJoinedPayload>) => {

            if (!state.usersInRoom.some(u => u.id === action.payload.user.id)) {
                state.usersInRoom.push(action.payload.user);
            }
        },
        userLeft: (state, action: PayloadAction<UserLeftPayload>) => {
            state.usersInRoom = state.usersInRoom.filter(
                (user) => user.id !== action.payload.userId
            );
        },
        clearChat: (state) => {

            state.messages = [];
            state.usersInRoom = [];
        },

    },
});

export const { addMessage, userJoined, userLeft, clearChat } = chatSlice.actions;
export default chatSlice.reducer;


