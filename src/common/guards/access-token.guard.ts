import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { FastifyRequest } from 'fastify';
import { IS_PUBLIC_KEY } from '@common/decorators';
import { AUTH_MESSAGES } from '@common/constants';
import { TokenService } from '@modules/auth/jwt/token.service';
import { AuthRepository } from '@modules/auth/auth/auth.repository';


@Injectable()
export class AccessTokenGuard implements CanActivate {
    constructor(
        private readonly reflector: Reflector,
        private readonly tokenService: TokenService,
        private readonly authRepository: AuthRepository,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const isPublic = this.reflector.getAllAndOverride<boolean>(
            IS_PUBLIC_KEY,
            [
                context.getHandler(),
                context.getClass()
            ]
        )

        if(isPublic) {
            return true;
        }

        const request = context.switchToHttp().getRequest<FastifyRequest>();

        const token = this.extractAccessToken(request);

        if(!token) {
            throw new UnauthorizedException(
                AUTH_MESSAGES.ACCESS_TOKKEN_REQUIRED
            )
        }

        const payload = await this.tokenService.verifyAccessToken(token);

        const user = await this.authRepository.findById(payload.sub);

        if(!user) {
            throw new UnauthorizedException(
                AUTH_MESSAGES.INVALID_ACCESS_TOKEN
            )
        }

        request.user = {
            id: user.id,
            username: user.username
        };

        return true;
    }

    private extractAccessToken(request: FastifyRequest): string | null {
        const authorization = request.headers.authorization;

        if(!authorization) {
            return null;
        }

        const [type, token] = authorization.split(' ');

        if(type !== 'Bearer' || !token) {
            return null;
        }

        return token;
    }
}