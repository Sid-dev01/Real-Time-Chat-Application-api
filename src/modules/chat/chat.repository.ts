import { Injectable } from '@nestjs/common';
import { DrizzleService } from '@db/drizzle.service';
import { conversations, conversationMembers } from '@db/schema';

import {
    and,
    eq,
} from 'drizzle-orm';
@Injectable()
export class ChatRepository {
    private readonly db;

    constructor(private readonly drizzleService: DrizzleService) {
        this.db = drizzleService.database;
    }

    async createConversation(
        conversationId: string,
    ) {
        return this.db
            .insert(conversations)
            .values({
                id: conversationId
            })
            .returning()
    }

    async findConversationBetweenUsers(
        userLowId: string,
        userHighId: string,
    ) {
        return this.db
            .select({
                conversationId: conversations.id,
                createdAt: conversations.createdAt
            })
            .from(conversations)
            .innerJoin(
                conversationMembers,
                eq(
                    conversationMembers.conversationId, conversations.id
                )
            )
            .where(
                and(eq(conversationMembers.userId, userLowId))
            )
    }

    async addConversationMembers(
        members: {
            id: string,
            conversationId: string,
            userId: string;
        }[],
    ) {
        return this.db
            .insert(conversationMembers)
            .values(members)
            .returning();
    }

}