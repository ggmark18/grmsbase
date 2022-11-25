import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { BaseExceptionFilter } from '@nestjs/core';
import { Request, Response } from 'express';
import { IMBaseError } from '.';

@Catch()
export class GSRsExceptionsFilter extends BaseExceptionFilter {
    catch(exception: unknown, host: ArgumentsHost) {
        console.log(exception);
        if( exception instanceof IMBaseError ) {
            const ctx = host.switchToHttp();
            const response = ctx.getResponse<Response>();
            const request = ctx.getRequest<Request>();
            const httpStatus =
                exception instanceof HttpException
                ? exception.getStatus()
                : HttpStatus.INTERNAL_SERVER_ERROR;
            
            response.status(httpStatus)
                .json({
                    statusCode: httpStatus,
                    timestamp: new Date().toISOString(),
                    path: request.url,
                    type: exception.type,
                    notice: exception.notice,
                    userinfo: exception.userinfo,
                    serial: exception.serial
                });
        } else {
            super.catch(exception, host);
        }
    }
}
