import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';

import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { first } from 'rxjs/operators';
import { AuthUser } from '@api-dto/common/auth/dto';
import { AppRootLayout, LayoutConfig } from '@grms/app-root.layout';
import { isAdmin } from '../auth/auth.service';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./headerfooter.component.scss']
})
export class HeaderComponent {
    
    layoutConfig$: Observable<LayoutConfig>;

    constructor( private layout: AppRootLayout,
	             private router: Router,
	             private dialog: MatDialog,
                 public title: Title ) {
        this.layoutConfig$ = this.layout.getLayoutConfig();
    }
    
    isAdmin(user: AuthUser) {
        return isAdmin(user);
    }

    userName(user) {
        let displayName = "";
        displayName += $localize`Hello! `;
        displayName += user?.name;
        displayName += $localize` `;
        return displayName;
    }
    checkUser(menu) {
        return true;
    }

    get passwordSubMenu() {
        return $localize`Change Password`;
    }

    get userSettingSubMenu() {
        return $localize`Profile Setting`;
    }
}
