import { FastifyRequest } from 'fastify';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import type { AuthSession } from '@db/schema';

export const CurrentSession = createParamDecorator(
    (_: unknown, context: ExecutionContext): AuthSession => {
        const request = context.switchToHttp().getRequest<FastifyRequest>();

        return request.session;
    },
);