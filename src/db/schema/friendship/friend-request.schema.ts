import { sql } from 'drizzle-orm';
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
        id: varchar('id', { length: 26 })
            .primaryKey(),

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

        userLowId: varchar('user_low_id', { length: 26 })
            .notNull()
            .references(() => users.id, {
                onDelete: 'cascade',
            }),

        userHighId: varchar('user_high_id', { length: 26 })
            .notNull()
            .references(() => users.id, {
                onDelete: 'cascade',
            }),

        friendshipStatus: smallint('friendship_status')
            .notNull()
            .default(FriendRequestStatus.PENDING),

        createdAt: timestamp('created_at', {
            withTimezone: true,
        })
            .defaultNow()
            .notNull(),

        updatedAt: timestamp('updated_at', {
            withTimezone: true,
        })
            .defaultNow()
            .notNull(),
    },

    (table) => ({
        activeRelationshipUniqueIdx: uniqueIndex(
            'friend_requests_active_relationship_unique_idx',
        )
            .on(table.userLowId, table.userHighId)
            .where(
                sql`${table.friendshipStatus} IN (1, 2)`,
            ),

        statusIdx: index(
            'friend_requests_status_idx',
        ).on(table.friendshipStatus),
    }),
);