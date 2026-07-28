import {
    ArgumentsHost,
    Catch,
    ExceptionFilter,
    HttpException,
    HttpStatus,
} from '@nestjs/common';
import { FastifyReply, FastifyRequest } from 'fastify';


@Catch()
export class AllExceptionFilter implements ExceptionFilter{
    catch(exception: unknown, host: ArgumentsHost) : void {
        const context = host.switchToHttp();

        const request = context.getRequest<FastifyRequest>();
        const response = context.getResponse<FastifyReply>();

        const status = 
            exception instanceof HttpException
                ? exception.getStatus()
                : HttpStatus.INTERNAL_SERVER_ERROR;

        const exceptionResponse = 
            exception instanceof HttpException
                ? exception.getResponse()
                : 'Internal Server Error';

        const message = 
            typeof exceptionResponse === 'object' &&
            exceptionResponse !== null &&
            'message' in exceptionResponse
                ? exceptionResponse.message
                : exceptionResponse;

        response.status(status).send({
            success: false,
            statusCode: status,
            timestamp: new Date().toISOString(),
            path: request.url,
            method: request.method,
            message,
        })
    }
}