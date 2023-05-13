import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { BaseExceptionFilter } from '@nestjs/core';
import { Request, Response } from 'express';

import  config  from '@grms/config.base';
import { GRMSBaseError, errorNotice } from '.';

@Catch()
export class GSRsExceptionsFilter extends BaseExceptionFilter {
    catch(exception: unknown, host: ArgumentsHost) {
        if( exception instanceof GRMSBaseError ) {
            if(config().devmode) {
                console.log('GRMSBaseError', exception)
            } else {
                errorNotice(exception)
            }
            const ctx = host.switchToHttp()
            const response = ctx.getResponse<Response>()
            const request = ctx.getRequest<Request>()
            const httpStatus =
                exception instanceof HttpException
                ? exception.getStatus()
                : HttpStatus.INTERNAL_SERVER_ERROR
            response.status(httpStatus)
                .json({
                    statusCode: httpStatus,
                    timestamp: new Date().toISOString(),
                    path: request.url,
                    type: exception.type,
                    notice: exception.notice,
                    userinfo: exception.userinfo,
                    serial: exception.serial,
                    html: exception.html
                });
        } else {
            super.catch(exception, host);
        }
    }
}
