import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { BasketItem, BasketState } from "../../types/basket.types";

const initialState: BasketState = {
  items: [],
  loading: false,
  error: null,
};

const basketSlice = createSlice({
  name: "basket",
  initialState,
  reducers: {
    addItem: (state, action: PayloadAction<Omit<BasketItem, 'quantity'>>) => {
      const existing = state.items.find(i => i.id === action.payload.id);
      if (existing) {
        existing.quantity += 1;
      } else {
        state.items.push({ ...action.payload, quantity: 1 });
      }
    },
    removeItem: (state, action: PayloadAction<number>) => {
      const index = state.items.findIndex(i => i.id === action.payload);
      if (index !== -1) {
        const item = state.items[index];
        if (item.quantity > 1) {
          item.quantity -= 1;
        } else {
          state.items.splice(index, 1);
        }
      }
    },
    removeItemCompletely: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter(i => i.id !== action.payload);
    },
    updateQuantity: (state, action: PayloadAction<{ id: number; quantity: number }>) => {
      const item = state.items.find(i => i.id === action.payload.id);
      if (item && action.payload.quantity > 0) {
        item.quantity = action.payload.quantity;
      }
    },
    clearBasket: (state) => {
      state.items = [];
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const { 
  addItem, 
  removeItem, 
  removeItemCompletely,
  updateQuantity,
  clearBasket,
  setLoading,
  setError 
} = basketSlice.actions;
export default basketSlice.reducer;