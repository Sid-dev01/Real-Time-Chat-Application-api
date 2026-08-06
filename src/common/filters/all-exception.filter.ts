import {
    ArgumentsHost,
    Catch,
    ExceptionFilter,
    HttpException,
    HttpStatus,
    Logger
} from '@nestjs/common';
import { FastifyReply } from 'fastify';


@Catch()
export class AllExceptionFilter implements ExceptionFilter{

    private readonly logger = new Logger(AllExceptionFilter.name);

    catch(exception: unknown, host: ArgumentsHost) : void {

        if(exception instanceof Error) {
            this.logger.error(
                exception.message,
                exception.stack,
            );
        }else {
            this.logger.error(String(exception));
        }

        const context = host.switchToHttp();

        const response = context.getResponse<FastifyReply>();

        const status = 
            exception instanceof HttpException
                ? exception.getStatus()
                : HttpStatus.INTERNAL_SERVER_ERROR;

        const exceptionResponse = 
            exception instanceof HttpException
                ? exception.getResponse()
                : 'Internal Server Error';

        let message = 'Internal Server Error';
        let errors: string[] | null = null;

        if (typeof exceptionResponse === 'string') {
            message = exceptionResponse;
        }else if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
            const responseBody = exceptionResponse as {
                message?: string | string[];
            };

            if(Array.isArray(responseBody.message)) {
                message = 'Validation failed';
                errors = responseBody.message;
            }else if (responseBody.message) {
                message = responseBody.message;
            }
        }

        response.status(status).send({
            success: false,
            message,
            errors,
        })
    }
}