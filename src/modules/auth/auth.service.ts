import { Injectable } from '@nestjs/common';
import { RegisterDto } from './dto/requests/register.dto';


@Injectable()
export class AuthService {
    register(registerDto: RegisterDto) {
        console.log('Registering user:', registerDto);

        return {
            message: 'User registration endpoint is working.',
        };
    }
}