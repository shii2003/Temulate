import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Message {
    userId: number;
    username: string;
    content: string;
    timestamp: Date;
}

interface MessagesState {
    [roomId: number]: Message[];
}

const initialState: MessagesState = {};

const messageSlice = createSlice({
    name: 'messages',
    initialState,
    reducers: {
        addMessage: (state, action: PayloadAction<{
            roomId: number;
            message: Message
        }>) => {
            const { roomId, message } = action.payload;
            if (!state[roomId]) {
                state[roomId] = [];
            }
            state[roomId].push(message);
        },
        clearRoomMessages: (state, action: PayloadAction<number>) => {
            delete state[action.payload];
        }
    },
});

export const { addMessage, clearRoomMessages } = messageSlice.actions;
export default messageSlice.reducer;