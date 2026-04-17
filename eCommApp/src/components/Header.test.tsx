import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';
import Header from './Header';

describe('Header Component', () => {
    const renderHeader = () => {
        render(
            <BrowserRouter>
                <Header />
            </BrowserRouter>
        );
    };

    it('should render the header with title', () => {
        renderHeader();
        expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('The Daily Harvest');
    });

    it('should render navigation links', () => {
        renderHeader();
        expect(screen.getByRole('link', { name: 'Home' })).toBeInTheDocument();
        expect(screen.getByRole('link', { name: 'Products' })).toBeInTheDocument();
        expect(screen.getByRole('link', { name: 'Cart' })).toBeInTheDocument();
    });

    it('should render admin login button', () => {
        renderHeader();
        const loginLink = screen.getByRole('link', { name: /Admin Login/i });
        expect(loginLink).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Admin Login' })).toBeInTheDocument();
    });

    it('should have correct navigation hrefs', () => {
        renderHeader();
        expect(screen.getByRole('link', { name: 'Home' })).toHaveAttribute('href', '/');
        expect(screen.getByRole('link', { name: 'Products' })).toHaveAttribute('href', '/products');
        expect(screen.getByRole('link', { name: 'Cart' })).toHaveAttribute('href', '/cart');
    });

    it('should render header as a header element', () => {
        renderHeader();
        const header = screen.getByRole('heading', { level: 1 }).closest('header');
        expect(header).toHaveClass('app-header');
    });
});
