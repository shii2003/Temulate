import { combineReducers, configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/auth/authSlice";
import messageReducer from "./features/message/messageSlice"
import roomReducer from "./features/room/roomSlice"
import { persistReducer, persistStore, PURGE, REGISTER, REHYDRATE, FLUSH, PAUSE, PERSIST } from "redux-persist";

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
if (typeof window !== "undefined") {
    const localStorage = require("redux-persist/lib/storage").default;
    storage = localStorage;
} else {
    storage = createNoopStorage();
}

const authPersistConfig = {
    key: "auth",
    storage,
    whitelist: ["user"],
};

const roomPersistConfig = {
    key: "room",
    storage,
    whitelist: ["currentRoomId"],
};


const messagesPersistConfig = {
    key: "messages",
    storage,
};

const rootReducer = combineReducers({
    auth: persistReducer(authPersistConfig, authReducer),
    messages: persistReducer(messagesPersistConfig, messageReducer),
    room: persistReducer(roomPersistConfig, roomReducer),
});

export const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            },
        }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;