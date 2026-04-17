import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import LoginPage from './LoginPage';

// Mock Header and Footer
vi.mock('./Header', () => ({
    default: () => <div data-testid="header">Header</div>
}));

vi.mock('./Footer', () => ({
    default: () => <div data-testid="footer">Footer</div>
}));

// Mock navigation
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: () => mockNavigate
    };
});

describe('LoginPage Component', () => {
    const renderLoginPage = () => {
        return render(
            <BrowserRouter>
                <LoginPage />
            </BrowserRouter>
        );
    };

    beforeEach(() => {
        mockNavigate.mockClear();
    });

    it('should render login form with heading', () => {
        renderLoginPage();
        expect(screen.getByRole('heading', { level: 2, name: 'Admin Login' })).toBeInTheDocument();
    });

    it('should render username input field', () => {
        renderLoginPage();
        expect(screen.getByPlaceholderText('Username')).toBeInTheDocument();
    });

    it('should render password input field', () => {
        renderLoginPage();
        expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    });

    it('should render login submit button', () => {
        renderLoginPage();
        expect(screen.getByRole('button', { name: 'Login' })).toBeInTheDocument();
    });

    it('should render Header component', () => {
        renderLoginPage();
        expect(screen.getByTestId('header')).toBeInTheDocument();
    });

    it('should render Footer component', () => {
        renderLoginPage();
        expect(screen.getByTestId('footer')).toBeInTheDocument();
    });

    it('should successfully login with correct credentials', async () => {
        const user = userEvent.setup();
        renderLoginPage();

        const usernameInput = screen.getByPlaceholderText('Username');
        const passwordInput = screen.getByPlaceholderText('Password');
        const submitButton = screen.getByRole('button', { name: 'Login' });

        await user.type(usernameInput, 'admin');
        await user.type(passwordInput, 'admin');
        await user.click(submitButton);

        expect(mockNavigate).toHaveBeenCalledWith('/admin');
    });

    it('should display error with incorrect username', async () => {
        const user = userEvent.setup();
        renderLoginPage();

        const usernameInput = screen.getByPlaceholderText('Username');
        const passwordInput = screen.getByPlaceholderText('Password');
        const submitButton = screen.getByRole('button', { name: 'Login' });

        await user.type(usernameInput, 'wronguser');
        await user.type(passwordInput, 'admin');
        await user.click(submitButton);

        expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
        expect(mockNavigate).not.toHaveBeenCalled();
    });

    it('should display error with incorrect password', async () => {
        const user = userEvent.setup();
        renderLoginPage();

        const usernameInput = screen.getByPlaceholderText('Username');
        const passwordInput = screen.getByPlaceholderText('Password');
        const submitButton = screen.getByRole('button', { name: 'Login' });

        await user.type(usernameInput, 'admin');
        await user.type(passwordInput, 'wrongpass');
        await user.click(submitButton);

        expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
        expect(mockNavigate).not.toHaveBeenCalled();
    });

    it('should display error with empty credentials', async () => {
        const user = userEvent.setup();
        renderLoginPage();

        const submitButton = screen.getByRole('button', { name: 'Login' });
        await user.click(submitButton);

        expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
        expect(mockNavigate).not.toHaveBeenCalled();
    });

    it('should clear input fields after successful login', async () => {
        const user = userEvent.setup();
        renderLoginPage();

        const usernameInput = screen.getByPlaceholderText('Username') as HTMLInputElement;
        const passwordInput = screen.getByPlaceholderText('Password') as HTMLInputElement;
        const submitButton = screen.getByRole('button', { name: 'Login' });

        await user.type(usernameInput, 'admin');
        await user.type(passwordInput, 'admin');
        await user.click(submitButton);

        expect(usernameInput.value).toBe('');
        expect(passwordInput.value).toBe('');
    });

    it('should not clear inputs after failed login', async () => {
        const user = userEvent.setup();
        renderLoginPage();

        const usernameInput = screen.getByPlaceholderText('Username') as HTMLInputElement;
        const passwordInput = screen.getByPlaceholderText('Password') as HTMLInputElement;
        const submitButton = screen.getByRole('button', { name: 'Login' });

        await user.type(usernameInput, 'wronguser');
        await user.type(passwordInput, 'wrongpass');
        await user.click(submitButton);

        expect(usernameInput.value).toBe('wronguser');
        expect(passwordInput.value).toBe('wrongpass');
    });

    it('should display login container with proper styling', () => {
        const { container } = renderLoginPage();
        expect(container.querySelector('.login-container')).toBeInTheDocument();
    });

    it('should handle case-sensitive credentials', async () => {
        const user = userEvent.setup();
        renderLoginPage();

        const usernameInput = screen.getByPlaceholderText('Username');
        const passwordInput = screen.getByPlaceholderText('Password');
        const submitButton = screen.getByRole('button', { name: 'Login' });

        await user.type(usernameInput, 'Admin');
        await user.type(passwordInput, 'admin');
        await user.click(submitButton);

        expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
    });
});
