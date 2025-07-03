import {configureStore} from "@reduxjs/toolkit";
import {authReducer} from "./slices/auth.slice.ts";
import {userReducer} from "./slices/user.slice.ts";

export const store = configureStore({
    reducer: {
        auth: authReducer,
        user: userReducer,
    }
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;