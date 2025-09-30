// Session management utilities

export const SESSION_DURATION = 2700; // 45 minutes in seconds

/**
 * Set login time in localStorage
 */
export const setLoginTime = (): void => {
    const currentTimestamp = Math.floor(Date.now() / 1000);
    localStorage.setItem("loginTime", currentTimestamp.toString());
};

/**
 * Check if current session is still valid
 * @returns boolean - true if session is valid, false if expired
 */
export const isSessionValid = (): boolean => {
    const loginTime = localStorage.getItem("loginTime");
    
    if (!loginTime) {
        return false;
    }
    
    const currentTimestamp = Math.floor(Date.now() / 1000);
    const loginTimestamp = parseInt(loginTime, 10);
    const timeDifference = currentTimestamp - loginTimestamp;
    
    return timeDifference <= SESSION_DURATION;
};

/**
 * Get remaining session time in seconds
 * @returns number - remaining seconds, or 0 if expired
 */
export const getRemainingSessionTime = (): number => {
    const loginTime = localStorage.getItem("loginTime");
    
    if (!loginTime) {
        return 0;
    }
    
    const currentTimestamp = Math.floor(Date.now() / 1000);
    const loginTimestamp = parseInt(loginTime, 10);
    const timeDifference = currentTimestamp - loginTimestamp;
    const remaining = SESSION_DURATION - timeDifference;
    
    return remaining > 0 ? remaining : 0;
};

/**
 * Clear all session data
 */
export const clearSession = (): void => {
    localStorage.removeItem("token");
    localStorage.removeItem("loginTime");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("username");
    localStorage.removeItem("email");
};

/**
 * Extend session time (call this on user activity)
 */
export const extendSession = (): void => {
    setLoginTime();
};