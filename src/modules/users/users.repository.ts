import { eq } from 'drizzle-orm';
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
}
