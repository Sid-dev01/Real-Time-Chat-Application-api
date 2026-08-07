import {
    pgTable,
    varchar,
    timestamp,
    smallint,
    index,
    uniqueIndex,
} from 'drizzle-orm/pg-core';
import { users } from '@db/schema';
import { FriendRequestStatus } from '@common/constants';

export const friendRequests = pgTable(
    'friend_requests',
    {
        id: varchar('id', { length: 26 }).primaryKey(),

        senderId: varchar('sender_id', { length: 26 })
            .notNull()
            .references(() => users.id, {
                onDelete: 'cascade',
            }),
        
        receiverId: varchar('receiver_id', { length: 26 })
            .notNull()
            .references(() => users.id, {
                onDelete: 'cascade',
            }),

        friendshipStatus: smallint('friendship_status')
            .notNull()
            .default(FriendRequestStatus.PENDING),

        createdAt: timestamp('created_at',{
            withTimezone: true,
        })
            .defaultNow()
            .notNull(),

        updatedAt: timestamp('updated_at', {
            withTimezone: true,
        })
            .defaultNow()
            .notNull()
    },
    (table) => ({
        senderReceiverUniqueIdx: uniqueIndex(
            'friend_requests_sender_receiver_unique_idx',
        ).on(table.senderId, table.receiverId),

        statusIdx: index(
            'friend_requests_status_idx',
        ).on(table.friendshipStatus),
    }),

)