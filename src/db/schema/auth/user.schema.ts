import { sql } from 'drizzle-orm';
import {
    pgTable,
    uuid,
    varchar,
    timestamp,
    check
} from 'drizzle-orm/pg-core';


export const users = pgTable(
    'users',
    {
        id: uuid('id').defaultRandom().primaryKey(),
        username: varchar('username', { length: 50 }).notNull().unique(),
        email: varchar('email', { length: 255 }).unique(),
        mobile: varchar('mobile', { length: 10 }).unique(),
        password: varchar('password', { length: 255 }).notNull(),

        createdAt: timestamp('created_at', {
            withTimezone: true,
        })
        .defaultNow()
        .notNull(),

        updateAt: timestamp('updated_at', {
            withTimezone: true,
        })
        .defaultNow()
        .notNull(),
    },
    (table) => [
        check(
            `users_email_or_mobile_check`,
            sql`${table.email} IS NOT NULL OR ${table.mobile} IS NOT NULL`,
        ),
    ],
);

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;