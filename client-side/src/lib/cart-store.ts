'use client';

import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import type { CartItem } from '@/lib/cart';
import { toCartItem } from '@/lib/cart';
import { coupons, isCouponActive } from '@/lib/coupons';
import type { Coupon } from '@/lib/coupons';
import type { Product } from '@/lib/malamal-content';

type CheckoutForm = {
  name: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  note: string;
  payment: string;
};

export type OrderStatus = 'Placed' | 'Processing' | 'Delivered' | 'Cancelled';

export type OrderRecord = {
  id: string;
  createdAt: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  delivery: number;
  total: number;
  customer: CheckoutForm;
  payment: string;
  couponCode: string;
  status: OrderStatus;
};

type CartState = {
  items: CartItem[];
  hydrated: boolean;
  couponCode: string;
  appliedCoupon: Coupon | null;
  checkout: CheckoutForm;
  orders: OrderRecord[];
  addProduct: (product: Product) => void;
  increase: (sku: string) => void;
  decrease: (sku: string) => void;
  remove: (sku: string) => void;
  clear: () => void;
  setCouponCode: (code: string) => void;
  applyCoupon: () => boolean;
  clearCoupon: () => void;
  updateCheckout: <K extends keyof CheckoutForm>(key: K, value: CheckoutForm[K]) => void;
  addItems: (items: CartItem[]) => void;
  addOrder: (order: OrderRecord) => void;
  updateOrderStatus: (id: string, status: OrderStatus) => void;
  setHydrated: (hydrated: boolean) => void;
};

const defaultCheckout: CheckoutForm = {
  name: '',
  phone: '',
  email: '',
  address: '',
  city: '',
  note: '',
  payment: 'Cash on delivery',
};

export const useCartStore = create<CartState>()(
  persist(
    set => ({
      items: [],
      hydrated: false,
      couponCode: '',
      appliedCoupon: null,
      checkout: defaultCheckout,
      orders: [],
      addProduct: product => {
        const nextItem = toCartItem(product);

        set(state => {
          const existing = state.items.find(item => item.sku === nextItem.sku);
          if (existing) {
            return {
              items: state.items.map(item =>
                item.sku === nextItem.sku ? { ...item, quantity: item.quantity + 1 } : item,
              ),
            };
          }

          return { items: [...state.items, nextItem] };
        });
      },
      increase: sku =>
        set(state => ({
          items: state.items.map(item =>
            item.sku === sku ? { ...item, quantity: item.quantity + 1 } : item,
          ),
        })),
      decrease: sku =>
        set(state => ({
          items: state.items
            .map(item =>
              item.sku === sku ? { ...item, quantity: item.quantity - 1 } : item,
            )
            .filter(item => item.quantity > 0),
        })),
      remove: sku => set(state => ({ items: state.items.filter(item => item.sku !== sku) })),
      clear: () => set({ items: [] }),
      setCouponCode: code => set({ couponCode: code.toUpperCase() }),
      applyCoupon: () => {
        let result = false;

        set(state => {
          const coupon = coupons[state.couponCode.trim().toUpperCase()];
          const subtotal = state.items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);

          if (!coupon || !isCouponActive(coupon, subtotal)) {
            return { appliedCoupon: null };
          }

          result = true;
          return { appliedCoupon: coupon };
        });

        return result;
      },
      clearCoupon: () => set({ couponCode: '', appliedCoupon: null }),
      updateCheckout: (key, value) =>
        set(state => ({
          checkout: {
            ...state.checkout,
            [key]: value,
          },
        })),
      addItems: items =>
        set(state => ({
          items: [...state.items, ...items],
        })),
      addOrder: order =>
        set(state => ({
          orders: [order, ...state.orders],
        })),
      updateOrderStatus: (id, status) =>
        set(state => ({
          orders: state.orders.map(order => (order.id === id ? { ...order, status } : order)),
        })),
      setHydrated: hydrated => set({ hydrated }),
    }),
    {
      name: 'malamal-cart-v1',
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => state => {
        state?.setHydrated(true);
      },
      partialize: state => ({
        items: state.items,
        couponCode: state.couponCode,
        appliedCoupon: state.appliedCoupon,
        checkout: state.checkout,
        orders: state.orders,
      }),
    },
  ),
);
