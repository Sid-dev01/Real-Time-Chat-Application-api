import { NewUser } from '@db/schema';
import { generateId } from '@common/utils';
import { ClientInfo } from '@common/interfaces';
import { AUTH_MESSAGES } from '@common/constants';
import { AuthRepository } from './auth.repository';
import { SuccessResponse } from '@common/responses';
import { SessionService } from '../session/session.service';
import { PasswordService } from '@common/services/password.service';
import { TokenPair } from '@common/interfaces/jwt-payload.interface';
import { Injectable, BadRequestException, ConflictException } from '@nestjs/common';
import { RegisterDto, LoginDto, RegisterResponseDto } from './dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly passwordService: PasswordService,
    private readonly sessionService: SessionService,
  ) {}

  async register(registerDto: RegisterDto): Promise<SuccessResponse<RegisterResponseDto>> {
    if (!registerDto.email && !registerDto.mobile) {
      throw new BadRequestException(AUTH_MESSAGES.EMAIL_OR_MOBILE_REQUIRED);
    }

    const existingUsername = await this.authRepository.findByUsername(registerDto.username);

    if (existingUsername) {
      throw new ConflictException(AUTH_MESSAGES.USERNAME_TAKEN);
    }

    if (registerDto.email) {
      const existingEmail = await this.authRepository.findByEmail(registerDto.email);

      if (existingEmail) {
        throw new ConflictException(AUTH_MESSAGES.EMAIL_REGISTERED);
      }
    }

    if (registerDto.mobile) {
      const existingMobile = await this.authRepository.findByMobile(registerDto.mobile);

      if (existingMobile) {
        throw new ConflictException(AUTH_MESSAGES.MOBILE_REGISTERED);
      }
    }

    const userId = generateId();
    const hashedPassword = await this.passwordService.hashPassword(registerDto.password);

    const newUser: NewUser = {
      id: userId,
      username: registerDto.username,
      email: registerDto.email,
      mobile: registerDto.mobile,
      password: hashedPassword,
    };

    const user = await this.authRepository.createUser(newUser);

    const response: RegisterResponseDto = {
      id: user.id,
      username: user.username,
      email: user.email,
      mobile: user.mobile,
    };

    return new SuccessResponse(response, 'Account created successfully.');
  }

  async login(
    loginDto: LoginDto,
    clientInfo: ClientInfo
  ): Promise<SuccessResponse<TokenPair>> {
    
    const user = await this.authRepository.findByCredential(loginDto.credential);

    if (!user) {
        throw new BadRequestException(AUTH_MESSAGES.INVALID_CREDENTIALS);
    }

    const isPasswordValid = await this.passwordService.verifyPassword(loginDto.password, user.password);

    if (!isPasswordValid) {
        throw new BadRequestException(AUTH_MESSAGES.INVALID_CREDENTIALS);
    }

    const authTokens = await this.sessionService.createSession({
        userId: user.id,
        userAgent: clientInfo.userAgent,
        ipAddress: clientInfo.ipAddress
    });

    const response: TokenPair = {
        accessToken: authTokens.accessToken,
        refreshToken: authTokens.refreshToken,
    }

    return new SuccessResponse(
        response,
        AUTH_MESSAGES.LOGIN_SUCCESS
    )
  }
}
