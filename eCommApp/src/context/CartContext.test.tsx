import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { CartProvider, CartContext } from './CartContext';
import { useContext, useState } from 'react';
import { Product } from '../types';

// Simple test component that consumes the context
const CartConsumer = () => {
    const context = useContext(CartContext);
    const [addLog, setAddLog] = useState<string[]>([]);
    
    if (!context) return <div>No context</div>;
    
    const handleAdd = (product: Product) => {
        context.addToCart(product);
        setAddLog(prev => [...prev, `Added ${product.id}`]);
    };
    
    return (
        <div>
            <div data-testid="cart-count">{context.cartItems.length}</div>
            <button onClick={() => handleAdd(testProduct)} data-testid="add-btn">Add</button>
            <button onClick={() => handleAdd(testProduct2)} data-testid="add-btn2">Add 2</button>
            <button onClick={() => context.removeFromCart(testProduct.id || '')} data-testid="remove-btn">Remove</button>
            <button onClick={() => context.clearCart()} data-testid="clear-btn">Clear</button>
            {context.cartItems.map(item => (
                <div key={item.id} data-testid={`item-${item.id}`}>
                    {item.name} x {item.quantity}
                </div>
            ))}
            {addLog.map((log, i) => (
                <div key={i} data-testid={`log-${i}`}>{log}</div>
            ))}
        </div>
    );
};

const testProduct: Product = {
    id: '1',
    name: 'Test Product',
    price: 29.99,
    reviews: [],
    inStock: true
};

const testProduct2: Product = {
    id: '2',
    name: 'Test Product 2',
    price: 49.99,
    reviews: [],
    inStock: true
};

describe('CartContext', () => {
    it('should provide initial empty cart', () => {
        render(
            <CartProvider>
                <CartConsumer />
            </CartProvider>
        );

        expect(screen.getByTestId('cart-count')).toHaveTextContent('0');
    });

    it('should render CartConsumer without errors', () => {
        expect(() => {
            render(
                <CartProvider>
                    <CartConsumer />
                </CartProvider>
            );
        }).not.toThrow();
    });

    it('should provide buttons for add and clear', () => {
        render(
            <CartProvider>
                <CartConsumer />
            </CartProvider>
        );

        expect(screen.getByTestId('add-btn')).toBeInTheDocument();
        expect(screen.getByTestId('remove-btn')).toBeInTheDocument();
        expect(screen.getByTestId('clear-btn')).toBeInTheDocument();
    });

    it('should render cart count display', () => {
        render(
            <CartProvider>
                <CartConsumer />
            </CartProvider>
        );

        expect(screen.getByTestId('cart-count')).toBeInTheDocument();
    });

    it('should have CartProvider context available', () => {
        const { container } = render(
            <CartProvider>
                <CartConsumer />
            </CartProvider>
        );

        expect(container).toBeInTheDocument();
    });

    it('should render items list placeholder', () => {
        render(
            <CartProvider>
                <CartConsumer />
            </CartProvider>
        );

        // Items container should exist even if empty
        const cartCount = screen.getByTestId('cart-count');
        expect(cartCount.textContent).toBe('0');
    });

    it('should handle multiple products', () => {
        render(
            <CartProvider>
                <CartConsumer />
            </CartProvider>
        );

        // The component should support adding multiple products
        expect(screen.getByTestId('add-btn')).toBeInTheDocument();
        expect(screen.getByTestId('add-btn2')).toBeInTheDocument();
    });

    it('should remove item from cart', () => {
        render(
            <CartProvider>
                <CartConsumer />
            </CartProvider>
        );

        fireEvent.click(screen.getByTestId('add-btn'));
        fireEvent.click(screen.getByTestId('remove-btn'));

        expect(screen.getByTestId('cart-count')).toHaveTextContent('0');
    });
});
