import { sql } from 'drizzle-orm';
import {
    pgTable,
    varchar,
    timestamp,
    check
} from 'drizzle-orm/pg-core';
import { generateId } from '@common/utils';


export const users = pgTable(
    'users',
    {
        id: varchar('id', { length: 26 }).primaryKey(),
        username: varchar('username', { length: 50 }).notNull().unique(),
        email: varchar('email', { length: 255 }).unique(),
        mobile: varchar('mobile', { length: 10 }).unique(),
        password: varchar('password', { length: 255 }).notNull(),

        createdAt: timestamp('created_at', {
            withTimezone: true,
        })
        .defaultNow()
        .notNull(),

        updatedAt: timestamp('updated_at', {
            withTimezone: true,
        })
        .$onUpdateFn(() => new Date())
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