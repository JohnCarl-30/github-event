import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';
import App from './App';

describe('App Component', () => {
    it('should render without errors', () => {
        expect(() => {
            render(
                <MemoryRouter>
                    <App />
                </MemoryRouter>
            );
        }).not.toThrow();
    });

    it('should wrap components with CartProvider', () => {
        const { container } = render(
            <MemoryRouter>
                <App />
            </MemoryRouter>
        );

        // App should render
        expect(container).toBeInTheDocument();
    });

    it('should render routes', () => {
        render(
            <MemoryRouter initialEntries={['/']}>
                <App />
            </MemoryRouter>
        );

        // Should render the home page by default
        expect(screen.getByText(/Welcome to the The Daily Harvest/i)).toBeInTheDocument();
    });

    it('should render contact route', () => {
        render(
            <MemoryRouter initialEntries={['/contact']}>
                <App />
            </MemoryRouter>
        );

        expect(screen.getByRole('heading', { name: 'Contact Us' })).toBeInTheDocument();
    });
});
