// API Configuration for Texcult Backend
export const API_CONFIG = {
    BASE_URL: 'https://texcult-backend-latest-1.onrender.com/texcultv1',

    ENDPOINTS: {
        SIGNUP: '/user/action/signup',
        LOGIN: '/user/action/login',
        REFRESH_TOKEN: '/user/action/refresh-token', // Append /{refreshToken}
        SIGNUP_OTP: '/user/action/signup-otp',
        LOGIN_OTP: '/user/action/login-otp',
        VERIFY_OTP: '/user/action/verify-otp',
        GET_PROFILE: '/user/action/profile',
        UPDATE_PROFILE: '/user/action/update',
    },

    // Request timeout in milliseconds
    TIMEOUT: 90000,
};

// Valid buyer types for signup
export const BUYER_TYPES = [
    { label: 'Weaver', value: 'WEAVER' },
];
