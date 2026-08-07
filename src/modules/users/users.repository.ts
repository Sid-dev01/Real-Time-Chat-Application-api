import { eq, and, ne, ilike } from 'drizzle-orm';
import { Injectable } from '@nestjs/common';
import { DrizzleService } from '@db/drizzle.service';
import { users, type User, type NewUser } from '@db/schema';

@Injectable()
export class UsersRepository {
  private readonly db;

  constructor(private readonly drizzleService: DrizzleService) {
    this.db = drizzleService.database;
  }

  async findById(userId: string): Promise<User | null> {
    const [user] = await this.db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    return user ?? null;
  }

  async findByUsername(username: string): Promise<User | null> {
    const [user] = await this.db
      .select()
      .from(users)
      .where(eq(users.username, username))
      .limit(1);
    
    return user ?? null;
  }

  async updateProfile(
    userId: string,
    data: {
      username: string;
    }
  ): Promise<User | null> {
    const [updatedUser] = await this.db
      .update(users)
      .set({
        username: data.username,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId))
      .returning();

    return updatedUser ?? null;
  }

  async searchUsers(query: string): Promise<User[]> {
    return this.db
      .select()
      .from(users)
      .where(ilike(users.username, `%${query}%`))
      .limit(10);
  }
}
