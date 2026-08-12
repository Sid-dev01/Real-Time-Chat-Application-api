import { FastifyRequest } from 'fastify';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import type { CurrentUserData} from '@common/interfaces';

export const CurrentUser = createParamDecorator(
  (_: unknown, context: ExecutionContext): CurrentUserData => {
    const request = context.switchToHttp().getRequest<FastifyRequest>();

    return request.user;
  },
);