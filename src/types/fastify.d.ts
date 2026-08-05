import 'fastify';
import type { CurrentUser } from '@common/interfaces';

declare module 'fastify' {
    interface FastifyRequest {
        user: CurrentUser;
    }
}