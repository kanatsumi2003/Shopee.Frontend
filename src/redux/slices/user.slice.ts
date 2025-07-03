import {createAsyncThunk, createSlice, type PayloadAction} from "@reduxjs/toolkit";
import {STATE_STATUS, type StateStatus} from "../../constants/auth.constant.ts";
import axiosInstance from "../../axios/axios.instance.ts";

interface UserProfile {
    email: string | null;
    phoneNumber: string | null;
    dateOfBirth: Date | null;
    name: string | null;
}

interface ForgotPasswordPayload {
    email: string | null;
    token: string | null;
    timestamp: string | null;
    newPassword: string | null;
}
interface UserState {
    profile: UserProfile | null;
    forgotPassword: ForgotPasswordPayload | null;
    status: StateStatus | null;
    error: string | null;
    isForgotPasswordModalOpen: boolean;
}

const initialState: UserState = {
    profile: null,
    forgotPassword: null,
    status: null,
    error: null,
    isForgotPasswordModalOpen: false,
}

export const fetchProfile = createAsyncThunk(
    'user/getProfile',
    async (_, thunkAPI) => {
        try {
            const response = await axiosInstance.get('users/profile', {
                requiresAuth: true
            })
            return response.data.data;
        } catch (err) {
            return thunkAPI.rejectWithValue('Get profile fail: ' + err);
        }
    }
)

export const registerAccount = createAsyncThunk(
    'user/registerAccount',
    async (payload: {
        email: string,
        password: string,
        name: string,
        dateOfBirth: Date,
        phoneNumber: string,
    }, thunkApi) => {
        try {
            const response = await axiosInstance.post('auths/register', payload);
            return response.data.data;
        } catch (err) {
            return thunkApi.rejectWithValue('Register account fail: ' + err);
        }
    }
)

export const confirmEmail = createAsyncThunk(
    'user/confirmEmail',
    async (payload: { email: string, emailOtp: string }, thunkAPI) => {
        try {
            const response = await axiosInstance.post('users/confirm-email', payload);
            return response.data.data;
        } catch (err) {
            return thunkAPI.rejectWithValue('Register account fail: ' + err);
        }

    }
)

export const forgotPassword = createAsyncThunk(
    'user/forgotPassword',
    async (payload: {
        email: string
    }, thunkAPI) => {
        try {
            const response = await axiosInstance.post('users/forgot-password', payload);
            return response.data.data;
        } catch (err) {
            return thunkAPI.rejectWithValue("Forgot password fail: " + err);
        }
    }
)

export const recoverPassword = createAsyncThunk (
    'user/recover-password',
    async (payload: {
        email: string,
        token: string,
        timestamp: string,
        newPassword: string
    }, thunkAPI) => {
        try {
            const response = await axiosInstance.put('users/recover-password', payload);
            return response.data.data;

        } catch(err) {
            return thunkAPI.rejectWithValue("Recover password fail: " + err);
        }
    }
)
const userSlice = createSlice({
    name: 'user',
    initialState: initialState,
    reducers: {
        openForgotPasswordModal(state) {
            state.isForgotPasswordModalOpen = true;
        },
        closeForgotPasswordModal(state) {
          state.isForgotPasswordModalOpen = false;
        },
        setRecoveryPasswordPayload(state, action: PayloadAction<ForgotPasswordPayload>) {
            state.forgotPassword = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchProfile.pending, (state) => {
                state.error = null;
                state.status = STATE_STATUS.LOADING
            })
            .addCase(fetchProfile.fulfilled, (state, action) => {
                state.status = STATE_STATUS.SUCCEEDED;
                state.error = null;
                state.profile = action.payload
            })
            .addCase(fetchProfile.rejected, (state) => {
                state.status = STATE_STATUS.FAILED;
                state.error = "Get profile fail";
            })
            .addCase(registerAccount.pending, (state) => {
                state.status = STATE_STATUS.LOADING;
            })
            .addCase(registerAccount.fulfilled, (state) => {
                state.status = STATE_STATUS.SUCCEEDED;
            })
            .addCase(registerAccount.rejected, (state) => {
                state.status = STATE_STATUS.FAILED;
                state.error = "Register fail"
            })
            .addCase(confirmEmail.pending, (state) => {
                state.status = STATE_STATUS.LOADING
            })
            .addCase(confirmEmail.fulfilled, (state) => {
                state.status = STATE_STATUS.SUCCEEDED;
            })
            .addCase(confirmEmail.rejected, (state) => {
                state.status = STATE_STATUS.FAILED;
                state.error = "Confirm email failed";
            })
            .addCase(forgotPassword.pending, (state) => {
                state.status = STATE_STATUS.LOADING
            })
            .addCase(forgotPassword.fulfilled, (state) => {
                state.status = STATE_STATUS.SUCCEEDED;
            })
            .addCase(forgotPassword.rejected, (state) => {
                state.status = STATE_STATUS.FAILED;
                state.error = "Forgot password failed"
            })
            .addCase(recoverPassword.pending, (state) => {
                state.status = STATE_STATUS.LOADING;
            })
            .addCase(recoverPassword.fulfilled, (state: UserState, action) => {
                state.status = STATE_STATUS.SUCCEEDED;
                state.forgotPassword = action.payload;
            })
            .addCase(recoverPassword.rejected, (state: UserState) => {
                state.status = STATE_STATUS.FAILED;
                state.error = "Forgot password failed";
            })
    }
})

export const userActions = userSlice.actions;
export const userReducer = userSlice.reducer;