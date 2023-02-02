import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';

import { AuthRole } from '../../auth/dto';

@Injectable()
export class JwtAdminGuard extends AuthGuard('jwt') {
    handleRequest(err: any, user: any) {
        if (err || !user || user.role != AuthRole.ADMIN ) {
            throw new UnauthorizedException();
        }
        return user;
    }
}


