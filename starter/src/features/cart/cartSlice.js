import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from "axios"

const url = 'https://course-api.com/react-useReducer-cart-project'

const initialState = {
  cartItems: [],
  amount: 0,
  total: 0,
  isLoading: true,
}

export const getCartItems = createAsyncThunk('cart/getCartItems', async () => {
  try {
    const response = await axios.get(url)
    const data = response.data
    return data
  } catch (error) {
    
  }
})

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    clearCart: (state) => {
      state.cartItems = []
      state.amount = 0
      state.total = 0
      state.isLoading = false
    },
    removeItem: (state, action) => {
      const itemID = action.payload
      state.cartItems = state.cartItems.filter((item) => item.id !== itemID)
    },
    increase: (state, { payload }) => {
      const cartItem = state.cartItems.find((item) => item.id === payload.id)
      cartItem.amount += 1
    },
    decrease: (state, { payload }) => {
      const cartItem = state.cartItems.find((item) => item.id === payload.id)
      cartItem.amount -= 1
    },
    calculateTotals: (state) => {
      let { total, amount } = state.cartItems.reduce(
        (accumulator, cartItem) => {
          accumulator.amount += cartItem.amount
          accumulator.total += cartItem.amount * cartItem.price
          return accumulator
        },
        { total: 0, amount: 0 }
      )
      console.log(total, amount)
      state.amount = amount
      state.total = total
    },
  },
  extraReducers: {
    [getCartItems.pending]: (state) => {
      state.isLoading = true
    },
    [getCartItems.fulfilled]: (state, action) => {
      console.log(action)
      state.isLoading = false
      state.cartItems = action.payload
    },
    [getCartItems.rejected]: (state) => {
      state.isLoading = false
    },
  },
})

export const { clearCart, removeItem, increase, decrease, calculateTotals } =
  cartSlice.actions

export default cartSlice.reducer
