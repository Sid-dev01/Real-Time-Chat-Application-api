import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { AuthJwtModule } from './jwt/jwt.module';
import { AuthService } from './auth/auth.service';
import { AccessTokenGuard } from '@common/guards';
import { AuthController } from './auth/auth.controller';
import { AuthRepository } from './auth/auth.repository';
import { SessionService } from './session/session.service';
import { SessionRepository } from './session/session.repository';

@Module({
    imports: [AuthJwtModule],
    controllers: [AuthController],
    providers: [
        AuthService, 
        AuthRepository,
        SessionService,
        SessionRepository,
        {
            provide: APP_GUARD,
            useClass: AccessTokenGuard
        }
    ],
    exports: [
        AuthService,
        AuthRepository,
    ]
})

export class AuthModule {}