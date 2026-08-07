import {
    Controller,
    Get,
    Body,
    Patch,
    Param,
    Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CurrentUser, Public } from '@common/decorators';
import { UpdateProfileRequestDto, SearchUserRequestDto } from './dto';
import type { CurrentUser as CurrentUserData } from '@common/interfaces';


@Controller('users')
export class UsersController {

    constructor(
        private readonly usersService: UsersService,
    ){}

    @Get('myprofile')
    async getProfile(
        @CurrentUser() user: CurrentUserData,
    ) {
        return this.usersService.getUserById(user.id);
    }

    @Patch('myprofile')
    async updateMyProfile(
        @CurrentUser() user: CurrentUserData,
        @Body() updateProfileRequestDto: UpdateProfileRequestDto,
    ) {
        return this.usersService.updateMyProfile(user.id, updateProfileRequestDto)
    }
    
    @Get('search')
    @Public()
    async searchUsers(
        @Query() query: SearchUserRequestDto,
    ) {
        return this.usersService.searchUsers(query.query);
    }

    @Get(':id')
    async getUserProfile(
        @Param('id') userId: string,
    ) {
        return this.usersService.getUserProfile(userId);
    }
    
}