import basketReducer, {
  addItem,
  removeItem,
  removeItemCompletely,
  updateQuantity,
  clearBasket,
  setLoading,
  setError
} from "../features/basket/basketSlice";
import { BasketState } from "../types/basket.types";

describe('basket slice', () => {
  let initialState: BasketState;

  beforeEach(() => {
    initialState = {
      items: [],
      loading: false,
      error: null,
    };
  });

  test('should handle initial state', () => {
    expect(basketReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  test('should handle addItem with new item', () => {
    const newItem = { id: 1, name: 'Soup', price: 2 };
    const actual = basketReducer(initialState, addItem(newItem));
    
    expect(actual.items).toHaveLength(1);
    expect(actual.items[0]).toEqual({ ...newItem, quantity: 1 });
  });

  test('should handle addItem with existing item', () => {
    const stateWithItem: BasketState = {
      ...initialState,
      items: [{ id: 1, name: 'Soup', price: 2, quantity: 1 }]
    };
    
    const newItem = { id: 1, name: 'Soup', price: 2 };
    const actual = basketReducer(stateWithItem, addItem(newItem));
    
    expect(actual.items).toHaveLength(1);
    expect(actual.items[0].quantity).toBe(2);
  });

  test('should handle removeItem with quantity > 1', () => {
    const stateWithItem: BasketState = {
      ...initialState,
      items: [{ id: 1, name: 'Soup', price: 2, quantity: 2 }]
    };
    
    const actual = basketReducer(stateWithItem, removeItem(1));
    
    expect(actual.items).toHaveLength(1);
    expect(actual.items[0].quantity).toBe(1);
  });

  test('should handle removeItem with quantity = 1', () => {
    const stateWithItem: BasketState = {
      ...initialState,
      items: [{ id: 1, name: 'Soup', price: 2, quantity: 1 }]
    };
    
    const actual = basketReducer(stateWithItem, removeItem(1));
    
    expect(actual.items).toHaveLength(0);
  });

  test('should handle removeItemCompletely', () => {
    const stateWithItem: BasketState = {
      ...initialState,
      items: [{ id: 1, name: 'Soup', price: 2, quantity: 3 }]
    };
    
    const actual = basketReducer(stateWithItem, removeItemCompletely(1));
    
    expect(actual.items).toHaveLength(0);
  });

  test('should handle updateQuantity', () => {
    const stateWithItem: BasketState = {
      ...initialState,
      items: [{ id: 1, name: 'Soup', price: 2, quantity: 1 }]
    };
    
    const actual = basketReducer(stateWithItem, updateQuantity({ id: 1, quantity: 5 }));
    
    expect(actual.items[0].quantity).toBe(5);
  });

  test('should handle clearBasket', () => {
    const stateWithItems: BasketState = {
      ...initialState,
      items: [
        { id: 1, name: 'Soup', price: 2, quantity: 1 },
        { id: 2, name: 'Bread', price: 1.5, quantity: 2 }
      ]
    };
    
    const actual = basketReducer(stateWithItems, clearBasket());
    
    expect(actual.items).toHaveLength(0);
  });

  test('should handle setLoading', () => {
    const actual = basketReducer(initialState, setLoading(true));
    expect(actual.loading).toBe(true);
  });

  test('should handle setError', () => {
    const errorMessage = 'Test error';
    const actual = basketReducer(initialState, setError(errorMessage));
    expect(actual.error).toBe(errorMessage);
  });
});