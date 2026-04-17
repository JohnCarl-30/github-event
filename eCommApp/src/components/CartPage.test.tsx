import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import CartPage from './CartPage';
import { CartContext, CartItem } from '../context/CartContext';

// Mock components
vi.mock('./Header', () => ({
    default: () => <div data-testid="header">Header</div>
}));

vi.mock('./Footer', () => ({
    default: () => <div data-testid="footer">Footer</div>
}));

vi.mock('./CheckoutModal', () => ({
    default: ({ onConfirm, onCancel }: { onConfirm: () => void; onCancel: () => void }) => (
        <div data-testid="checkout-modal">
            <button onClick={onConfirm} data-testid="confirm-checkout">Confirm</button>
            <button onClick={onCancel} data-testid="cancel-checkout">Cancel</button>
        </div>
    )
}));

const mockCartItems: CartItem[] = [
    {
        id: '1',
        name: 'Test Product 1',
        price: 29.99,
        quantity: 2,
        image: 'test1.jpg',
        reviews: [],
        inStock: true
    },
    {
        id: '2',
        name: 'Test Product 2',
        price: 49.99,
        quantity: 1,
        image: 'test2.jpg',
        reviews: [],
        inStock: true
    }
];

const mockCartContext = {
    cartItems: mockCartItems,
    addToCart: vi.fn(),
    clearCart: vi.fn()
};

const renderWithCartContext = (cartContext = mockCartContext) => {
    return render(
        <CartContext.Provider value={cartContext}>
            <CartPage />
        </CartContext.Provider>
    );
};

