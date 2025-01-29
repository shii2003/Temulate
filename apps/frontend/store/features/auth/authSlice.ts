import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

type User = {
    id: number;
    username: string;
    email: string;
}

type AuthState = {
    user: User | null;
    isLoading: boolean;
    error: string | null;
}

const initialState: AuthState = {
    user: null,
    isLoading: false,
    error: null,
};

export const signup = createAsyncThunk(
    'auth/signup',
    async (
        credentials: { username: string; email: string; password: string; confirmPassword: string },
        { rejectWithValue }
    ) => {
        try {
            const response = await axios.post("http://localhost:4004/api/v1/auth/signup",
                credentials,
                { withCredentials: true }
            );
            return response.data.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to signup');
        }
    }
);

export const login = createAsyncThunk(
    'auth/login',
    async (credentials:
        { email: string; password: string }, { rejectWithValue }) => {
        try {
            const repsonse = await axios.post(
                'http://localhost:4004/api/v1/auth/login',
                credentials,
                { withCredentials: true }
            );
            return repsonse.data.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to login')
        }
    }
);

export const logout = createAsyncThunk(
    'auth/logout',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.post(
                'http://localhost:4004/api/v1/auth/logout',
                {},
                { withCredentials: true }
            );
            return response.data.message;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to logout');
        }
    }
);

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(login.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(login.fulfilled, (state, action) => {
                state.isLoading = false;
                state.user = action.payload;
            })
            .addCase(login.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            .addCase(logout.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(logout.fulfilled, (state) => {
                state.isLoading = false;
                state.user = null;
            })
            .addCase(logout.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            .addCase(signup.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(signup.fulfilled, (state, action) => {
                state.isLoading = false;
                state.user = action.payload;
            })
            .addCase(signup.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
    },
});

export default authSlice.reducer;