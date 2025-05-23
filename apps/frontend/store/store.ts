import { combineReducers, configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/auth/authSlice";
import roomReducer from "./features/room/roomSlice";
import chatReducer from "./features/chat/chatSlice";
import { persistReducer, persistStore } from "redux-persist";

const createNoopStorage = () => {
    return {
        getItem() {
            return Promise.resolve(null);
        },
        setItem() {
            return Promise.resolve();
        },
        removeItem() {
            return Promise.resolve();
        },
    };
};

let storage;
if (typeof window !== 'undefined') {
    const { default: localStorage } = require('redux-persist/lib/storage');
    storage = localStorage;
} else {
    storage = createNoopStorage();
}

// only persist user field
const authPersistConfig = {
    key: 'auth',
    storage,
    whitelist: ['user']
};

// only persist currentRoom field
const roomPersistConfig = {
    key: 'room',
    storage,
    whitelist: ['currentRoom']
};

const chatPersistConfig = {
    key: 'chat',
    storage,
    whitelist: ['messages'],
};

const rootReducer = combineReducers({
    auth: persistReducer(authPersistConfig, authReducer),
    room: persistReducer(roomPersistConfig, roomReducer),
    chat: persistReducer(chatPersistConfig, chatReducer),
})

export const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {

                ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
            },
        }),
});


export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

