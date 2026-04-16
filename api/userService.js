
import { API_CONFIG } from './config';
import { tokenStorage } from '../utils/secureStorage';

export const userService = {
    /**
     * Get User Profile
     * @returns {Promise<Object>} User profile data
     */
    async getProfile() {
        const token = await tokenStorage.getAccessToken();
        if (!token) throw new Error('No access token found');

        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), API_CONFIG.TIMEOUT);

        try {
            const response = await fetch(
                `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.GET_PROFILE}`,
                {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                    signal: controller.signal,
                }
            );

            clearTimeout(timeout);

            if (!response.ok) {
                if (response.status === 401) {
                    throw new Error('Unauthorized');
                }
                const data = await response.json();
                throw new Error(data.message || 'Failed to fetch profile');
            }

            return await response.json();
        } catch (error) {
            if (error.name === 'AbortError') {
                throw new Error('Request timed out');
            }
            throw error;
        }
    },

    /**
     * Update User Profile
     * @param {Object} userData - Fields to update
     * @returns {Promise<Object>} Response data
     */
    async updateProfile(userData) {
        const token = await tokenStorage.getAccessToken();
        if (!token) throw new Error('No access token found');

        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), API_CONFIG.TIMEOUT);

        try {
            const response = await fetch(
                `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.UPDATE_PROFILE}`,
                {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(userData),
                    signal: controller.signal,
                }
            );

            clearTimeout(timeout);

            if (!response.ok) {
                if (response.status === 401) {
                    throw new Error('Unauthorized');
                }
                const data = await response.json();
                throw new Error(data.message || 'Failed to update profile');
            }

            return await response.json(); // Assuming it returns success message or updated profile
        } catch (error) {
            if (error.name === 'AbortError') {
                throw new Error('Request timed out');
            }
            throw error;
        }
    }
};
