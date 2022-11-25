import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';

import { UserRole } from '../users/dto.users';

@Injectable()
export class JwtAdminGuard extends AuthGuard('jwt') {
    handleRequest(err: any, user: any) {
        if (err || !user || user.role != UserRole.ADMIN ) {
            throw new UnauthorizedException();
        }
        return user;
    }
}


