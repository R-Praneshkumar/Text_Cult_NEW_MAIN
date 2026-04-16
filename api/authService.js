import { API_CONFIG } from './config';

/**
 * Authentication Service
 * Handles login, signup, and token refresh with the Texcult backend
 */
export const authService = {
    /**
     * Login with email and password
     * @param {string} email - User's email address
     * @param {string} password - User's password
     * @returns {Promise<{accessToken: string, refreshToken: string}>}
     */
    async login(email, password) {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), API_CONFIG.TIMEOUT);

        try {
            const response = await fetch(
                `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.LOGIN}`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        username: email, // API expects 'username' not 'email'
                        password,
                    }),
                    signal: controller.signal,
                }
            );

            clearTimeout(timeout);

            const data = await response.json();

            if (!response.ok) {
                // Handle specific error codes
                if (response.status === 400) {
                    throw new Error(data.message || 'Invalid email or password');
                } else if (response.status === 500) {
                    // Backend returns 500 for non-existent users
                    throw new Error('Invalid email or password');
                }
                throw new Error(data.message || 'Login failed');
            }

            // Validate response has required tokens
            if (!data.accessToken || !data.refreshToken) {
                throw new Error('Invalid server response');
            }

            return {
                accessToken: data.accessToken,
                refreshToken: data.refreshToken,
            };
        } catch (error) {
            if (error.name === 'AbortError') {
                throw new Error('Request timed out. Please check your connection.');
            }
            throw error;
        }
    },

    /**
     * Register a new user
     * @param {Object} userData - User registration data
     * @param {string} userData.email - Email address
     * @param {string} userData.password - Password (min 6 chars)
     * @param {string} userData.firstname - First name
     * @param {string} userData.lastname - Last name (optional)
     * @param {string} userData.companyName - Company name
     * @param {string} userData.phoneno - Phone number with country code
     * @param {string} userData.buyerType - Type of buyer (RETAILER, WHOLESALER, etc.)
     * @returns {Promise<{accessToken: string, refreshToken: string}>}
     */
    async signup(userData) {
        // Validate required fields client-side first
        const requiredFields = ['email', 'password', 'firstname', 'companyName', 'phoneno', 'buyerType'];
        for (const field of requiredFields) {
            if (!userData[field]) {
                const fieldName = field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1');
                throw new Error(`${fieldName} is required`);
            }
        }

        // Password validation
        if (userData.password.length < 6) {
            throw new Error('Password must be at least 6 characters');
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(userData.email)) {
            throw new Error('Please enter a valid email address');
        }

        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), API_CONFIG.TIMEOUT);

        try {
            const response = await fetch(
                `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.SIGNUP}`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        username: userData.email, // API expects 'username' not 'email'
                        password: userData.password,
                        firstname: userData.firstname,
                        lastname: userData.lastname || '',
                        companyName: userData.companyName,
                        phoneno: userData.phoneno,
                        buyerType: userData.buyerType,
                        alternateEmail: userData.alternateEmail || '',
                        alternatePhone: userData.alternatePhone || '',
                    }),
                    signal: controller.signal,
                }
            );

            clearTimeout(timeout);

            const data = await response.json();

            if (!response.ok) {
                if (response.status === 400) {
                    // Check for duplicate user
                    if (data.message?.includes('already exists')) {
                        throw new Error('An account with this email already exists');
                    }
                    throw new Error(data.message || 'Invalid signup data');
                }
                throw new Error(data.message || 'Signup failed');
            }

            // Validate response has required tokens
            if (!data.accessToken || !data.refreshToken) {
                throw new Error('Invalid server response');
            }

            return {
                accessToken: data.accessToken,
                refreshToken: data.refreshToken,
            };
        } catch (error) {
            if (error.name === 'AbortError') {
                throw new Error('Request timed out. Please check your connection.');
            }
            throw error;
        }
    },



    /**
     * Send OTP for user signup
     * @param {Object} payload - User signup data (must include profile info)
     * @returns {Promise<any>} - Response data
     */
    async sendSignupOtp(payload) {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), API_CONFIG.TIMEOUT);

        try {
            const response = await fetch(
                `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.SIGNUP_OTP}`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload),
                    signal: controller.signal,
                }
            );

            clearTimeout(timeout);

            const data = await response.json();

            if (!response.ok) {
                if (response.status === 400) {
                    throw new Error(data.message || 'Invalid signup data');
                } else if (response.status === 409) {
                    throw new Error('User already exists with this phone number');
                }
                throw new Error(data.message || 'Failed to send OTP for signup');
            }

            return data;
        } catch (error) {
            if (error.name === 'AbortError') {
                throw new Error('Request timed out. Please check your connection.');
            }
            throw error;
        }
    },

    /**
     * Send OTP for user login
     * @param {Object} payload - { phoneno: string }
     * @returns {Promise<any>} - Response data
     */
    async sendLoginOtp(payload) {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), API_CONFIG.TIMEOUT);

        try {
            const response = await fetch(
                `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.LOGIN_OTP}`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload),
                    signal: controller.signal,
                }
            );

            clearTimeout(timeout);

            const data = await response.json();

            if (!response.ok) {
                if (response.status === 400) {
                    throw new Error(data.message || 'Invalid phone number format');
                } else if (response.status === 404) {
                    throw new Error('No user found with this phone number');
                }
                throw new Error(data.message || 'Failed to send OTP for login');
            }

            return data;
        } catch (error) {
            if (error.name === 'AbortError') {
                throw new Error('Request timed out. Please check your connection.');
            }
            throw error;
        }
    },

    /**
     * Verify OTP and complete authentication
     * @param {Object} payload - { phoneno, otp }
     * @returns {Promise<{accessToken: string, refreshToken: string}>}
     */
    async verifyOtp(payload) {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), API_CONFIG.TIMEOUT);

        try {
            const response = await fetch(
                `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.VERIFY_OTP}`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload),
                    signal: controller.signal,
                }
            );

            clearTimeout(timeout);

            const data = await response.json();

            if (!response.ok) {
                if (response.status === 400) {
                    throw new Error(data.message || 'Invalid OTP');
                }
                throw new Error(data.message || 'Verification failed');
            }

            // Validate response has required tokens
            if (!data.accessToken || !data.refreshToken) {
                // If verifyOtp doesn't return tokens directly (e.g. just verifies),
                // we might need another step. But usually it does.
                // For now, let's assume it does or throw if missing.
                // However, some flows might return a temporary token for the next step.
                // Given the context "strict Phone OTP-based authentication system", 
                // it implies verify-otp logs you in.

                // Let's allow for the case where it might just return success msg if not detailed in spec,
                // BUT the code below expects tokens.
                if (!data.accessToken) {
                    throw new Error('Invalid server response: Missing tokens');
                }
            }

            return {
                accessToken: data.accessToken,
                refreshToken: data.refreshToken,
                user: data.user // Assuming user info might be returned
            };
        } catch (error) {
            if (error.name === 'AbortError') {
                throw new Error('Request timed out. Please check your connection.');
            }
            throw error;
        }
    },

    /**
     * Refresh access token using refresh token
     * @param {string} refreshToken - The refresh token
     * @returns {Promise<{accessToken: string, refreshToken: string}>}
     */
    async refreshToken(refreshToken) {
        if (!refreshToken) {
            throw new Error('SESSION_EXPIRED');
        }

        try {
            const response = await fetch(
                `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.REFRESH_TOKEN}/${refreshToken}`,
                { method: 'POST' }
            );

            if (response.status === 401) {
                throw new Error('SESSION_EXPIRED');
            }

            if (!response.ok) {
                throw new Error('Token refresh failed');
            }

            const data = await response.json();

            return {
                accessToken: data.accessToken,
                refreshToken: data.refreshToken,
            };
        } catch (error) {
            if (error.message === 'SESSION_EXPIRED') {
                throw error;
            }
            throw new Error('Failed to refresh session');
        }
    },
};
