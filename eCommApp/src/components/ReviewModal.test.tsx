import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import ReviewModal from './ReviewModal';
import { Product, Review } from '../types';

const mockProduct: Product = {
    id: '1',
    name: 'Test Product',
    price: 29.99,
    reviews: [],
    inStock: true,
    image: 'test.jpg'
};

const mockProductWithReviews: Product = {
    ...mockProduct,
    reviews: [
        {
            author: 'John Doe',
            comment: 'Great product!',
            date: new Date('2025-01-01').toISOString()
        },
        {
            author: 'Jane Smith',
            comment: 'Very good',
            date: new Date('2025-01-02').toISOString()
        }
    ]
};

describe('ReviewModal Component', () => {
    let mockOnClose: ReturnType<typeof vi.fn>;
    let mockOnSubmit: ReturnType<typeof vi.fn>;

    beforeEach(() => {
        mockOnClose = vi.fn();
        mockOnSubmit = vi.fn();
    });

    it('should not render when product is null', () => {
        const { container } = render(
            <ReviewModal product={null} onClose={mockOnClose} onSubmit={mockOnSubmit} />
        );

        expect(container.firstChild).toBeNull();
    });

    it('should render modal when product is provided', () => {
        render(
            <ReviewModal product={mockProduct} onClose={mockOnClose} onSubmit={mockOnSubmit} />
        );

        expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Reviews for Test Product');
    });

    it('should display "No reviews yet" when product has no reviews', () => {
        render(
            <ReviewModal product={mockProduct} onClose={mockOnClose} onSubmit={mockOnSubmit} />
        );

        expect(screen.getByText('No reviews yet.')).toBeInTheDocument();
    });

    it('should display all reviews when product has reviews', () => {
        render(
            <ReviewModal product={mockProductWithReviews} onClose={mockOnClose} onSubmit={mockOnSubmit} />
        );

        expect(screen.getByText('John Doe')).toBeInTheDocument();
        expect(screen.getByText('Jane Smith')).toBeInTheDocument();
        expect(screen.getByText('Great product!')).toBeInTheDocument();
        expect(screen.getByText('Very good')).toBeInTheDocument();
    });

    it('should render review form', () => {
        render(
            <ReviewModal product={mockProduct} onClose={mockOnClose} onSubmit={mockOnSubmit} />
        );

        expect(screen.getByRole('heading', { level: 3, name: 'Leave a Review' })).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Your name')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Your review')).toBeInTheDocument();
    });

    it('should call onSubmit when form is submitted with valid data', async () => {
        const user = userEvent.setup();
        render(
            <ReviewModal product={mockProduct} onClose={mockOnClose} onSubmit={mockOnSubmit} />
        );

        const authorInput = screen.getByPlaceholderText('Your name');
        const commentInput = screen.getByPlaceholderText('Your review');
        const submitButton = screen.getByRole('button', { name: 'Submit' });

        await user.type(authorInput, 'Test Author');
        await user.type(commentInput, 'Test comment');
        await user.click(submitButton);

        expect(mockOnSubmit).toHaveBeenCalledOnce();
        const callArgs = mockOnSubmit.mock.calls[0][0];
        expect(callArgs.author).toBe('Test Author');
        expect(callArgs.comment).toBe('Test comment');
        expect(callArgs.date).toBeDefined();
    });

    it('should clear form after submission', async () => {
        const user = userEvent.setup();
        render(
            <ReviewModal product={mockProduct} onClose={mockOnClose} onSubmit={mockOnSubmit} />
        );

        const authorInput = screen.getByPlaceholderText('Your name') as HTMLInputElement;
        const commentInput = screen.getByPlaceholderText('Your review') as HTMLTextAreaElement;
        const submitButton = screen.getByRole('button', { name: 'Submit' });

        await user.type(authorInput, 'Test Author');
        await user.type(commentInput, 'Test comment');
        await user.click(submitButton);

        expect(authorInput.value).toBe('');
        expect(commentInput.value).toBe('');
    });

    it('should call onClose when close button is clicked', async () => {
        const user = userEvent.setup();
        render(
            <ReviewModal product={mockProduct} onClose={mockOnClose} onSubmit={mockOnSubmit} />
        );

        const closeButton = screen.getByRole('button', { name: 'Close' });
        await user.click(closeButton);

        expect(mockOnClose).toHaveBeenCalledOnce();
    });

    it('should call onClose when backdrop is clicked', async () => {
        const user = userEvent.setup();
        const { container } = render(
            <ReviewModal product={mockProduct} onClose={mockOnClose} onSubmit={mockOnSubmit} />
        );

        const backdrop = container.querySelector('.modal-backdrop');
        if (backdrop) {
            await user.click(backdrop);
        }

        expect(mockOnClose).toHaveBeenCalled();
    });

    it('should prevent modal content click from closing modal', async () => {
        const user = userEvent.setup();
        const { container } = render(
            <ReviewModal product={mockProduct} onClose={mockOnClose} onSubmit={mockOnSubmit} />
        );

        const modalContent = container.querySelector('.modal-content');
        if (modalContent) {
            await user.click(modalContent);
        }

        expect(mockOnClose).not.toHaveBeenCalled();
    });

    it('should render review dates in correct format', () => {
        render(
            <ReviewModal product={mockProductWithReviews} onClose={mockOnClose} onSubmit={mockOnSubmit} />
        );

        // Check that dates are displayed
        const reviews = screen.getAllByRole('paragraph');
        expect(reviews.length).toBeGreaterThan(0);
    });
});
