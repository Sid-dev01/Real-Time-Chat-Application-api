import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
} from '@nestjs/common';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { SuccessResponse } from '@common/responses';
import { ApiResponse } from '@common/interfaces/api-response.interface';

@Injectable()
export class ResponseInterceptor<T>
    implements NestInterceptor<SuccessResponse<T>, ApiResponse<T>>
{
    intercept(
        _context: ExecutionContext,
        next: CallHandler<SuccessResponse<T>>,
    ): Observable<ApiResponse<T>> {
        return next.handle().pipe(
            map((response) => ({
                success: true,
                message: response.message,
                data: response.data,
            })),
        );
    }
}