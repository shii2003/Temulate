import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface User {
    id: number;
    username: string;
    email?: string;
}

interface Message {
    userId: number;
    username: string;
    content: string;
    timestamp: string;
}

interface ChatState {
    messages: Message[];
    onlineUses: User[];
    currentRoomId: string | null;
}

const initialState: ChatState = {
    messages: [],
    onlineUses: [],
    currentRoomId: null,
};

export const chatSlice = createSlice({
    name: "chat",
    initialState,
    reducers: {
        addMessage: (state, action: PayloadAction<Message>) => {
            //keeping only the recent 1000 message for smoother function of the UI
            if (state.messages.length >= 1000) {
                state.messages.shift();
            }
            state.messages.push(action.payload);
        },

        setOnlineUsers: (state, action: PayloadAction<User[]>) => {
            state.onlineUses = action.payload;
        },

        addUser: (state, action: PayloadAction<User>) => {
            if (!state.onlineUses.some((user) => user.id === action.payload.id)) {
                state.onlineUses.push(action.payload)
            }
        },

        removeUser: (state, action: PayloadAction<number>) => {
            state.onlineUses = state.onlineUses.filter(
                (user) => user.id !== action.payload
            )
        },

        setCurrentRoom: (state, action: PayloadAction<string>) => {
            state.currentRoomId = action.payload;
        },

        //clearning chat when leaving the room
        clearChat: (state) => {
            state.messages = [];
            state.onlineUses = [];
            state.currentRoomId = null;
        }
    },
});

export const {
    addMessage,
    setOnlineUsers,
    addUser,
    removeUser,
    setCurrentRoom,
    clearChat
} = chatSlice.actions;

export default chatSlice.reducer;

