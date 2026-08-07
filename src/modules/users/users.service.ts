import { AUTH_MESSAGES } from '@common/constants';
import { SuccessResponse } from '@common/responses';
import { UsersRepository } from './users.repository';
import { ProfileResponseDto, UpdateProfileRequestDto, PublicProfileResponseDto } from './dto'
import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';

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

    async updateMyProfile(
        userId: string,
        dto: UpdateProfileRequestDto,
    ): Promise<SuccessResponse<ProfileResponseDto>> {
        const existingUser = await this.usersRepository.findByUsername(dto.username);

        if(existingUser && existingUser.id !== userId) {
            throw new ConflictException(AUTH_MESSAGES.USERNAME_TAKEN);
        }

        const updatedUser = await this.usersRepository.updateProfile(userId,{ username: dto.username });

        if(!updatedUser) {
            throw new NotFoundException(AUTH_MESSAGES.USER_NOT_FOUND);
        }

        const profile: ProfileResponseDto = {
            id: updatedUser.id,
            username: updatedUser.username,
            email: updatedUser.email,
            mobile: updatedUser.mobile,
            createdAt: updatedUser.createdAt,
            updatedAt: updatedUser.updatedAt,
        }

        return new SuccessResponse(
            profile,
            'Profile update successfully.',
        )
    }

    async getUserProfile(
        userId: string,
    ): Promise<SuccessResponse<PublicProfileResponseDto>> {
        const user = await this.usersRepository.findById(userId);

        if(!user) {
            throw new NotFoundException(AUTH_MESSAGES.USER_NOT_FOUND);
        }

        const profile: PublicProfileResponseDto = {
            id: user.id,
            username: user.username,
        }

        return new SuccessResponse(
            profile,
            'Profile fetched successfully.'
        )
    }

    async searchUsers(query: string):
    Promise<SuccessResponse<PublicProfileResponseDto[]>> {
        const users = await this.usersRepository.searchUsers(query);

        const results: PublicProfileResponseDto[] = users.map(user => ({
            id: user.id,
            username: user.username,
        }));

        return new SuccessResponse(
            results,
            'Users fetched successfully.',
        )
    }
}