import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import CheckoutModal from './CheckoutModal';

describe('CheckoutModal Component', () => {
    it('should render checkout modal with confirmation message', () => {
        const mockConfirm = vi.fn();
        const mockCancel = vi.fn();

        render(
            <CheckoutModal onConfirm={mockConfirm} onCancel={mockCancel} />
        );

        expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Are you sure?');
        expect(screen.getByText('Do you want to proceed with the checkout?')).toBeInTheDocument();
    });

    it('should call onConfirm when Continue Checkout button is clicked', async () => {
        const mockConfirm = vi.fn();
        const mockCancel = vi.fn();
        const user = userEvent.setup();

        render(
            <CheckoutModal onConfirm={mockConfirm} onCancel={mockCancel} />
        );

        const confirmButton = screen.getByRole('button', { name: 'Continue Checkout' });
        await user.click(confirmButton);

        expect(mockConfirm).toHaveBeenCalledOnce();
        expect(mockCancel).not.toHaveBeenCalled();
    });

    it('should call onCancel when Return to cart button is clicked', async () => {
        const mockConfirm = vi.fn();
        const mockCancel = vi.fn();
        const user = userEvent.setup();

        render(
            <CheckoutModal onConfirm={mockConfirm} onCancel={mockCancel} />
        );

        const cancelButton = screen.getByRole('button', { name: 'Return to cart' });
        await user.click(cancelButton);

        expect(mockCancel).toHaveBeenCalledOnce();
        expect(mockConfirm).not.toHaveBeenCalled();
    });

    it('should render modal backdrop', () => {
        const mockConfirm = vi.fn();
        const mockCancel = vi.fn();
        const { container } = render(
            <CheckoutModal onConfirm={mockConfirm} onCancel={mockCancel} />
        );

        expect(container.querySelector('.modal-backdrop')).toBeInTheDocument();
    });

    it('should render modal content container', () => {
        const mockConfirm = vi.fn();
        const mockCancel = vi.fn();
        const { container } = render(
            <CheckoutModal onConfirm={mockConfirm} onCancel={mockCancel} />
        );

        expect(container.querySelector('.modal-content')).toBeInTheDocument();
    });

    it('should have cancel button with correct class', () => {
        const mockConfirm = vi.fn();
        const mockCancel = vi.fn();

        render(
            <CheckoutModal onConfirm={mockConfirm} onCancel={mockCancel} />
        );

        const cancelButton = screen.getByRole('button', { name: 'Return to cart' });
        expect(cancelButton).toHaveClass('cancel-btn');
    });

    it('should render both action buttons', () => {
        const mockConfirm = vi.fn();
        const mockCancel = vi.fn();
        const { container } = render(
            <CheckoutModal onConfirm={mockConfirm} onCancel={mockCancel} />
        );

        const actionButtons = container.querySelector('.checkout-modal-actions');
        expect(actionButtons).toBeInTheDocument();
        expect(actionButtons?.querySelectorAll('button')).toHaveLength(2);
    });
});
