import {createSlice, PayloadAction, createAsyncThunk} from "@reduxjs/toolkit"
import { RootState } from "../store"
import axios from "axios"

interface loginState {
    username: string
    accessToken: string
    isAuthenticated: boolean,
}

interface registerRequest {
    firstName:string
    lastName: string
    email: string
    password: string
}

interface loginRequest {
    email: string
    password: string
}

interface loginResponse {
    success: boolean
    data:{
        firstName:string
        lastName: string
        token: string
    }
    message: string
}

const initialLogin: loginState = {
    username: "",
    accessToken: "",
    isAuthenticated: false,
}

export const register = createAsyncThunk("login/setRegister", async(data: registerRequest) =>{
    const response = await axios.post<loginResponse>("http://localhost:4000/api/user/register",{
        ...data
    })
    return response.data
})

export const login = createAsyncThunk("login/setLogin", async(data: loginRequest) =>{
    const response = await axios.post<loginResponse>("http://localhost:4000/api/user/login",{
        ...data
    })
    return response.data
})

export const loginSlide = createSlice({
    name: 'login',
    initialState: initialLogin,
    reducers:{

    },
    extraReducers: (builder) => {
        builder.addCase(register.fulfilled, (state: loginState, action: PayloadAction<loginResponse>) =>{            
            const {firstName, lastName, token } = action.payload.data;
            state.username = firstName + lastName
            state.isAuthenticated = token ? true : false
            state.accessToken = token
        })
        builder.addCase(login.fulfilled, (state: loginState, action: PayloadAction<loginResponse>) =>{
            const {firstName, lastName, token} = action.payload.data
            state.username = firstName + lastName
            state.isAuthenticated = token ? true : false
            state.accessToken = token
        })
    }
})

export const selecterLogin = (state: RootState) => state.login

export default loginSlide.reducer
