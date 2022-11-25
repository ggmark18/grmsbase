import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppRootLayout } from '@grms/app-root.layout';
import { AuthService, AuthServiceBase } from '../auth.service';

@Component({
    selector: 'app-logout-bae',
    template: '',
})
export class LogoutComponentBase implements OnInit {

    protected authService: AuthServiceBase;

    constructor(protected layout: AppRootLayout,
                protected router: Router) {}

    ngOnInit() {
        let loginURL = this.layout.loginURL();
        this.authService.logout();
        console.log(loginURL);
        this.layout.clear();
        this.layout.subscribeHeaderLayoutConfig(null);
        this.router.navigate([loginURL]);
    }
}

@Component({
    selector: 'app-logout',
    template: '',
})
export class LogoutComponent extends LogoutComponentBase {
    constructor(protected auth: AuthService,
                protected layout: AppRootLayout,
                protected router: Router) {
        super(layout,router);
        this.authService = auth;
    }
}
