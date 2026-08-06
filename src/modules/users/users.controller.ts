import {
    Controller,
    Get,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CurrentUser } from '@common/decorators';
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
    
}