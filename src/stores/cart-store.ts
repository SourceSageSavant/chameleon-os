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
                    // Check if product is in stock
                    const availableStock = product.inventory_quantity ?? Infinity;
                    if (availableStock <= 0) {
                        console.warn('Product out of stock:', product.title);
                        return state; // Don't add out of stock items
                    }

                    const existingItem = state.items.find(
                        (item) =>
                            item.product_id === product.id &&
                            item.variant_id === variantId
                    );

                    if (existingItem) {
                        // Check if new quantity exceeds stock
                        const newQuantity = existingItem.quantity + quantity;
                        const limitedQuantity = Math.min(newQuantity, availableStock);

                        return {
                            items: state.items.map((item) =>
                                item.product_id === product.id && item.variant_id === variantId
                                    ? { ...item, quantity: limitedQuantity }
                                    : item
                            ),
                        };
                    }

                    // Add new item with quantity limited to stock
                    const limitedQuantity = Math.min(quantity, availableStock);
                    return {
                        items: [
                            ...state.items,
                            {
                                product_id: product.id,
                                variant_id: variantId,
                                quantity: limitedQuantity,
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
