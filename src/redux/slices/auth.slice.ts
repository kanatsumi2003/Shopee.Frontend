import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {isTokenExpired} from "../../utils/token.helper.ts";
import axiosInstance from "../../axios/axios.instance.ts";
import {STATE_STATUS, type StateStatus} from "../../constants/auth.constant.ts";

interface AuthState {
    accessToken: string | null;
    refreshToken: string | null;
    expireAt: string | null;
    isLoggedIn: boolean;
    status: StateStatus | null;
    error: string | null;
    isTokenValid: boolean | null;
}


const initialState: AuthState = {
    accessToken: null,
    refreshToken: null,
    expireAt: null,
    isLoggedIn: false,
    status: null,
    error: null,
    isTokenValid: false,
}

export const loginUser = createAsyncThunk(
    'auth/loginUser',
    async (payload: { email: string, password: string }, thunkAPI) => {
        try {
            const response = await axiosInstance.post('/auths/login', payload)
                .catch(err => {
                    return err.response;
                });
            const data = response?.data;

            if (response?.status !== 200) {
                return thunkAPI.rejectWithValue(response?.data.errorMessage);
            }

            localStorage.setItem('accessToken', data.data.accessToken);
            localStorage.setItem('refreshToken', data.data.refreshToken);
            localStorage.setItem('expireAt', data.data.expireAt);

            return data.data;
        } catch (err) {
            return thunkAPI.rejectWithValue('Login failed: ' + err);
        }
    }
);

export const validateTokenExpireOrNot = createAsyncThunk(
    'auth/validateTokenExpireOrNot',
    async (_, thunkApi) => {
        try {
            const accessToken = localStorage.getItem('accessToken')
            const refreshToken = localStorage.getItem('refreshToken')
            const expireAt = localStorage.getItem('expireAt')

            if (!accessToken || !refreshToken || !expireAt) {
                return thunkApi.rejectWithValue("Validate token fail: ");
            }

            return !isTokenExpired(accessToken);
        } catch (err) {
            return thunkApi.rejectWithValue("Validate token fail: " + err);
        }
    }
)

export const refreshAccessToken = createAsyncThunk(
    'auth/refreshAccessToken',
    async (refreshToken: string, thunkApi) => {
        try {
            const response = await axiosInstance.post('/auths/access-token', {
                refreshToken: refreshToken,
            });

            return response.data.data;
        } catch (err) {
            console.log(err);
            return thunkApi.rejectWithValue('Refresh token failed: ' + err);
        }
    }
)
const authSlice = createSlice({
    name: "auth",
    initialState: initialState,
    reducers: {
        setToken: (state: AuthState) => {
            const accessToken = localStorage.getItem('accessToken');
            const refreshToken = localStorage.getItem('refreshToken');
            const expireAt = localStorage.getItem('expireAt');
            if (accessToken && refreshToken && !isTokenExpired(expireAt)) {
                state.accessToken = accessToken;
                state.refreshToken = refreshToken;
                state.expireAt = expireAt;
                state.isLoggedIn = true;
            } else {
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
                localStorage.removeItem('expireAt');

                state.accessToken = null;
                state.refreshToken = null;
                state.expireAt = null;
                state.isLoggedIn = false;
            }
        },
        logout: (state: AuthState) => {
            state.accessToken = null;
            state.refreshToken = null;
            state.expireAt = null;
            state.isLoggedIn = false;
            localStorage.clear();
        },

        // refreshAccessToken: (state: AuthState) => {
        //     const accessToken = localStorage.getItem('accessToken');
        //     const refreshToken = localStorage.getItem('refreshToken');
        //     const expireAt = localStorage.getItem('expireAt');
        //
        //     if(accessToken && refreshToken && expireAt && !isTokenExpired(expireAt)) {
        //         state.accessToken = accessToken;
        //         state.refreshToken = refreshToken;
        //         state.expireAt = expireAt;
        //     } else {
        //         state.accessToken = null;
        //         state.refreshToken = null;
        //         state.expireAt = null;
        //         state.isLoggedIn = false;
        //
        //         localStorage.removeItem('accessToken');
        //         localStorage.removeItem('refreshToken');
        //         localStorage.removeItem('expireAt');
        //     }
        // }

    },
    extraReducers: (builder) => {
        builder
            .addCase(loginUser.pending, (state) => {
                state.status = STATE_STATUS.LOADING;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.status = STATE_STATUS.SUCCEEDED;
                state.accessToken = action.payload.accessToken;
                state.refreshToken = action.payload.refreshToken;
                state.expireAt = action.payload.expireAt;
                state.isLoggedIn = true;
                state.error = null;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.status = STATE_STATUS.FAILED;
                state.error = action.payload as string || "Đăng nhập thất bại";
            })
            .addCase(refreshAccessToken.pending, (state) => {
                state.status = STATE_STATUS.LOADING;
                state.error = null;
            })
            .addCase(refreshAccessToken.fulfilled, (state, action) => {
                state.accessToken = action.payload.accessToken
                state.status = STATE_STATUS.SUCCEEDED;
            })
            .addCase(refreshAccessToken.rejected, (state) => {
                state.status = STATE_STATUS.FAILED;
                state.error = "Refresh accessToken failed";
            })
            .addCase(validateTokenExpireOrNot.pending, (state) => {
                state.status = STATE_STATUS.LOADING;
                state.error = null;
            })
            .addCase(validateTokenExpireOrNot.fulfilled, (state, action) => {
                state.status = STATE_STATUS.SUCCEEDED;
                state.isTokenValid = action.payload;
            })
            .addCase(validateTokenExpireOrNot.rejected, (state) => {
                state.status = STATE_STATUS.FAILED;
                state.isTokenValid = false;
            })
    }
})

export const authActions = authSlice.actions;
export const authReducer = authSlice.reducer;