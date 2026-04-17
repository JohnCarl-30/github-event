import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Footer from './Footer';

describe('Footer Component', () => {
    it('should render footer with copyright text', () => {
        render(<Footer />);
        expect(screen.getByText(/2025 The Daily Harvest. All rights reserved./)).toBeInTheDocument();
    });

    it('should render as a footer element', () => {
        const { container } = render(<Footer />);
        const footer = container.querySelector('footer');
        expect(footer).toHaveClass('app-footer');
    });

    it('should display footer content in a paragraph', () => {
        const { container } = render(<Footer />);
        const paragraph = container.querySelector('footer p');
        expect(paragraph).toBeInTheDocument();
        expect(paragraph?.textContent).toContain('The Daily Harvest');
    });
});
