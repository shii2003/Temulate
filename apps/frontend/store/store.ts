import { combineReducers, configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/auth/authSlice";
import roomReducer from "./features/room/roomSlice";
import chatReducer from "./features/chat/chatSlice";
import { FLUSH, PAUSE, PERSIST, persistReducer, persistStore, PURGE, REGISTER, REHYDRATE } from "redux-persist";

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


const authPersistConfig = {
    key: 'auth',
    storage,
    whitelist: ['user']
};

const rootReducer = combineReducers({
    auth: persistReducer(authPersistConfig, authReducer),
    room: roomReducer,
    chat: chatReducer,
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


