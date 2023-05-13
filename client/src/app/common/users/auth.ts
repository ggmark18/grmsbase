import { Injectable, Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient, HttpEvent, HttpInterceptor, HttpHandler, HttpRequest} from '@angular/common/http';
import { UntypedFormBuilder } from '@angular/forms';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { Observable } from 'rxjs';

import { AuthServiceBase } from '@grms/common/auth/auth.service';
import { AuthConfig, AuthParam } from '@grms/common/auth/auth.config';
import { AuthGuardBase } from '@grms/common/auth/auth.guard-base';
import { AuthHeaderInterceptorBase } from '@grms/common/auth/header.interceptor';
import { LoginComponentBase, HeaderParts } from '@grms/common/auth/login/login.component';
import { PasswordComponentBase } from '@grms/common/auth';
import { SocketService } from '@grms/common/socket/service';
import { AppRootLayout } from '@grms/app-root.layout';
import { AuthRole } from '@api-dto/common/auth/dto';
import { User } from '@api-dto/common/users/dto';
import { setupLayoutForUsers } from './module';

@Injectable()
export class UsersAuthConfig extends AuthConfig {
    constructor(){
        super({
            tokenKey: 'GRMSBaseTokenKey',
            signupCheckAPI: '/api/users/signupCheck',
            loginAPI: '/api/users/login',
            changePasswordAPI: '/api/users/password',
            typeCheckAPI: '/api/users/checkType',
            mailloginAPI: '/api/users/maillogin',
            loginUserAPI: '/api/users/me'
        });
    }
}

@Injectable()
export class UsersAuthService extends AuthServiceBase {
    static loginRootURL;
    user: User;
    constructor(protected http : HttpClient,
                protected socket: SocketService,
                protected authConfig: UsersAuthConfig ) {
        super( http, socket, authConfig );
    }
    setUser(user) : void{
        this.user = user;
        super.setUser(user);
    }
    isLoggedIn() {
        return this.user != null;
    }
    getUser() {
        return this.user;
    }
    loginRootURL() {
        return UsersAuthService.loginRootURL;
    }
}

export class UsersAuthInterceptor extends AuthHeaderInterceptorBase {
    getTokenValue() {
	    const config = new UsersAuthConfig();
	    return config.token;
    }
}

@Injectable()
export class AuthGuardUsers extends AuthGuardBase {

    async setupLayout() {
        let user = this.auth.getUser();
        setupLayoutForUsers(this.layout, user);
    }
    
    constructor(protected auth: UsersAuthService,
                protected layout: AppRootLayout, 
                protected router: Router) {
        super(layout, router);
        this.authService = auth;
    }
}

@Injectable()
export class AuthGuardAdminUsers extends AuthGuardUsers {

    constructor(protected auth: UsersAuthService,
                protected layout: AppRootLayout, 
                protected router: Router) {
        super(auth, layout, router);
    }
    
    async canActivate() {
        let login = await super.canActivate()
        if ( login ) {
 	        const user = this.auth.getUser();
            return (user.role == AuthRole.ADMIN)
        } else {
            return false;
        }
    }
}

@Component({
    selector: 'users-login',
    templateUrl: '../../common/auth/login/login.header.html',
    styleUrls: ['../../common/auth/login/login.component.scss']
})
export class UsersLoginComponent {
    parts: HeaderParts = {
        title: 'GRMS Base',
        icon: 'app/app-modules/assets/GSRs.png'
    }
    constructor( protected auth: UsersAuthService ) {}
}

@Component({
    selector: 'users-logout',
    template: '',
})
export class UsersLogoutComponent implements OnInit {
    constructor(protected auth: UsersAuthService,
                protected layout: AppRootLayout,
                protected router: Router) {}
    ngOnInit() { this.auth.logout(this.layout, this.router); }
}

@Component({
    selector: 'users-password',
    template: PasswordComponentBase.selector('auth')
})
export class UsersPasswordComponent {
    constructor( protected auth: UsersAuthService ) {}

}




