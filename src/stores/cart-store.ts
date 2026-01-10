import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CartItem, Product } from '@/types';

interface CartState {
    items: CartItem[];
    isOpen: boolean;

    // Actions
    addItem: (product: Product, quantity?: number, variantId?: string) => void;
    removeItem: (productId: string, variantId?: string) => void;
    updateQuantity: (productId: string, quantity: number, variantId?: string) => void;
    clearCart: () => void;
    toggleCart: () => void;
    openCart: () => void;
    closeCart: () => void;

    // Computed
    getSubtotal: () => number;
    getItemCount: () => number;
}

export const useCartStore = create<CartState>()(
    persist(
        (set, get) => ({
            items: [],
            isOpen: false,

            addItem: (product, quantity = 1, variantId) => {
                set((state) => {
                    const existingItem = state.items.find(
                        (item) =>
                            item.product_id === product.id &&
                            item.variant_id === variantId
                    );

                    if (existingItem) {
                        // Update quantity if item exists
                        return {
                            items: state.items.map((item) =>
                                item.product_id === product.id && item.variant_id === variantId
                                    ? { ...item, quantity: item.quantity + quantity }
                                    : item
                            ),
                        };
                    }

                    // Add new item
                    return {
                        items: [
                            ...state.items,
                            {
                                product_id: product.id,
                                variant_id: variantId,
                                quantity,
                                product,
                            },
                        ],
                    };
                });
            },

            removeItem: (productId, variantId) => {
                set((state) => ({
                    items: state.items.filter(
                        (item) =>
                            !(item.product_id === productId && item.variant_id === variantId)
                    ),
                }));
            },

            updateQuantity: (productId, quantity, variantId) => {
                if (quantity <= 0) {
                    get().removeItem(productId, variantId);
                    return;
                }

                set((state) => ({
                    items: state.items.map((item) =>
                        item.product_id === productId && item.variant_id === variantId
                            ? { ...item, quantity }
                            : item
                    ),
                }));
            },

            clearCart: () => set({ items: [] }),

            toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
            openCart: () => set({ isOpen: true }),
            closeCart: () => set({ isOpen: false }),

            getSubtotal: () => {
                const { items } = get();
                return items.reduce(
                    (total, item) => total + item.product.price * item.quantity,
                    0
                );
            },

            getItemCount: () => {
                const { items } = get();
                return items.reduce((count, item) => count + item.quantity, 0);
            },
        }),
        {
            name: 'chameleon-cart',
            // Only persist items, not UI state
            partialize: (state) => ({ items: state.items }),
        }
    )
);
