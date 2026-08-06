export interface JwtPayload {
    sub: string;
    sid?: string;
}

export interface AccessTokenPayload extends JwtPayload{
    sub: string;
    sid: string;
}

export interface RefreshTokenPayload {
    sub: string;
    sid: string;
}

export interface TokenPair {
    accessToken: string;
    refreshToken: string;
}