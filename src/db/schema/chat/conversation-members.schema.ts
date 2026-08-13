import {
    pgTable,
    varchar,
    timestamp,
    index,
    uniqueIndex,
} from 'drizzle-orm/pg-core';

import { users } from '@db/schema';
import { conversations } from './conversation.schema';

export const conversationMembers = pgTable(
    'conversation_members',
    {
        id: varchar('id', { length: 26 })
            .primaryKey(),

        conversationId: varchar('conversation_id', {
            length: 26,
        })
            .notNull()
            .references(() => conversations.id, {
                onDelete: 'cascade',
            }),

        userId: varchar('user_id', {
            length: 26,
        })
            .notNull()
            .references(() => users.id, {
                onDelete: 'cascade',
            }),

        joinedAt: timestamp('joined_at', {
            withTimezone: true,
        })
            .defaultNow()
            .notNull(),
    },

    (table) => ({
        conversationUserUniqueIdx: uniqueIndex(
            'conversation_members_conversation_user_unique_idx',
        ).on(
            table.conversationId,
            table.userId,
        ),

        userIdx: index(
            'conversation_members_user_idx',
        ).on(table.userId),

        conversationIdx: index(
            'conversation_members_conversation_idx',
        ).on(table.conversationId),
    }),
);