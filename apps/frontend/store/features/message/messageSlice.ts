import { RESET_ALL } from "@/store/store";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Message {
    id: number;
    userId: number;
    username: string;
    content: string;
    timestamp: Date | string;
}

interface MessageState {
    [roomId: number]: {
        messages: Message[];
        isLoading: boolean;
        hasMore: boolean;
        currentPage: number;
        totalMessages: number;
    };
}

const initialState: MessageState = {};

const MAX_MESSAGES_PER_ROOM = 500;

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
                state[roomId] = {
                    messages: [],
                    isLoading: false,
                    hasMore: false,
                    currentPage: 1,
                    totalMessages: 0,
                };
            }

            state[roomId].messages.push(message);
            state[roomId].totalMessages += 1;

            if (state[roomId].messages.length > MAX_MESSAGES_PER_ROOM) {
                state[roomId].messages = state[roomId].messages.slice(-MAX_MESSAGES_PER_ROOM);
            }
        },

        setMessages: (state, action: PayloadAction<{
            roomId: number;
            messages: Message[];
            pagination: {
                currentPage: number;
                totalPages: number;
                totalMessages: number;
                hasMore: boolean;
            };
        }>) => {
            const { roomId, messages, pagination } = action.payload;
            state[roomId] = {
                messages,
                isLoading: false,
                hasMore: pagination.hasMore,
                currentPage: pagination.currentPage,
                totalMessages: pagination.totalMessages,
            };
        },

        addMessagesToTop: (state, action: PayloadAction<{
            roomId: number;
            messages: Message[];
            pagination: {
                currentPage: number;
                totalPages: number;
                totalMessages: number;
                hasMore: boolean;
            };
        }>) => {
            const { roomId, messages, pagination } = action.payload;

            if (!state[roomId]) {
                state[roomId] = {
                    messages: [],
                    isLoading: false,
                    hasMore: false,
                    currentPage: 1,
                    totalMessages: 0,
                };
            }

            state[roomId].messages.unshift(...messages);
            state[roomId].hasMore = pagination.hasMore;
            state[roomId].currentPage = pagination.currentPage;
            state[roomId].totalMessages = pagination.totalMessages;


            if (state[roomId].messages.length > MAX_MESSAGES_PER_ROOM) {
                state[roomId].messages = state[roomId].messages.slice(-MAX_MESSAGES_PER_ROOM);
            }
        },

        setLoading: (state, action: PayloadAction<{
            roomId: number;
            isLoading: boolean;
        }>) => {
            const { roomId, isLoading } = action.payload;
            if (!state[roomId]) {
                state[roomId] = {
                    messages: [],
                    isLoading: false,
                    hasMore: false,
                    currentPage: 1,
                    totalMessages: 0,
                };
            }
            state[roomId].isLoading = isLoading;
        },

        clearRoomMessages: (state, action: PayloadAction<number>) => {
            delete state[action.payload];
        },

        resetMessages: () => initialState,
    },
    extraReducers: (builder) => {
        builder.addCase(RESET_ALL, () => initialState);
    },
});

export const {
    addMessage,
    setMessages,
    addMessagesToTop,
    setLoading,
    clearRoomMessages,
    resetMessages
} = messageSlice.actions;

export default messageSlice.reducer;