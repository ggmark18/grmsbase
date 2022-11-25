import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { first } from 'rxjs/operators';

import { AuthUser, UserStatus, UserRole } from '../../../api-dto/common/users/dto.users';
import { AppRootLayout, HeaderLayoutConfig } from '../../app-root.layout';
import { AuthService } from '../auth/auth.service';
import { ErrorDialog } from '../dialog/error.dialog';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./headerfooter.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
    
    headerConfig$: Observable<HeaderLayoutConfig>;

    constructor( private layout: AppRootLayout,
	             private router: Router,
	             private dialog: MatDialog,
                 public title: Title ) {
        this.headerConfig$ = this.layout.getHeaderLayoutConfig();
    }
    
    ngOnInit() {
    }
    
    ngOnDestroy() {
    }

    isAdmin(user) {
        return AuthService.isAdmin(user);
    }

    userName(user) {
        let displayName = "";
        displayName += $localize`Hello! `;
        displayName += user.name;
        displayName += $localize` `;
        return displayName;
    }

    get passwordSubMenu() {
        return $localize`Change Password`;
    }

    get userSettingSubMenu() {
        return $localize`Profile Setting`;
    }
}
