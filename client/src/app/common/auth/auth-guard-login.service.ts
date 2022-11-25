import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

import { AppRootLayout } from '@grms/app-root.layout';
import { AuthService, AuthServiceBase } from './auth.service';

export class AuthGuardBase implements CanActivate {

    protected authService: AuthServiceBase;

    setupLayout() {
        this.layout.createHeader();
    }

    constructor(protected layout: AppRootLayout, 
                protected router: Router) {}

    canActivate() {
        let login = this.authService?.isLoggedIn();
        if( !login && this.authService?.hasToken() ) {
            this.authService?.syncMe();
            login = true;
        }
        if( login ) {
            this.setupLayout();
        } else {
            this.layout.clear();
        } 
        this.layout.subscribeHeaderLayoutConfig(this.authService?.getUser());
	    return login;
    }
}

@Injectable()
export class AuthGuardLogin extends AuthGuardBase {
    constructor(protected auth: AuthService,
                protected layout: AppRootLayout, 
                protected router: Router) {
        super(layout, router);
        this.authService = auth;
    }
}
