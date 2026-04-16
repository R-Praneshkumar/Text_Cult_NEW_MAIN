
import { API_CONFIG } from './config';
import { tokenStorage } from '../utils/secureStorage';

export const productService = {
    /**
     * Get All Product Categories
     * @returns {Promise<Array>} List of categories
     */
    async getAllCategories() {
        // Can be public or protected depending on API. We send token if available.
        const token = await tokenStorage.getAccessToken();
        const headers = { 'Content-Type': 'application/json' };
        if (token) headers['Authorization'] = `Bearer ${token}`;

        try {
            const response = await fetch(
                `${API_CONFIG.BASE_URL}/product/categories`,
                { method: 'GET', headers }
            );

            if (!response.ok) throw new Error('Failed to fetch categories');
            return await response.json();
        } catch (error) {
            console.error('Error fetching categories:', error);
            return []; // Return empty on fail to prevent crash
        }
    },

    /**
     * Get Products by Category ID
     * @param {number} catId 
     * @returns {Promise<Array>} List of products
     */
    async getProductsByCategory(catId) {
        const token = await tokenStorage.getAccessToken();
        const headers = { 'Content-Type': 'application/json' };
        if (token) headers['Authorization'] = `Bearer ${token}`;

        try {
            const response = await fetch(
                `${API_CONFIG.BASE_URL}/product/category/${catId}`,
                { method: 'GET', headers }
            );

            if (!response.ok) throw new Error('Failed to fetch products');
            return await response.json();
        } catch (error) {
            console.error('Error fetching products:', error);
            return [];
        }
    },

    /**
     * Get Product Attributes (Spinning, Count, etc.)
     * @param {number} prodId 
     * @returns {Promise<Object>} Attributes data
     */
    /**
     * Get Product Attributes (Spinning, Count, etc.)
     * @param {number} prodId 
     * @returns {Promise<Object>} Attributes data
     */
    async getProductAttributes(prodId) {
        const token = await tokenStorage.getAccessToken();
        const headers = { 'Content-Type': 'application/json' };

        // FIX: Don't send fake dev token, it causes 401 on public endpoints
        if (token && token !== 'dev-access-token') {
            headers['Authorization'] = `Bearer ${token}`;
        }

        try {
            const url = `${API_CONFIG.BASE_URL}/product/${prodId}/attributes`;
            console.log(`GET Attributes: ${url}`); // Debug Log

            const response = await fetch(url, { method: 'GET', headers });

            if (!response.ok) {
                const text = await response.text();
                throw new Error(`Failed to fetch attributes: ${response.status} - ${text}`);
            }
            return await response.json();
        } catch (error) {
            console.error('Error fetching attributes:', error);
            return null;
        }
    },

    /**
     * Calculate Price (Get Variant Price)
     * @param {Object} payload - { prodId, prodSku, attributes: [...] }
     * @returns {Promise<Object>} Price response or null
     */
    async calculatePrice(payload) {
        const token = await tokenStorage.getAccessToken();
        const headers = { 'Content-Type': 'application/json' };

        // FIX: Don't send fake dev token
        if (token && token !== 'dev-access-token') {
            headers['Authorization'] = `Bearer ${token}`;
        }

        try {
            const response = await fetch(
                `${API_CONFIG.BASE_URL}/product/price`,
                {
                    method: 'POST',
                    headers,
                    body: JSON.stringify(payload)
                }
            );

            if (response.status === 404) {
                return { error: 'Variant not found' };
            }

            if (!response.ok) {
                const txt = await response.text();
                throw new Error(txt || `Failed: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error calculating price:', error);
            return { error: error.message };
        }
    }
};
