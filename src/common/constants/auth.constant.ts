export const AUTH_MESSAGES = {
    ACCOUNT_CREATED: 'Account created successfully.',
    LOGIN_SUCCESS: 'Login successful.',

    INVALID_CREDENTIALS: 'Invalid email/mobile or password.',

    USERNAME_TAKEN: 'Username is already taken.',
    EMAIL_REGISTERED: 'Email is already registered.',
    MOBILE_REGISTERED: 'Mobile number is already registered.',

    EMAIL_OR_MOBILE_REQUIRED: 'Either email or mobile number is required.',

    ACCESS_TOKKEN_REQUIRED: 'Access token is required.',

    INVALID_ACCESS_TOKEN: 'Invalid access token.',

    REFRESH_TOKEN_REQUIRED: 'Refresh token is required.',

    REFRESH_TOKEN_EXPIRED: 'Refresh token has expired.',

    INVALID_REFRESH_TOKEN: 'Invalid refresh token.',

    LOGOUT_SUCCESS: 'Logout successful.',

    LOGOUT_ALL_SUCCESS: 'All sessions have been logged out successfully.',

    USER_NOT_FOUND: 'User not found.',
} as const;