import { generateId } from '@common/utils';
import { Injectable } from '@nestjs/common';
import { TokenPair } from '@common/interfaces';
import { SessionStatus } from '@common/constants';
import { PasswordService } from  '@common/services';
import { TokenService } from '../jwt/token.service';
import { SessionRepository } from './session.repository';

import {
    CreateSessionData,
} from './interfaces/session.interface';

@Injectable()
export class SessionService {

    constructor(
        private readonly sessionRepository: SessionRepository,
        private readonly passwordService: PasswordService,
        private readonly tokenService: TokenService,
    ) {}

    async createSession(data: CreateSessionData): Promise<TokenPair> {
        const sessionId = generateId();

        const authTokens = await this.tokenService.generateAuthTokens(data.userId, sessionId);

        const [ refreshToken, expiresAt ] = await Promise.all([
            this.passwordService.hashPassword(authTokens.refreshToken),
            Promise.resolve(this.tokenService.calculateRefreshTokenExpiration()),
        ])

        await this.sessionRepository.createSession({
            id: sessionId,
            userId: data.userId,
            refreshTokenHash: refreshToken,
            status: SessionStatus.ACTIVE,
            userAgent: data.userAgent,
            ipAddress: data.ipAddress,
            expiresAt,
        })

        return authTokens;
    }

}