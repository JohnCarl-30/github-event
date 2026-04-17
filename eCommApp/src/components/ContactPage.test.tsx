import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';
import ContactPage from './ContactPage';

describe('ContactPage Component', () => {
    const renderContactPage = () => {
        render(
            <BrowserRouter>
                <ContactPage />
            </BrowserRouter>
        );
    };

    it('should render contact heading', () => {
        renderContactPage();
        expect(screen.getByRole('heading', { name: 'Contact Us' })).toBeInTheDocument();
    });

    it('should render contact details', () => {
        renderContactPage();
        expect(screen.getByText('Email: support@thedailyharvest.com')).toBeInTheDocument();
        expect(screen.getByText('Phone: (555) 123-4567')).toBeInTheDocument();
    });
});
