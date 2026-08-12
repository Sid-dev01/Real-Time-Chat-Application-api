import {
    Controller,
    Post,
    Param,
} from '@nestjs/common';
import { CurrentUser } from '@common/decorators';
import { FriendshipService } from './friendship.service';
import type { CurrentUserData } from '@common/interfaces';

@Controller('friendship')
export class FriendshipController {
    constructor(
        private readonly friendshipService: FriendshipService,
    ) {}

    @Post('request/:userId')
    async sendFriendRequest(
        @CurrentUser() user: CurrentUserData,
        @Param('userId') recieverId: string,
    ) {
        return this.friendshipService.sendFriendRequest(user.id, recieverId);
    }
}