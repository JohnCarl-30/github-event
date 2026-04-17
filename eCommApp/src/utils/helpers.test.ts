import { describe, it, expect } from 'vitest';
import { formatPrice, calculateTotal, validateEmail } from './helpers';

describe('helpers.ts', () => {
    describe('formatPrice', () => {
        it('should format a standard price correctly', () => {
            const result = formatPrice(29.99);
            expect(result).toBe('$29.99');
        });

        it('should format a whole number price with two decimals', () => {
            const result = formatPrice(50);
            expect(result).toBe('$50.00');
        });

        it('should format a very small price', () => {
            const result = formatPrice(0.99);
            expect(result).toBe('$0.99');
        });

        it('should format zero price', () => {
            const result = formatPrice(0);
            expect(result).toBe('$0.00');
        });

        it('should format a large price', () => {
            const result = formatPrice(9999.99);
            expect(result).toBe('$9,999.99');
        });

        it('should handle decimal rounding', () => {
            const result = formatPrice(29.995);
            expect(result).toContain('$');
        });

        it('should handle negative prices', () => {
            const result = formatPrice(-10.50);
            expect(result).toContain('-');
        });
    });

    describe('calculateTotal', () => {
        it('should calculate total for single item', () => {
            const items = [{ price: 10, quantity: 1 }];
            expect(calculateTotal(items)).toBe(10);
        });

        it('should calculate total for multiple items', () => {
            const items = [
                { price: 29.99, quantity: 2 },
                { price: 49.99, quantity: 1 }
            ];
            expect(calculateTotal(items)).toBe(109.97);
        });

        it('should return 0 for empty items array', () => {
            const items: Array<{ price: number; quantity: number }> = [];
            expect(calculateTotal(items)).toBe(0);
        });

        it('should calculate correctly with quantity of zero', () => {
            const items = [{ price: 29.99, quantity: 0 }];
            expect(calculateTotal(items)).toBe(0);
        });

        it('should calculate correctly with large quantities', () => {
            const items = [{ price: 10, quantity: 100 }];
            expect(calculateTotal(items)).toBe(1000);
        });

        it('should calculate correctly with decimal prices', () => {
            const items = [
                { price: 10.50, quantity: 2 },
                { price: 15.75, quantity: 3 }
            ];
            expect(calculateTotal(items)).toBeCloseTo(68.25, 2);
        });

        it('should handle multiple items with same price', () => {
            const items = [
                { price: 20, quantity: 2 },
                { price: 20, quantity: 3 }
            ];
            expect(calculateTotal(items)).toBe(100);
        });
    });

    describe('validateEmail', () => {
        it('should validate a valid email', () => {
            expect(validateEmail('test@example.com')).toBe(true);
        });

        it('should validate another valid email format', () => {
            expect(validateEmail('user.name@domain.co.uk')).toBe(true);
        });

        it('should reject email without @ symbol', () => {
            expect(validateEmail('testexample.com')).toBe(false);
        });

        it('should reject email without domain extension', () => {
            expect(validateEmail('test@example')).toBe(false);
        });

        it('should reject email with space', () => {
            expect(validateEmail('test @example.com')).toBe(false);
        });

        it('should reject email with multiple @ symbols', () => {
            expect(validateEmail('test@@example.com')).toBe(false);
        });

        it('should reject empty string', () => {
            expect(validateEmail('')).toBe(false);
        });

        it('should validate email with numbers', () => {
            expect(validateEmail('test123@example456.com')).toBe(true);
        });

        it('should validate email with hyphens in domain', () => {
            expect(validateEmail('test@example-domain.com')).toBe(true);
        });

        it('should reject email starting with @', () => {
            expect(validateEmail('@example.com')).toBe(false);
        });

        it('should reject email ending with @', () => {
            expect(validateEmail('test@')).toBe(false);
        });
    });
});