describe('CartPage', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('displays cart items when cart has items', () => {
        renderWithCartContext();
        
        expect(screen.getByText('Your Cart')).toBeInTheDocument();
        expect(screen.getByText('Test Product 1')).toBeInTheDocument();
        expect(screen.getByText('Test Product 2')).toBeInTheDocument();
        expect(screen.getByText('Price: $29.99')).toBeInTheDocument();
        expect(screen.getByText('Price: $49.99')).toBeInTheDocument();
        expect(screen.getByText('Quantity: 2')).toBeInTheDocument();
        expect(screen.getByText('Quantity: 1')).toBeInTheDocument();
    });

    it('displays empty cart message when cart is empty', () => {
        const emptyCartContext = {
            cartItems: [],
            addToCart: vi.fn(),
            clearCart: vi.fn()
        };
        renderWithCartContext(emptyCartContext);

        expect(screen.getByText('Your cart is empty.')).toBeInTheDocument();
        expect(screen.queryByText('Test Product 1')).not.toBeInTheDocument();
    });

    it('displays checkout button when cart has items', () => {
        renderWithCartContext();
        expect(screen.getByRole('button', { name: 'Checkout' })).toBeInTheDocument();
    });

    it('does not display checkout button when cart is empty', () => {
        const emptyCartContext = {
            cartItems: [],
            addToCart: vi.fn(),
            clearCart: vi.fn()
        };
        renderWithCartContext(emptyCartContext);

        expect(screen.queryByRole('button', { name: 'Checkout' })).not.toBeInTheDocument();
    });

    it('displays checkout modal when checkout button is clicked', async () => {
        const user = userEvent.setup();
        renderWithCartContext();

        const checkoutButton = screen.getByRole('button', { name: 'Checkout' });
        await user.click(checkoutButton);

        expect(screen.getByTestId('checkout-modal')).toBeInTheDocument();
    });

    it('closes checkout modal when cancel button is clicked', async () => {
        const user = userEvent.setup();
        renderWithCartContext();

        const checkoutButton = screen.getByRole('button', { name: 'Checkout' });
        await user.click(checkoutButton);

        expect(screen.getByTestId('checkout-modal')).toBeInTheDocument();

        const cancelButton = screen.getByTestId('cancel-checkout');
        await user.click(cancelButton);

        expect(screen.queryByTestId('checkout-modal')).not.toBeInTheDocument();
    });

    it('processes order when confirm checkout button is clicked', async () => {
        const user = userEvent.setup();
        const mockClearCart = vi.fn();
        const contextWithMocks = {
            cartItems: mockCartItems,
            addToCart: vi.fn(),
            clearCart: mockClearCart
        };

        renderWithCartContext(contextWithMocks);

        const checkoutButton = screen.getByRole('button', { name: 'Checkout' });
        await user.click(checkoutButton);

        const confirmButton = screen.getByTestId('confirm-checkout');
        await user.click(confirmButton);

        expect(mockClearCart).toHaveBeenCalled();
        expect(screen.getByText('Your order has been processed!')).toBeInTheDocument();
    });

    it('displays processed items after order confirmation', async () => {
        const user = userEvent.setup();
        const mockClearCart = vi.fn();
        const contextWithMocks = {
            cartItems: mockCartItems,
            addToCart: vi.fn(),
            clearCart: mockClearCart
        };

        renderWithCartContext(contextWithMocks);

        const checkoutButton = screen.getByRole('button', { name: 'Checkout' });
        await user.click(checkoutButton);

        const confirmButton = screen.getByTestId('confirm-checkout');
        await user.click(confirmButton);

        expect(screen.getByText('Test Product 1')).toBeInTheDocument();
        expect(screen.getByText('Test Product 2')).toBeInTheDocument();
    });

    it('displays header and footer', () => {
        renderWithCartContext();
        expect(screen.getByTestId('header')).toBeInTheDocument();
        expect(screen.getByTestId('footer')).toBeInTheDocument();
    });

    it('renders cart item card with product image path', () => {
        const { container } = renderWithCartContext();
        const images = container.querySelectorAll('img.cart-item-image');
        expect(images.length).toBeGreaterThan(0);
        expect(images[0]).toHaveAttribute('src', 'products/productImages/test1.jpg');
    });

    it('throws error when CartContext is not provided', () => {
        const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

        expect(() => {
            render(<CartPage />);
        }).toThrow('CartContext must be used within a CartProvider');

        consoleErrorSpy.mockRestore();
    });

    it('handles single item in cart', () => {
        const singleItemContext = {
            cartItems: [mockCartItems[0]],
            addToCart: vi.fn(),
            clearCart: vi.fn()
        };

        renderWithCartContext(singleItemContext);

        expect(screen.getByText('Test Product 1')).toBeInTheDocument();
        expect(screen.queryByText('Test Product 2')).not.toBeInTheDocument();
    });

    it('displays correct formatted prices', () => {
        renderWithCartContext();
        expect(screen.getByText('Price: $29.99')).toBeInTheDocument();
        expect(screen.getByText('Price: $49.99')).toBeInTheDocument();
    });

    it('displays quantities correctly', () => {
        renderWithCartContext();
        expect(screen.getByText('Quantity: 2')).toBeInTheDocument();
        expect(screen.getByText('Quantity: 1')).toBeInTheDocument();
    });

    it('displays multiple products with different quantities', () => {
        const multipleItems: CartItem[] = [
            { ...mockCartItems[0], quantity: 5 },
            { ...mockCartItems[1], quantity: 3 }
        ];
        const contextWithMultiple = {
            cartItems: multipleItems,
            addToCart: vi.fn(),
            clearCart: vi.fn()
        };

        renderWithCartContext(contextWithMultiple);

        expect(screen.getByText('Quantity: 5')).toBeInTheDocument();
        expect(screen.getByText('Quantity: 3')).toBeInTheDocument();
    });

    it('order processed page shows all processed items', async () => {
        const user = userEvent.setup();
        const mockClearCart = vi.fn();
        const contextWithMocks = {
            cartItems: mockCartItems,
            addToCart: vi.fn(),
            clearCart: mockClearCart
        };

        renderWithCartContext(contextWithMocks);

        const checkoutButton = screen.getByRole('button', { name: 'Checkout' });
        await user.click(checkoutButton);

        const confirmButton = screen.getByTestId('confirm-checkout');
        await user.click(confirmButton);

        // Verify order processed page contains all product info
        expect(screen.getByText('Price: $29.99')).toBeInTheDocument();
        expect(screen.getByText('Price: $49.99')).toBeInTheDocument();
    });
});
