import {
    pgTable,
    varchar,
    text,
    smallint,
    timestamp,
    index,
} from 'drizzle-orm/pg-core';
import { users } from './user.schema';
import { SessionStatus } from '@common/constants';

export const authSessions = pgTable(
    'auth_sessions',
    {
        id: varchar('id', { length: 26 }).primaryKey(),
        
        userId: varchar('user_id', { length: 26 })
            .notNull()
            .references(() => users.id, {
                onDelete: 'cascade',
                onUpdate: 'cascade',
            }),

        refreshTokenHash: varchar('refresh_token_hash', { length: 255 }).notNull(),
        
        status: smallint('status')
            .notNull()
            .default(SessionStatus.ACTIVE),
        
        userAgent: text('user_agent').notNull(),

        ipAddress: varchar('ip_address', { length: 45 }).notNull(),

        lastUsedAt: timestamp('last_used_at', {
            withTimezone: true,
        })
            .defaultNow()
            .notNull(),
        
        expiresAt: timestamp('expires_at', {
            withTimezone: true,
        }).notNull(),

        createdAt: timestamp('created_at', {
            withTimezone: true,
        })
            .defaultNow()
            .notNull(),
        
        updatedAt: timestamp('updated_at', {
            withTimezone: true,
        })
            .defaultNow()
            .$onUpdateFn(() => new Date())
            .notNull(),
    },
    (table) => [
        index('auth_sessions_user_id_idx').on(table.userId),
    ]
);

export type AuthSession = typeof authSessions.$inferSelect;
export type NewAuthSession = typeof authSessions.$inferInsert;