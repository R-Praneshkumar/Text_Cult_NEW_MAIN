import AsyncStorage from '@react-native-async-storage/async-storage';

const TOKEN_KEYS = {
    ACCESS_TOKEN: 'texcult_access_token',
    REFRESH_TOKEN: 'texcult_refresh_token',
};

/**
 * Token storage utility using AsyncStorage
 * Note: Switched from SecureStore to avoid native module issues in Expo Go during dev
 */
export const tokenStorage = {
    /**
     * Save both access and refresh tokens
     */
    async saveTokens(accessToken, refreshToken) {
        try {
            await AsyncStorage.multiSet([
                [TOKEN_KEYS.ACCESS_TOKEN, accessToken],
                [TOKEN_KEYS.REFRESH_TOKEN, refreshToken],
            ]);
            return true;
        } catch (error) {
            console.error('Failed to save tokens:', error);
            return false;
        }
    },

    /**
     * Get the current access token
     */
    async getAccessToken() {
        try {
            return await AsyncStorage.getItem(TOKEN_KEYS.ACCESS_TOKEN);
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
            return await AsyncStorage.getItem(TOKEN_KEYS.REFRESH_TOKEN);
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
            await AsyncStorage.multiRemove([
                TOKEN_KEYS.ACCESS_TOKEN,
                TOKEN_KEYS.REFRESH_TOKEN,
            ]);
            return true;
        } catch (error) {
            console.error('Failed to clear tokens:', error);
            return false;
        }
    },
};
