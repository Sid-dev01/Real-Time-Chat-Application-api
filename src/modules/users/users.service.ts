import { ProfileResponseDto } from './dto'
import { AUTH_MESSAGES } from '@common/constants';
import { SuccessResponse } from '@common/responses';
import { UsersRepository } from './users.repository';
import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class UsersService {

    constructor(
        private readonly usersRepository: UsersRepository,
    ) {}
    
    async getUserById(userId: string): Promise<SuccessResponse<ProfileResponseDto>> {
        const user = await this.usersRepository.findById(userId);

        if(!user) {
            throw new NotFoundException(AUTH_MESSAGES.USER_NOT_FOUND);
        }

        const profile: ProfileResponseDto = {
            id: user.id,
            username: user.username,
            email: user.email,
            mobile: user.mobile,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        };

        return new SuccessResponse<ProfileResponseDto>(profile, 'Profile created successfully');
    }
}