import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    items: [] // массив ISBN
};

const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        setCart: (state, action) => {
            state.items = action.payload;
        },

        addToCart: (state, action) => {
            if (!state.items.includes(action.payload)) {
                state.items.push(action.payload);
            }
        },

        removeFromCart: (state, action) => {
            state.items = state.items.filter(isbn => isbn !== action.payload);
        }
    }
});

export const { addToCart, removeFromCart, setCart } = cartSlice.actions;
export const cartReducer = cartSlice.reducer;
