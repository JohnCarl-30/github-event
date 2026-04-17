import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';
import HomePage from './HomePage';

// Mock Header and Footer
vi.mock('./Header', () => ({
    default: () => <div data-testid="header">Header</div>
}));

vi.mock('./Footer', () => ({
    default: () => <div data-testid="footer">Footer</div>
}));

describe('HomePage Component', () => {
    const renderHomePage = () => {
        return render(
            <BrowserRouter>
                <HomePage />
            </BrowserRouter>
        );
    };

    it('should render the home page with welcome message', () => {
        renderHomePage();
        expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Welcome to the The Daily Harvest!');
    });

    it('should display call-to-action text', () => {
        renderHomePage();
        expect(screen.getByText('Check out our products page for some great deals.')).toBeInTheDocument();
    });

    it('should render Header component', () => {
        renderHomePage();
        expect(screen.getByTestId('header')).toBeInTheDocument();
    });

    it('should render Footer component', () => {
        renderHomePage();
        expect(screen.getByTestId('footer')).toBeInTheDocument();
    });

    it('should have main content container', () => {
        const { container } = renderHomePage();
        expect(container.querySelector('.main-content')).toBeInTheDocument();
    });

    it('should have app container', () => {
        const { container } = renderHomePage();
        expect(container.querySelector('.app')).toBeInTheDocument();
    });
});
