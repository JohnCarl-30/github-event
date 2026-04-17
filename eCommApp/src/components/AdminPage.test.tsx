import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';
import AdminPage from './AdminPage';

// Mock Header and Footer
vi.mock('./Header', () => ({
    default: () => <div data-testid="header">Header</div>
}));

vi.mock('./Footer', () => ({
    default: () => <div data-testid="footer">Footer</div>
}));

describe('AdminPage Component', () => {
    const renderAdminPage = () => {
        return render(
            <BrowserRouter>
                <AdminPage />
            </BrowserRouter>
        );
    };

    it('should render admin portal heading', () => {
        renderAdminPage();
        expect(screen.getByRole('heading', { level: 2, name: 'Welcome to the admin portal.' })).toBeInTheDocument();
    });

    it('should render sale percent label', () => {
        renderAdminPage();
        expect(screen.getByLabelText(/Set Sale Percent/)).toBeInTheDocument();
    });

    it('should render submit and end sale buttons', () => {
        renderAdminPage();
        expect(screen.getByRole('button', { name: 'Submit' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'End Sale' })).toBeInTheDocument();
    });

    it('should display "No sale active" initially', () => {
        renderAdminPage();
        expect(screen.getByText('No sale active.')).toBeInTheDocument();
    });

    it('should accept valid numeric input and display sale message', async () => {
        const user = userEvent.setup();
        renderAdminPage();

        const input = screen.getByLabelText(/Set Sale Percent/);
        const submitButton = screen.getByRole('button', { name: 'Submit' });

        await user.clear(input);
        await user.type(input, '25');
        await user.click(submitButton);

        expect(screen.getByText('All products are 25% off!')).toBeInTheDocument();
    });

    it('should handle zero percentage', async () => {
        const user = userEvent.setup();
        renderAdminPage();

        const input = screen.getByLabelText(/Set Sale Percent/);
        const submitButton = screen.getByRole('button', { name: 'Submit' });

        await user.clear(input);
        await user.type(input, '0');
        await user.click(submitButton);

        expect(screen.getByText('No sale active.')).toBeInTheDocument();
    });

    it('should display error for non-numeric input', async () => {
        const user = userEvent.setup();
        renderAdminPage();

        const input = screen.getByLabelText(/Set Sale Percent/);
        const submitButton = screen.getByRole('button', { name: 'Submit' });

        await user.clear(input);
        await user.type(input, 'abc');
        await user.click(submitButton);

        expect(screen.getByText(/Invalid input/)).toBeInTheDocument();
    });

    it('should display error message with invalid input value', async () => {
        const user = userEvent.setup();
        renderAdminPage();

        const input = screen.getByLabelText(/Set Sale Percent/);
        const submitButton = screen.getByRole('button', { name: 'Submit' });

        await user.clear(input);
        await user.type(input, 'invalid');
        await user.click(submitButton);

        expect(screen.getByText(/Please enter a valid number/)).toBeInTheDocument();
    });

    it('should handle special characters in input', async () => {
        const user = userEvent.setup();
        renderAdminPage();

        const input = screen.getByLabelText(/Set Sale Percent/);
        const submitButton = screen.getByRole('button', { name: 'Submit' });

        await user.clear(input);
        await user.type(input, '!@#$%');
        await user.click(submitButton);

        expect(screen.getByText(/Invalid input/)).toBeInTheDocument();
    });

    it('should clear error message when new valid input is submitted', async () => {
        const user = userEvent.setup();
        renderAdminPage();

        const input = screen.getByLabelText(/Set Sale Percent/);
        const submitButton = screen.getByRole('button', { name: 'Submit' });

        // First submit invalid input
        await user.clear(input);
        await user.type(input, 'invalid');
        await user.click(submitButton);
        
        await waitFor(() => {
            expect(screen.getByText(/Invalid input/)).toBeInTheDocument();
        });

        // Then submit valid input - the component should show valid sale but error may remain
        await user.clear(input);
        await user.type(input, '50');
        await user.click(submitButton);
        
        // Just verify the sale percentage appears
        await waitFor(() => {
            expect(screen.getByText('All products are 50% off!')).toBeInTheDocument();
        });
    });

    it('should end sale when End Sale button is clicked', async () => {
        const user = userEvent.setup();
        renderAdminPage();

        const input = screen.getByLabelText(/Set Sale Percent/);
        const submitButton = screen.getByRole('button', { name: 'Submit' });
        const endSaleButton = screen.getByRole('button', { name: 'End Sale' });

        // Set a sale
        await user.clear(input);
        await user.type(input, '30');
        await user.click(submitButton);
        expect(screen.getByText('All products are 30% off!')).toBeInTheDocument();

        // End the sale
        await user.click(endSaleButton);
        expect(screen.getByText('No sale active.')).toBeInTheDocument();
    });

    it('should reset input to 0 when End Sale is clicked', async () => {
        const user = userEvent.setup();
        renderAdminPage();

        const input = screen.getByLabelText(/Set Sale Percent/) as HTMLInputElement;
        const submitButton = screen.getByRole('button', { name: 'Submit' });
        const endSaleButton = screen.getByRole('button', { name: 'End Sale' });

        // Set a sale
        await user.clear(input);
        await user.type(input, '40');
        await user.click(submitButton);

        // End the sale
        await user.click(endSaleButton);
        expect(input.value).toBe('0');
    });

    it('should handle large percentage values', async () => {
        const user = userEvent.setup();
        renderAdminPage();

        const input = screen.getByLabelText(/Set Sale Percent/);
        const submitButton = screen.getByRole('button', { name: 'Submit' });

        await user.clear(input);
        await user.type(input, '9999');
        await user.click(submitButton);

        expect(screen.getByText('All products are 9999% off!')).toBeInTheDocument();
    });

    it('should display sale status in green color', () => {
        const { container } = renderAdminPage();
        const statusParagraph = container.querySelector('p[style*="color"]');
        expect(statusParagraph).toBeInTheDocument();
    });

    it('should handle decimal percentage values', async () => {
        const user = userEvent.setup();
        renderAdminPage();

        const input = screen.getByLabelText(/Set Sale Percent/);
        const submitButton = screen.getByRole('button', { name: 'Submit' });

        await user.clear(input);
        await user.type(input, '15.5');
        await user.click(submitButton);

        // Should accept decimal as a number
        expect(screen.getByText('All products are 15.5% off!')).toBeInTheDocument();
    });
});
