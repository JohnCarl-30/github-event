import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
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
        expect(screen.getByText('Address: 123 Harvest Lane, Freshville, CA 90210')).toBeInTheDocument();
    });

    it('should show confirmation message after sending contact form', async () => {
        const user = userEvent.setup();
        renderContactPage();

        await user.type(screen.getByPlaceholderText('Your Name'), 'Taylor');
        await user.type(screen.getByPlaceholderText('Your Email'), 'taylor@example.com');
        await user.type(screen.getByPlaceholderText('Your Message'), 'Hello team');
        await user.click(screen.getByRole('button', { name: 'Send Message' }));

        expect(screen.getByText('Thanks for reaching out! We will get back to you soon.')).toBeInTheDocument();
    });
});
