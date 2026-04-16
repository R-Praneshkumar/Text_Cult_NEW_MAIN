import * as SecureStore from 'expo-secure-store';

const TOKEN_KEYS = {
    ACCESS_TOKEN: 'texcult_access_token',
    REFRESH_TOKEN: 'texcult_refresh_token',
};

/**
 * Token storage utility using expo-secure-store
 * Enforces hardware-backed encryption for production security.
 */
export const tokenStorage = {
    /**
     * Save both access and refresh tokens securely
     */
    async saveTokens(accessToken, refreshToken) {
        try {
            await SecureStore.setItemAsync(TOKEN_KEYS.ACCESS_TOKEN, accessToken);
            if (refreshToken) {
                await SecureStore.setItemAsync(TOKEN_KEYS.REFRESH_TOKEN, refreshToken);
            }
            return true;
        } catch (error) {
            console.error('Failed to save tokens securely:', error);
            return false;
        }
    },

    /**
     * Get the current access token
     */
    async getAccessToken() {
        try {
            return await SecureStore.getItemAsync(TOKEN_KEYS.ACCESS_TOKEN);
        } catch (error) {
            console.error('Failed to get access token:', error);
            return null;
        }
    },

    /**
     * Get the current refresh token
     */
    async getRefreshToken() {
        try {
            return await SecureStore.getItemAsync(TOKEN_KEYS.REFRESH_TOKEN);
        } catch (error) {
            console.error('Failed to get refresh token:', error);
            return null;
        }
    },

    /**
     * Check if user has saved tokens (is logged in)
     */
    async hasTokens() {
        const accessToken = await this.getAccessToken();
        return !!accessToken;
    },

    /**
     * Clear all tokens (logout)
     */
    async clearTokens() {
        try {
            await SecureStore.deleteItemAsync(TOKEN_KEYS.ACCESS_TOKEN);
            await SecureStore.deleteItemAsync(TOKEN_KEYS.REFRESH_TOKEN);
            return true;
        } catch (error) {
            console.error('Failed to clear tokens:', error);
            return false;
        }
    },
};
