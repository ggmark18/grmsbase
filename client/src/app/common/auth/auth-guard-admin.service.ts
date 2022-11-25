import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { UserRole } from '@api-dto/common/users/dto.users';

@Injectable()
export class AuthGuardAdmin implements CanActivate {

  constructor(public router: Router) {}

    canActivate() {
	    const user = (<any>window).user;
	    return (user && user.role == UserRole.ADMIN ); 
    }
}
