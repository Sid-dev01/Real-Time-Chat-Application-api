import 'fastify';
import type { AuthSession } from '@db/schema';
import type { CurrentUser } from '@common/interfaces';

declare module 'fastify' {
    interface FastifyRequest {
        user: CurrentUser;
        session: AuthSession;
    }
}