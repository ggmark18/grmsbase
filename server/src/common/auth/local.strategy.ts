import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { serviceName, LoginError } from './dto.auth';
import { calcDays } from '../tools/formats/date';

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
    constructor(private authService: AuthService,
                private usersService: UsersService,
                private config: ConfigService ) {
        super({ usernameField: 'userid' });
    }

    async validate(userid: string, password: string): Promise<any> {
        const user = await this.usersService.findAuthUser(userid, serviceName);
        if( this.authService.validatePassword(user, password) ) {
            let lastUpdated = user.passwordUpdated;
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

