import React, { createContext, useState, useContext, useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet, Text } from 'react-native';
import { authService } from '../api/authService';
import { tokenStorage } from '../utils/secureStorage';

// Create the Auth Context
const AuthContext = createContext(null);

/**
 * Loading screen shown while checking auth status
 */
const LoadingScreen = () => (
    <View style={loadingStyles.container}>
        <ActivityIndicator size="large" color="#513B56" />
        <Text style={loadingStyles.text}>Loading...</Text>
    </View>
);

const loadingStyles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F9F5F0',
    },
    text: {
        marginTop: 16,
        fontSize: 16,
        color: '#513B56',
    },
});

/**
 * Auth Provider Component
 * Wraps the app to provide authentication state and methods
 */
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Check for existing session on app startup
    useEffect(() => {
        checkAuthStatus();
    }, []);

    /**
   * Check if user has a valid session on app start
   * NOTE: For now, just check if tokens exist locally without calling backend
   */
    const checkAuthStatus = async () => {
        try {
            setIsLoading(true);

            // Add a small delay to ensure secure store is ready
            await new Promise(resolve => setTimeout(resolve, 300));

            // Just check if tokens exist - don't refresh on startup
            // This prevents the app from hanging if backend is slow
            const hasTokens = await tokenStorage.hasTokens();

            if (hasTokens) {
                // For now, assume tokens are valid if they exist
                // Token refresh will happen when making API calls
                setUser({ isLoggedIn: true });
            } else {
                setUser(null);
            }
        } catch (err) {
            console.error('Auth check failed:', err);
            setUser(null);
        } finally {
            setIsLoading(false);
        }
    };

    /**
     * Login with email and password
     */
    const login = async (email, password) => {
        setError(null);
        try {
            const tokens = await authService.login(email, password);
            await tokenStorage.saveTokens(tokens.accessToken, tokens.refreshToken);
            setUser({ isLoggedIn: true });
            return { success: true };
        } catch (err) {
            setError(err.message);
            return { success: false, error: err.message };
        }
    };

    /**
     * Register a new user
     */
    const signup = async (userData) => {
        setError(null);
        try {
            const tokens = await authService.signup(userData);
            await tokenStorage.saveTokens(tokens.accessToken, tokens.refreshToken);
            setUser({ isLoggedIn: true });
            return { success: true };
        } catch (err) {
            setError(err.message);
            return { success: false, error: err.message };
        }
    };

    /**
     * Logout the current user
     */
    const logout = async () => {
        await tokenStorage.clearTokens();
        setUser(null);
        setError(null);
    };

    /**
     * Clear any auth errors
     */
    const clearError = () => {
        setError(null);
    };

    const value = {
        user,
        isLoading,
        error,
        login,
        signup,
        logout,
        clearError,
        isAuthenticated: !!user?.isLoggedIn,
    };

    // Show loading screen while checking auth status
    if (isLoading) {
        return <LoadingScreen />;
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

/**
 * Hook to use auth context
 * @returns {Object} Auth context value
 */
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
