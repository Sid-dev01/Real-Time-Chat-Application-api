import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { FastifyRequest } from 'fastify';
import { TokenHashService } from '@common/services/';
import { TokenService } from '@modules/auth/jwt/token.service';
import { AUTH_MESSAGES, SessionStatus } from '@common/constants';
import { AuthRepository } from '@modules/auth/auth/auth.repository';
import { SessionRepository } from '@modules/auth/session/session.repository';


@Injectable()
export class RefreshTokenGuard implements CanActivate {
    constructor(
        private readonly reflector: Reflector,
        private readonly tokenService: TokenService,
        private readonly authRepository: AuthRepository,
        private readonly sessionRepository: SessionRepository,
        private readonly tokenHashService: TokenHashService,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest<FastifyRequest>();

        const refreshToken = this.extractBearerToken(request);


        if (!refreshToken) {
            throw new UnauthorizedException(
                AUTH_MESSAGES.REFRESH_TOKEN_REQUIRED,
            )
        }

        const payload = await this.tokenService.verifyRefreshToken(refreshToken);

        const session = await this.sessionRepository.findBySessionId(payload.sid);

        if (!session) {
            throw new UnauthorizedException(
                AUTH_MESSAGES.INVALID_REFRESH_TOKEN,
            );
        }

        if (session.status !== SessionStatus.ACTIVE) {
            throw new UnauthorizedException(
                AUTH_MESSAGES.REFRESH_TOKEN_EXPIRED,
            )
        }

        const isValid = await this.tokenHashService.verify(
            refreshToken,
            session.refreshTokenHash
        )

        if (!isValid) {
            await this.sessionRepository.revoke(session.id);

            throw new UnauthorizedException(
                AUTH_MESSAGES.INVALID_REFRESH_TOKEN,
            )
        }

        const user = await this.authRepository.findById(payload.sub);

        if(!user) {
            throw new UnauthorizedException(
                AUTH_MESSAGES.INVALID_REFRESH_TOKEN,
            )
        }

        request.user = {
            id: user.id,
            username: user.username,
        }

        request.session = session;

        return true;
    }

    private extractBearerToken(request: FastifyRequest): string | null {
        const authorization = request.headers.authorization;

        if(!authorization) {
            return null;
        }

        const [scheme, token] = authorization.split(' ');

        if(scheme !== 'Bearer' || !token) {
            return null;
        }

        return token;
    }
}