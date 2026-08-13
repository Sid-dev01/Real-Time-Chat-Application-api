import {
    pgTable,
    varchar,
    timestamp,
} from 'drizzle-orm/pg-core';

export const conversations = pgTable(
    'conversations',
    {
        id: varchar('id', { length: 26 })
            .primaryKey(),

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
);