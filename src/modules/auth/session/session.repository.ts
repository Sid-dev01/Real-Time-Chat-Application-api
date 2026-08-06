import { authSessions, type AuthSession, type NewAuthSession } from '@db/schema';
import { and, eq, lt, or } from 'drizzle-orm';
import { Injectable } from '@nestjs/common';
import { SessionStatus } from '@common/constants';
import { DrizzleService } from '@db/drizzle.service';

@Injectable()
export class SessionRepository {
  private readonly db;

  constructor(private readonly drizzleService: DrizzleService) {
    this.db = drizzleService.database;
  }

  async createSession(session: NewAuthSession): Promise<AuthSession> {
    const [createdSession] = await this.db.insert(authSessions).values(session).returning();

    return createdSession;
  }

  async findBySessionId(sessionId: string): Promise<AuthSession | undefined> {
    const [session] = await this.db
      .select()
      .from(authSessions)
      .where(eq(authSessions.id, sessionId))
      .limit(1);

    return session;
  }

  async findAllActiveByUserId(userId: string): Promise<AuthSession[]> {
    return this.db
      .select()
      .from(authSessions)
      .where(and(eq(authSessions.userId, userId), eq(authSessions.status, SessionStatus.ACTIVE)));
  }

  async rotateRefreshToken(
    sessionId: string,
    refreshTokenHash: string,
    expiresAt: Date,
  ): Promise<void> {
    await this.db
      .update(authSessions)
      .set({
        refreshTokenHash,
        expiresAt,
        lastUsedAt: new Date(),
      })
      .where(eq(authSessions.id, sessionId));
  }

  async revoke(sessionId: string): Promise<void> {
    await this.db
      .update(authSessions)
      .set({
        status: SessionStatus.REVOKED,
      })
      .where(eq(authSessions.id, sessionId));
  }

  async deleteExpiredSessions(): Promise<number> {
    const deletedSessions = await this.db
      .delete(authSessions)
      .where(
        or(eq(authSessions.status, SessionStatus.EXPIRED), lt(authSessions.expiresAt, new Date())),
      )
      .returning({
        id: authSessions.id,
      });

    return deletedSessions.length;
  }
}
