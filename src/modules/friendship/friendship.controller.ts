import {
    Controller,
    Post,
    Get,
    Param,
    Delete,
    Patch
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

    @Patch('request/:requestId/accept')
    async acceptFriendRequest(
        @CurrentUser() user: CurrentUserData,
        @Param('requestId') requestId: string,
    ) {
        return this.friendshipService.acceptFriendRequest(requestId, user.id);
    }

    @Patch('request/:requestId/reject')
    async rejectFriendRequest(
        @CurrentUser() user: CurrentUserData,
        @Param('requestId') requestId: string,
    ) {
        return this.friendshipService.rejectFriendRequest(requestId, user.id);
    }

    @Patch('request/:requestId/cancel')
    async cancelFriendRequest(
        @CurrentUser() user: CurrentUserData,
        @Param('requestId') requestId: string,
    ) {
        return this.friendshipService.cancelFriendRequest(requestId, user.id);
    }

    @Get('requests/received')
    async getReceivedFriendRequests(
        @CurrentUser() user: CurrentUserData,
    ){
        return this.friendshipService.getReceivedFriendRequests(user.id);
    }

    @Get('requests/sent')
    async getSentFriendRequests(
        @CurrentUser() user: CurrentUserData,
    ) {
        return this.friendshipService.getSentFriendRequests(user.id);
    }

    @Get('friends')
    async getFriends(
        @CurrentUser() user: CurrentUserData,
    ) {
        return this.friendshipService.getAllFriends(user.id);
    }

    @Delete(':userId')
    async unfriend(
        @CurrentUser() user: CurrentUserData,
        @Param('userId') friendId: string,
    ) {
        return this.friendshipService.unfriend(user.id, friendId);
    }
}