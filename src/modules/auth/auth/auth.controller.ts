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
import { LoginDto } from './dto/requests/login.dto';
import { Client, Public } from '@/common/decorators';
import { type ClientInfo } from '@common/interfaces';
import { RegisterDto } from './dto/requests/register.dto';

import { Get } from '@nestjs/common';
import { CurrentUser } from '@common/decorators';
import type { CurrentUser as CurrentUserData } from '@common/interfaces';

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
}