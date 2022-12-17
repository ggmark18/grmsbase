import { Injectable, Component } from '@angular/core';
import { Location } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient, HttpEvent, HttpInterceptor, HttpHandler, HttpRequest} from '@angular/common/http';
import { UntypedFormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';

import { AuthServiceBase } from '@grms/common/auth/auth.service';
import { AuthConfig, AuthParam } from '@grms/common/auth/auth.config';
import { AuthGuardBase } from '@grms/common/auth/auth.guard-base';
import { AuthHeaderInterceptorBase } from '@grms/common/auth/header.interceptor';
import { LoginComponentBase } from '@grms/common/auth/login/login.component';
import { LogoutComponentBase } from '@grms/common/auth/login/logout.component';
import { PasswordComponentBase } from '@grms/common/auth/login/password.component';
import { SocketService } from '@grms/common/base/socket.service';
import { AppRootLayout } from '@grms/app-root.layout';
import { AuthRole } from '@api-dto/common/auth/dto.auth';
import { User } from '@api-dto/common/users/dto.users';
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
    
    canActivate() {
        let user = this.auth.getUser();
	    return super.canActivate() && (user && user.role == AuthRole.ADMIN ); 
    }
}

@Component({
    selector: 'users-login',
    templateUrl: '../../common/auth/login/login.component.html',
    styleUrls: ['../../common/auth/login/login.component.scss']
})
export class UsersLoginComponent extends LoginComponentBase {
    constructor( protected auth: UsersAuthService,
	             protected formBuilder: UntypedFormBuilder,
                 protected route: ActivatedRoute,
	             protected dialog: MatDialog,
	             protected router: Router,
                 protected location: Location){
        super(formBuilder, route, dialog, router, location);
        this.authService = auth;
        this._title = 'GRMS Base';
        this._icon = 'app/app-modules/assets/GSRs.png';
    }
}

@Component({
    selector: 'users-logout',
    template: '',
    styles: ['']
})
export class UsersLogoutComponent extends LogoutComponentBase {
    constructor(protected auth: UsersAuthService,
                protected layout: AppRootLayout,
                protected router: Router) {
        super(layout,router);
        this.authService = auth;
    }
}

@Component({
    selector: 'users-password',
    templateUrl: '../../common/auth/login/password.component.html',
    styleUrls: ['../../common/auth/login/login.component.scss']
})
export class UsersPasswordComponent extends PasswordComponentBase {
    constructor( protected auth: UsersAuthService,
                 protected layout: AppRootLayout, 
	             protected formBuilder: UntypedFormBuilder,
                 protected route: ActivatedRoute,
	             protected dialog: MatDialog,
	             protected router: Router){
        super(layout, formBuilder, route, dialog, router);
        this.authService = auth;
    }
}




