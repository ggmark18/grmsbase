import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppRootLayout } from '@grms/app-root.layout';
import { AuthServiceBase } from '../auth.service';

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
        this.layout.clear();
        this.layout.subscribeLayoutConfig();
        this.router.navigate([loginURL]);
    }
}

