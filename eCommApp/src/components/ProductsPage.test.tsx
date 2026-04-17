import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import ProductsPage from './ProductsPage';
import { CartProvider } from '../context/CartContext';
import { Product } from '../types';

// Mock Header and Footer
vi.mock('./Header', () => ({
    default: () => <div data-testid="header">Header</div>
}));

vi.mock('./Footer', () => ({
    default: () => <div data-testid="footer">Footer</div>
}));

vi.mock('./ReviewModal', () => ({
    default: ({ product, onClose, onSubmit }: any) => (
        product ? (
            <div data-testid="review-modal">
                <h2>Reviews for {product.name}</h2>
                <button onClick={onClose} data-testid="close-review">Close</button>
                <button onClick={() => onSubmit({ author: 'Test', comment: 'Great!', date: new Date().toISOString() })} data-testid="submit-review">Submit Review</button>
            </div>
        ) : null
    )
}));

const mockProducts: Product[] = [
    {
        id: '1',
        name: 'Apple',
        price: 29.99,
        description: 'Fresh apples',
        image: 'apple.jpg',
        inStock: true,
        reviews: []
    },
    {
        id: '2',
        name: 'Orange',
        price: 49.99,
        description: 'Juicy oranges',
        image: 'orange.jpg',
        inStock: false,
        reviews: []
    },
    {
        id: '3',
        name: 'Grapes',
        price: 19.99,
        image: 'grapes.jpg',
        inStock: true,
        reviews: []
    },
    {
        id: '4',
        name: 'Pear',
        price: 39.99,
        image: 'pear.jpg',
        inStock: true,
        reviews: []
    }
];

describe('ProductsPage Component', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    const setupSuccessfulFetch = () => {
        global.fetch = vi.fn((url: string) => {
            const fileMap: { [key: string]: Product } = {
                'apple.json': mockProducts[0],
                'orange.json': mockProducts[1],
                'grapes.json': mockProducts[2],
                'pear.json': mockProducts[3]
            };

            for (const [filename, product] of Object.entries(fileMap)) {
                if (url.includes(filename)) {
                    return Promise.resolve({
                        ok: true,
                        json: () => Promise.resolve(product)
                    } as any);
                }
            }
            return Promise.reject(new Error('Not found'));
        });
    };

    const renderProductsPage = (shouldFailFetch = false) => {
        if (shouldFailFetch) {
            global.fetch = vi.fn(() => Promise.reject(new Error('Network error'))) as any;
        } else if (!global.fetch) {
            global.fetch = vi.fn(() => new Promise(() => {})) as any; 
        }
        
        return render(
            <BrowserRouter>
                <CartProvider>
                    <ProductsPage />
                </CartProvider>
            </BrowserRouter>
        );
    };

    it('should display loading message initially', () => {
        renderProductsPage();
        expect(screen.getByText('Loading products...')).toBeInTheDocument();
    });

    it('should display products after successful load', async () => {
        setupSuccessfulFetch();
        renderProductsPage();

        await waitFor(() => {
            expect(screen.queryByText('Loading products...')).not.toBeInTheDocument();
        });

        expect(screen.getByRole('heading', { level: 2, name: 'Our Products' })).toBeInTheDocument();
    });

    it('should handle API errors gracefully', async () => {
        const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
        
        renderProductsPage(true);

        await waitFor(() => {
            expect(screen.queryByText('Loading products...')).not.toBeInTheDocument();
        });

        expect(consoleErrorSpy).toHaveBeenCalled();
        consoleErrorSpy.mockRestore();
    });

    it('should render Header component', async () => {
        renderProductsPage(true);

        await waitFor(() => {
            expect(screen.getByTestId('header')).toBeInTheDocument();
        });
    });

    it('should render Footer component', async () => {
        renderProductsPage(true);

        await waitFor(() => {
            expect(screen.getByTestId('footer')).toBeInTheDocument();
        });
    });

    it('should display product headings', async () => {
        setupSuccessfulFetch();
        renderProductsPage();

        await waitFor(() => {
            expect(screen.getByRole('heading', { level: 2, name: 'Our Products' })).toBeInTheDocument();
        });
    });

    it('should handle products with descriptions', async () => {
        setupSuccessfulFetch();
        renderProductsPage();

        await waitFor(() => {
            expect(screen.queryByText('Loading products...')).not.toBeInTheDocument();
        });

        expect(screen.getByText('Fresh apples')).toBeInTheDocument();
    });

    it('should handle products without descriptions', async () => {
        setupSuccessfulFetch();
        renderProductsPage();

        await waitFor(() => {
            expect(screen.queryByText('Loading products...')).not.toBeInTheDocument();
        });

        expect(screen.getByText('Grapes')).toBeInTheDocument();
    });

    it('should display in-stock products with Add to Cart button', async () => {
        setupSuccessfulFetch();
        renderProductsPage();

        await waitFor(() => {
            expect(screen.queryByText('Loading products...')).not.toBeInTheDocument();
        });

        const addToCartButtons = screen.getAllByRole('button', { name: 'Add to Cart' });
        expect(addToCartButtons.length).toBeGreaterThan(0);
    });

    it('should display out-of-stock products with disabled button', async () => {
        setupSuccessfulFetch();
        renderProductsPage();

        await waitFor(() => {
            expect(screen.queryByText('Loading products...')).not.toBeInTheDocument();
        });

        const outOfStockButton = screen.getByRole('button', { name: 'Out of Stock' });
        expect(outOfStockButton).toBeDisabled();
    });
});
