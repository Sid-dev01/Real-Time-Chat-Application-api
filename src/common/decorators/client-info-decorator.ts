import { FastifyRequest } from 'fastify';
import { ClientInfo } from '@common/interfaces';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';


export const Client = createParamDecorator(
    (_: unknown, context: ExecutionContext): ClientInfo => {
        const request = context.switchToHttp().getRequest<FastifyRequest>();

        return {
            ipAddress: request.ip,
            userAgent: request.headers['user-agent'] ?? "Unknown",
        }
    }
)