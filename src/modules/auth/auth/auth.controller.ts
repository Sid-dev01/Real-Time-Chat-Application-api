import { 
    Controller, 
    Body, 
    HttpCode, 
    HttpStatus, 
    Post,
    Ip,
    Req,
} from '@nestjs/common';
import { Client } from '@/common/decorators';
import { AuthService } from './auth.service';
import { type ClientInfo } from '@common/interfaces';
import { LoginDto } from './dto/requests/login.dto';
import { RegisterDto } from './dto/requests/register.dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('register')
    @HttpCode(HttpStatus.CREATED)
    async register(@Body() registerDto: RegisterDto) {
        return this.authService.register(registerDto);
    }

    @Post('login')
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