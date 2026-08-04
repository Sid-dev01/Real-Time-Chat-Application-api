import { Module } from '@nestjs/common';
import { AuthService } from './auth/auth.service';
import { AuthJwtModule } from './jwt/jwt.module';
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
        SessionRepository
    ],
    exports: [
        AuthService,
    ]
})

export class AuthModule {}