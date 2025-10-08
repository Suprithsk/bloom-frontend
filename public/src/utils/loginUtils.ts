// Login utilities for authentication and session management

import { setLoginTime } from './sessionManager';

export interface LoginData {
    token: string;
    refresh_token?: string;
    username?: string;
    email?: string;
}

/**
 * Handle successful login by storing tokens and setting login time
 * @param loginData - The login response data containing tokens and user info
 */
export const handleSuccessfulLogin = (loginData: LoginData): void => {
    // Store authentication tokens and user data
    localStorage.setItem("token", loginData.token);
    
    if (loginData.refresh_token) {
        localStorage.setItem("refresh_token", loginData.refresh_token);
    }
    
    if (loginData.username) {
        localStorage.setItem("username", loginData.username);
    }
    
    if (loginData.email) {
        localStorage.setItem("email", loginData.email);
    }
    
    // Set the login timestamp for session tracking
    setLoginTime();
};

/**
 * Update stored tokens after token refresh
 * @param newToken - The new access token
 * @param newRefreshToken - The new refresh token (optional)
 */
export const updateTokens = (newToken: string, newRefreshToken?: string): void => {
    localStorage.setItem("token", newToken);
    
    if (newRefreshToken) {
        localStorage.setItem("refresh_token", newRefreshToken);
    }
    
    // Extend the session when tokens are refreshed
    setLoginTime();
};