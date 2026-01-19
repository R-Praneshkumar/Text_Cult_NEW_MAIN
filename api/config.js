// API Configuration for Texcult Backend
export const API_CONFIG = {
    BASE_URL: 'https://texcult-backend-latest-1.onrender.com/texcultv1',

    ENDPOINTS: {
        SIGNUP: '/user/action/signup',
        LOGIN: '/user/action/login',
        REFRESH_TOKEN: '/user/action/refresh-token', // Append /{refreshToken}
    },

    // Request timeout in milliseconds
    TIMEOUT: 90000,
};

// Valid buyer types for signup
export const BUYER_TYPES = [
    { label: 'Retailer', value: 'RETAILER' },
    { label: 'Wholesaler', value: 'WHOLESALER' },
    { label: 'Manufacturer', value: 'MANUFACTURER' },
    { label: 'Distributor', value: 'DISTRIBUTOR' },
];
