import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

import { AppRootLayout } from '@grms/app-root.layout';
import { AuthServiceBase } from './auth.service';

export class AuthGuardBase implements CanActivate {

    protected authService: AuthServiceBase;

    async setupLayout() {
        this.layout.createConfig();
    }

    constructor(protected layout: AppRootLayout, 
                protected router: Router) {}

    canActivate() {
        let login = this.authService?.isLoggedIn();
        if( !login && this.authService?.hasToken() ) {
            this.authService?.syncMe().then( () => {
                this.setupLayout().then( () => this.layout.subscribeLayoutConfig() );
            });
            return true;
        }
        if( login ) {
            this.setupLayout().then( () => this.layout.subscribeLayoutConfig() );
        } else {
            this.layout.clear();
            this.layout.subscribeLayoutConfig();
        } 
	    return login;
    }
}
