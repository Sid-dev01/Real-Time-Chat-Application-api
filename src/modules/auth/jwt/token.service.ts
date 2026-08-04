import ms, { StringValue } from 'ms';
import { JwtService } from '@nestjs/jwt';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TokenPair, JwtPayload, AccessTokenPayload, RefreshTokenPayload } from '@common/interfaces';

@Injectable()
export class TokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  private get accessTokenSecret(): string {
    return this.configService.getOrThrow<string>('auth.jwtAccessSecret');
  }

  private get accessTokenExpiresIn(): StringValue {
    return this.configService.getOrThrow<StringValue>('auth.jwtAccessExpiresIn');
  }

  private get refreshTokenSecret(): string {
    return this.configService.getOrThrow<string>('auth.jwtRefreshSecret');
  }

  private get refreshTokenExpiresIn(): StringValue {
    return this.configService.getOrThrow<StringValue>(
      'auth.jwtRefreshExpiresIn',
    );
  }

  calculateRefreshTokenExpiration(): Date {
    const expiresIn = this.refreshTokenExpiresIn;

    if(typeof expiresIn === 'number') {
        return new Date(Date.now() + expiresIn * 1000);
    }
    
    const duration = ms(expiresIn as StringValue);
    
    if (duration == undefined) {
        throw new Error(`Invalid refresh token expiration: ${expiresIn}`);
    }

    return new Date(Date.now() + duration);
  }

  //Internal Helpers for signing JWT
  private async generateToken<T extends JwtPayload>(
    payload: T,
    secret: string,
    expiresIn: StringValue,
  ): Promise<string> {
    return this.jwtService.signAsync(payload, {
      secret,
      expiresIn,
    });
  }

  //Internal Helpers for verifying JWT
  private async verifyToken<T extends JwtPayload>(token: string, secret: string): Promise<T> {
    return this.jwtService.verifyAsync<T>(token, {
      secret,
    });
  }

  async generateAccessToken(userId: string): Promise<string> {
    const payload: AccessTokenPayload = {
      sub: userId,
    };

    return this.generateToken(payload, this.accessTokenSecret, this.accessTokenExpiresIn);
  }

  async generateRefreshToken(userId: string, sessionId: string): Promise<string> {
    const payload: RefreshTokenPayload = {
      sub: userId,
      sid: sessionId,
    };

    return this.generateToken(payload, this.refreshTokenSecret, this.refreshTokenExpiresIn);
  }

  async verifyAccessToken(token: string): Promise<AccessTokenPayload> {
    return this.verifyToken<AccessTokenPayload>(token, this.accessTokenSecret);
  }

  async verifyRefreshToken(token: string): Promise<RefreshTokenPayload> {
    return this.verifyToken<RefreshTokenPayload>(token, this.refreshTokenSecret);
  }

  async generateAuthTokens(userId: string, sessionId: string): Promise<TokenPair> {
    const [accessToken, refreshToken] = await Promise.all([
      this.generateAccessToken(userId),
      this.generateRefreshToken(userId, sessionId),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }
}