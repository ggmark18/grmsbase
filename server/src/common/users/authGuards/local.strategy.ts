import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { validatePassword } from '@grms/common/auth/auth.function';
import { calcDays } from '@grms/common/tools/formats/date';
import { LoginError } from '@grms/common/auth/dto.auth';

import { UsersService } from '../users.service';


class ExpiredException extends HttpException {
    constructor(
        objectOrError?: string | object | any,
        description = LoginError.EXPIRED,
    ) {
        super(
            HttpException.createBody(
                objectOrError,
                description,
                HttpStatus.UNAUTHORIZED,
            ),
            HttpStatus.UNAUTHORIZED,
        );
    }
}
class UnInitializeException extends HttpException {
    constructor(
        objectOrError?: string | object | any,
        description = LoginError.UNINITIAL,
    ) {
        super(
            HttpException.createBody(
                objectOrError,
                description,
                HttpStatus.UNAUTHORIZED,
            ),
            HttpStatus.UNAUTHORIZED,
        );
    }
}

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(private usersService: UsersService,
                private config: ConfigService ) {
        super({ usernameField: 'loginid' });
    }

    async validate(loginid: string, password: string): Promise<any> {
        const user = await this.usersService.findByLoginID(loginid);
        if( validatePassword(user.auth, password) ) {
            let lastUpdated = user.auth.passwordUpdated;
            if ( !lastUpdated ) {
                throw new UnInitializeException();
            }
            let today = new Date();
            let days = calcDays(lastUpdated, today);
            let duration = this.config.get('passwordDurationDays');
            if( days > duration ) {
                throw new ExpiredException();
            }
        } else {
            throw new UnauthorizedException();
        }
        return user;
    }
}

