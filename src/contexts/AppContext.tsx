import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { User, CartItem, Order, MenuItem } from '../types';
import { useSupabaseAuth } from '../hooks/useSupabase';
import { orderService, menuService } from '../services/database';

interface AppState {
  user: User | null;
  cart: CartItem[];
  orders: Order[];
  currentView: string;
  isLoading: boolean;
  menuItems: MenuItem[];
}

type AppAction =
  | { type: 'SET_USER'; payload: User | null }
  | { type: 'ADD_TO_CART'; payload: CartItem }
  | { type: 'UPDATE_CART_ITEM'; payload: { id: string; quantity: number } }
  | { type: 'REMOVE_FROM_CART'; payload: string }
  | { type: 'CLEAR_CART' }
  | { type: 'ADD_ORDER'; payload: Order }
  | { type: 'UPDATE_ORDER_STATUS'; payload: { id: string; status: Order['status'] } }
  | { type: 'SET_VIEW'; payload: string }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_MENU_ITEMS'; payload: MenuItem[] };

const initialState: AppState = {
  user: null,
  cart: [],
  orders: [],
  currentView: 'home',
  isLoading: false,
  menuItems: [],
};

const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload };
    
    case 'ADD_TO_CART':
      const existingItemIndex = state.cart.findIndex(
        item => item.menuItem.id === action.payload.menuItem.id
      );
      
      if (existingItemIndex >= 0) {
        const updatedCart = [...state.cart];
        updatedCart[existingItemIndex].quantity += action.payload.quantity;
        return { ...state, cart: updatedCart };
      }
      
      return { ...state, cart: [...state.cart, action.payload] };
    
    case 'UPDATE_CART_ITEM':
      return {
        ...state,
        cart: state.cart.map(item =>
          item.menuItem.id === action.payload.id
            ? { ...item, quantity: action.payload.quantity }
            : item
        ).filter(item => item.quantity > 0),
      };
    
    case 'REMOVE_FROM_CART':
      return {
        ...state,
        cart: state.cart.filter(item => item.menuItem.id !== action.payload),
      };
    
    case 'CLEAR_CART':
      return { ...state, cart: [] };
    
    case 'ADD_ORDER':
      return { ...state, orders: [action.payload, ...state.orders] };
    
    case 'UPDATE_ORDER_STATUS':
      return {
        ...state,
        orders: state.orders.map(order =>
          order.id === action.payload.id
            ? { ...order, status: action.payload.status }
            : order
        ),
      };
    
    case 'SET_VIEW':
      return { ...state, currentView: action.payload };
    
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    
    case 'SET_MENU_ITEMS':
      return { ...state, menuItems: action.payload };
    
    default:
      return state;
  }
};

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
} | null>(null);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);
  const { user: authUser, loading: authLoading } = useSupabaseAuth();

  // Sync authenticated user with app state
  React.useEffect(() => {
    if (authUser) {
      dispatch({ type: 'SET_USER', payload: authUser });
    } else {
      dispatch({ type: 'SET_USER', payload: null });
    }
  }, [authUser]);

  // Load menu items on app start
  React.useEffect(() => {
    const loadMenuItems = async () => {
      dispatch({ type: 'SET_LOADING', payload: true });
      const items = await menuService.getAllMenuItems();
      dispatch({ type: 'SET_MENU_ITEMS', payload: items });
      dispatch({ type: 'SET_LOADING', payload: false });
    };

    loadMenuItems();
  }, []);

  // Load user orders when user changes
  React.useEffect(() => {
    const loadUserOrders = async () => {
      if (authUser) {
        const orders = await orderService.getUserOrders(authUser.id);
        // Update orders in state
        orders.forEach(order => {
          dispatch({ type: 'ADD_ORDER', payload: order });
        });
      }
    };

    if (authUser) {
      loadUserOrders();
    }
  }, [authUser]);

  return (
    <AppContext.Provider value={{ 
      state: { ...state, isLoading: state.isLoading || authLoading }, 
      dispatch 
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};