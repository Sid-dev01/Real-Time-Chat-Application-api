import { Injectable } from '@nestjs/common';
import { friendRequests } from '@db/schema';
import { DrizzleService } from '@db/drizzle.service';
import { FriendRequestStatus } from '@common/constants';

import { 
    eq,
    and,
    inArray,
} from 'drizzle-orm'


@Injectable()
export class FriendshipRepository {
    private readonly db;

    constructor(private readonly drizzleService: DrizzleService) {
        this.db = drizzleService.database;
    }

    async createFriendshipRequest(data: {
        id: string;
        senderId: string;
        receiverId: string;
        userLowId: string;
        userHighId: string;
    }) {
        return this.db
            .insert(friendRequests)
            .values({
                id: data.id,
                senderId: data.senderId,
                receiverId: data.receiverId,
                userLowId: data.userLowId,
                userHighId: data.userHighId,
            })
            .returning();
    }

    async findActiveRelationship(
        userLowId: string,
        userHighId: string,
    ) {
        return this.db
            .select()
            .from(friendRequests)
            .where(
                and(
                    eq(friendRequests.userLowId, userLowId),
                    eq(friendRequests.userHighId, userHighId),
                    inArray(friendRequests.friendshipStatus, [
                        FriendRequestStatus.PENDING,
                        FriendRequestStatus.ACCEPTED,
                    ])
                )
            )
            .limit(1);
    }
}