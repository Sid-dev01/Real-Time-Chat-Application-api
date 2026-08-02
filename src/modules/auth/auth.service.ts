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
import { AUTH_MESSAGES } from '@common/constants';


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
                AUTH_MESSAGES.EMAIL_OR_MOBILE_REQUIRED
            )
        }

        const existingUsername =  await this.authRepository.findByUsername(registerDto.username);

        if (existingUsername) {
            throw new ConflictException(AUTH_MESSAGES.USERNAME_TAKEN);
        }

        if (registerDto.email) {
            const existingEmail = await this.authRepository.findByEmail(registerDto.email);

            if(existingEmail) {
                throw new ConflictException(AUTH_MESSAGES.EMAIL_REGISTERED);
            }
        }

        if (registerDto.mobile) {
            const existingMobile = await this.authRepository.findByMobile(registerDto.mobile);

            if(existingMobile) {
                throw new ConflictException(AUTH_MESSAGES.MOBILE_REGISTERED);
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