import { create } from 'zustand';
import { Temperature } from '../data/menuData';

export interface CartOption {
  id: string;
  name: string;
  price: number;
}

export interface CartItem {
  cartItemId: string;
  menuId: string;
  name: string;
  basePrice: number;
  temperature: Temperature;
  selectedOptions: CartOption[];
  quantity: number;
  unitPrice: number;
}

interface CartState {
  cart: CartItem[];
  totalAmount: number;
  totalCount: number;
  addToCart: (item: Omit<CartItem, 'cartItemId' | 'unitPrice'>) => void;
  updateQuantity: (cartItemId: string, change: number) => void;
  removeFromCart: (cartItemId: string) => void;
  clearCart: () => void;
}

const calculateTotals = (cart: CartItem[]) => {
  return cart.reduce(
    (acc, item) => {
      acc.totalAmount += item.unitPrice * item.quantity;
      acc.totalCount += item.quantity;
      return acc;
    },
    { totalAmount: 0, totalCount: 0 }
  );
};

// ✨ 요기가 포인트! create<CartState>()((set) => ...) 형태로 괄호가 하나 더 붙어.
export const useCartStore = create<CartState>()((set) => ({
  cart: [],
  totalAmount: 0,
  totalCount: 0,

  addToCart: (item) => set((state) => {
    // opt 매개변수에 CartOption 타입을 명시해서 any 에러 방지
    const optionsPrice = item.selectedOptions.reduce((sum, opt: CartOption) => sum + opt.price, 0);
    const unitPrice = item.basePrice + optionsPrice;

    const newItem: CartItem = {
      ...item,
      cartItemId: Date.now().toString(),
      unitPrice,
    };

    const newCart = [...state.cart, newItem];
    const totals = calculateTotals(newCart);

    return { cart: newCart, ...totals };
  }),

  updateQuantity: (cartItemId, change) => set((state) => {
    const newCart = state.cart.map((item) => {
      if (item.cartItemId === cartItemId) {
        const newQuantity = Math.max(1, item.quantity + change);
        return { ...item, quantity: newQuantity };
      }
      return item;
    });

    const totals = calculateTotals(newCart);
    return { cart: newCart, ...totals };
  }),

  removeFromCart: (cartItemId) => set((state) => {
    const newCart = state.cart.filter((item) => item.cartItemId !== cartItemId);
    const totals = calculateTotals(newCart);
    return { cart: newCart, ...totals };
  }),

  clearCart: () => set({
    cart: [],
    totalAmount: 0,
    totalCount: 0,
  }),
}));