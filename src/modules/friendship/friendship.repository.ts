import { Injectable } from '@nestjs/common';
import { users, friendRequests } from '@db/schema';
import { DrizzleService } from '@db/drizzle.service';
import { FriendRequestStatus } from '@common/constants';
import { eq, and, or, desc, inArray, sql } from 'drizzle-orm';

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

  async findActiveRelationship(userLowId: string, userHighId: string) {
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
          ]),
        ),
      )
      .limit(1);
  }

  async findFriendRequestById(requestId: string) {
    const [request] = await this.db
      .select()
      .from(friendRequests)
      .where(eq(friendRequests.id, requestId))
      .limit(1);

    return request;
  }

  async updateFriendRequestStatus(requestId: string, status: FriendRequestStatus) {
    const [request] = await this.db
      .update(friendRequests)
      .set({
        friendshipStatus: status,
        updatedAt: new Date(),
      })
      .where(eq(friendRequests.id, requestId))
      .returning();

    return request;
  }

  async findReceivedFriendRequests(receiverId: string) {
    return this.db
      .select({
        id: friendRequests.id,
        senderId: friendRequests.senderId,
        senderUsername: users.username,
        friendshipStatus: friendRequests.friendshipStatus,
        createdAt: friendRequests.createdAt,
      })
      .from(friendRequests)
      .innerJoin(users, eq(friendRequests.senderId, users.id))
      .where(
        and(
          eq(friendRequests.receiverId, receiverId),
          eq(friendRequests.friendshipStatus, FriendRequestStatus.PENDING),
        ),
      )
      .orderBy(desc(friendRequests.createdAt));
  }

  async findSentFriendRequests(senderId: string) {
    return this.db
      .select({
        id: friendRequests.id,
        receiverId: friendRequests.receiverId,
        receiverUsername: users.username,
        friendshipStatus: friendRequests.friendshipStatus,
        createdAt: friendRequests.createdAt,
      })
      .from(friendRequests)
      .innerJoin(users, eq(friendRequests.receiverId, users.id))
      .where(
        and(
          eq(friendRequests.senderId, senderId),
          eq(friendRequests.friendshipStatus, FriendRequestStatus.PENDING),
        ),
      )
      .orderBy(desc(friendRequests.createdAt));
  }

  async findAllFriends(userId: string) {
    return this.db
      .select({
        friendId: sql<string>`
                CASE
                    WHEN ${friendRequests.userLowId} = ${userId}
                    THEN ${friendRequests.userHighId}
                    ELSE ${friendRequests.userLowId}
                END
            `,
        friendsSince: friendRequests.updatedAt,
      })
      .from(friendRequests)
      .where(
        and(
          or(eq(friendRequests.userLowId, userId), eq(friendRequests.userHighId, userId)),
          eq(friendRequests.friendshipStatus, FriendRequestStatus.ACCEPTED),
        ),
      )
      .orderBy(desc(friendRequests.updatedAt));
  }
}
