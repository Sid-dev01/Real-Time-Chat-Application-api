import { 
    Controller, 
    Body, 
    HttpCode, 
    HttpStatus, 
    Post,
    Ip,
    Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBearerAuth } from '@nestjs/swagger';
import { LoginDto } from './dto/requests/login.dto';
import { Client, CurrentSession, Public } from '@/common/decorators';
import { type ClientInfo } from '@common/interfaces';
import { RegisterDto } from './dto/requests/register.dto';
import { UseGuards } from '@nestjs/common';
import { RefreshTokenGuard } from '@common/guards';
import { Get } from '@nestjs/common';
import { CurrentUser } from '@common/decorators';
import type { CurrentUser as CurrentUserData } from '@common/interfaces';
import type { AuthSession } from '@/db/schema';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('register')
    @Public()
    @HttpCode(HttpStatus.CREATED)
    async register(@Body() registerDto: RegisterDto) {
        return this.authService.register(registerDto);
    }

    @Post('login')
    @Public()
    @HttpCode(HttpStatus.OK)
    async login(
        @Body() loginDto: LoginDto,
        @Client() clientInfo: ClientInfo,
    ) {

        return this.authService.login(
            loginDto,
            clientInfo
        )
    }

    @Post('refresh')
    @Public()
    @UseGuards(RefreshTokenGuard)
    @ApiBearerAuth()
    async refresh(
        @CurrentUser() user: CurrentUserData,
        @CurrentSession() session: AuthSession,
    ) {
        return this.authService.refresh(
            user,
            session
        )
    }
}