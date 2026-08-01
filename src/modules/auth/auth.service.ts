import { 
    Injectable ,
    BadRequestException,
    ConflictException,
} from '@nestjs/common';
import { NewUser } from '@db/schema';
import { AuthRepository } from './auth.repository';
import { SuccessResponse } from '@common/responses';
import { RegisterDto } from './dto/requests/register.dto';
import { UserResponseDto } from './dto/responses/user-response.dto';
import { PasswordService } from '@common/services/password.service';


@Injectable()
export class AuthService {

    constructor(
        private readonly authRepository: AuthRepository,
        private readonly passwordService: PasswordService
    ) {}

    async register(registerDto: RegisterDto): Promise<
        SuccessResponse<UserResponseDto>
    > {

        if (!registerDto.email && !registerDto.mobile) {
            throw new BadRequestException(
                'Either email or mobile number is required.'
            )
        }

        const existingUsername =  await this.authRepository.findByUsername(registerDto.username);

        if (existingUsername) {
            throw new ConflictException('Username is already taken.');
        }

        if (registerDto.email) {
            const existingEmail = await this.authRepository.findByEmail(registerDto.email);

            if(existingEmail) {
                throw new ConflictException('Email is already registered.');
            }
        }

        if (registerDto.mobile) {
            const existingMobile = await this.authRepository.findByMobile(registerDto.mobile);

            if(existingMobile) {
                throw new ConflictException('Mobile number already exists.');
            }
        }

        const hashedPassword = await this.passwordService.hashPassword(registerDto.password);

        const newUser: NewUser = {
            username: registerDto.username,
            email: registerDto.email,
            mobile: registerDto.mobile,
            password: hashedPassword,
        };

        const user  = await this.authRepository.createUser(newUser);

        const response: UserResponseDto = {
            id: user.id,
            username: user.username,
            email: user.email,
            mobile: user.mobile,
        };

        return new SuccessResponse(
            response,
            'Account created successfully.'
        )
    }
}