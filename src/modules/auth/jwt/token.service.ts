import { JwtService } from '@nestjs/jwt';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtPayload } from '@common/interfaces';
import type { SignOptions } from 'jsonwebtoken';


@Injectable()
export class TokenService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService
    ) {}

    private get accessTokenSecret(): string {
        return this.configService.getOrThrow<string>('auth.jwt.accessTokenSecret');    
    }

    private get accessTokenExpiresIn(): SignOptions['expiresIn'] {
        return this.configService.getOrThrow<SignOptions['expiresIn']>('auth.jwt.accessTokenExpiresIn');
    }

    private get refreshTokenSecret() : string {
        return this.configService.getOrThrow<string>('auth.jwt.refreshTokenSecret');
    }

    private get refreshTokenExpiresIn(): SignOptions['expiresIn'] {
        return this.configService.getOrThrow<SignOptions['expiresIn']>('auth.jwt.refreshTokenExpiresIn');
    }

    //Helper function for the acces tokens
    private async generateToken(
        payload: JwtPayload,
        secret: string,
        expiresIn: SignOptions['expiresIn']
    ): Promise<string> {
        return this.jwtService.signAsync(payload, {
            secret,
            expiresIn
        });
    }

    //Helper function for the refresh tokens
    private async verifyToken(
        token: string,
        secret: string,
    ): Promise<JwtPayload> {
        return this.jwtService.verifyAsync<JwtPayload>(
            token,
            {
                secret,
            }
        )
    }

    async generateAccessToken(userId: string): Promise<string> {
        const payload: JwtPayload = {
            sub: userId,
        }

        return this.generateToken(
            payload,
            this.accessTokenSecret,
            this.accessTokenExpiresIn
        )
    }

    async generateRefreshToken(userId: string): Promise<string> {
        const payload: JwtPayload = {
            sub: userId,
        };

        return this.generateToken(
            payload,
            this.refreshTokenSecret,
            this.refreshTokenExpiresIn
        )
    }

    async verifyAccessToken(token: string): Promise<JwtPayload> {
        return this.verifyToken(
            token,
            this.accessTokenSecret
        )
    }

    async verifyRefreshToken(token: string): Promise<JwtPayload> {
        return this.verifyToken(
            token,
            this.refreshTokenSecret
        )
    }

}