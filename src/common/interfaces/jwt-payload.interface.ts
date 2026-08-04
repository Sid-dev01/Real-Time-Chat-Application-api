export interface JwtPayload {
    sub: string;
    sid?: string;
}

export interface AccessTokenPayload {
    sub: string;
}

export interface RefreshTokenPayload {
    sub: string;
    sid: string;
}

export interface TokenPair {
    accessToken: string;
    refreshToken: string;
}