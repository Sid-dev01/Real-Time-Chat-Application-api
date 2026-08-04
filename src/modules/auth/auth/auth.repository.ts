import { eq, or } from 'drizzle-orm';
import { Injectable } from '@nestjs/common';
import { DrizzleService } from '@db/drizzle.service';
import { users, type NewUser, type User } from '@db/schema';

@Injectable()
export class AuthRepository {
    private readonly db;

    constructor(private readonly drizzleService: DrizzleService) {
        this.db = drizzleService.database;
    }

    async findByUsername(username: string): Promise<User | null> {
        const [user] = await this.db
        .select()
        .from(users)
        .where(eq(users.username, username))
        .limit(1);

        return user ?? null;
    }

    async findByEmail(email: string): Promise<User | null> {
        const [user] = await this.db
        .select()
        .from(users)
        .where(eq(users.email, email))
        .limit(1);

        return user ?? null;
    }

    async findByMobile(mobile: string): Promise<User | null> {
        const [user] = await this.db
        .select()
        .from(users)
        .where(eq(users.mobile, mobile))
        .limit(1);

        return user ?? null;
    }

    async createUser(newUser: NewUser): Promise<User> {
        const [createdUser] =await this.db
        .insert(users)
        .values(newUser)
        .returning();

        return createdUser;
    }

    async findByCredential(credential: string): Promise<User | null> {
        const [user] = await this.db
        .select()
        .from(users)
        .where(
            or(
                eq(users.username, credential),
                eq(users.email, credential),
                eq(users.mobile, credential),
            ),
        )
        .limit(1);

        return user ?? null
    }
}