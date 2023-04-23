import {createSlice, PayloadAction, createAsyncThunk} from "@reduxjs/toolkit"
import { RootState } from "../store"
import axios from "axios"
import { IResponse } from "../../utils/type"
import React from "react"

interface IProduct {
    name: String
    regularPrice: String
    salePrice: String
    image: String | ArrayBuffer
    description: String
}

interface IFieldInput {
    name: String,
    regularPrice: String,
    salePrice: String,
    description: string | readonly string[] | undefined,
    image: String | ArrayBuffer | null
}

const initialProduct:IProduct = {
    name:"",
    regularPrice: "",
    salePrice: "",
    image:"",
    description:""
}



export const createProduct = createAsyncThunk("product/create", async(data: IFieldInput) =>{
    const response = await axios.post<IResponse>("http://localhost:4000/product/create",{
        ...data
    })
    return response.data
})

export const productSlide = createSlice({
    name: 'product',
    initialState: initialProduct,
    reducers:{
        handleChangeInput: (state, action: PayloadAction<React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>>) =>{
            return {...state, [action.payload.target.name]:[action.payload.target.value]}
        },
        setProduct:(state, action: PayloadAction<IProduct>) =>{
                return {...action.payload}
        },
        clearProduct: (state, action) =>{
            return {...state, name: "", description: "", regularPrice:"", salePrice:"", image:""}
        }
    }
})

export const selecterProduct = (state: RootState) => state.product

export const {
    handleChangeInput,
    setProduct,
    clearProduct
} = productSlide.actions

export default productSlide.reducer
