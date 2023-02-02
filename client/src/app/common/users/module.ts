import { NgModule, ModuleWithProviders, CUSTOM_ELEMENTS_SCHEMA, Optional, SkipSelf, Injectable } from '@angular/core';
import { RouterModule, Routes, CanActivate } from '@angular/router';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CookieModule } from 'ngx-cookie';
import { AppMaterialModule } from '@grms/app.material';
import { SocketService } from '@grms/common/base/socket.service';

import { AppRootLayout } from '@grms/app-root.layout';
import { AuthModule } from '@grms/common/auth';
import { UsersService } from '@grms/common/users/service';
import { UsersComponent } from '@grms/common/users/users.component';
import { UsersDialog } from '@grms/common/users/users.dialog';
import { AuthRole } from '@api-dto/common/auth/dto';
import { User } from '@api-dto/common/users/dto';

// Auth Elements
import { UsersLoginComponent,
         UsersLogoutComponent,
         UsersPasswordComponent,
         UsersAuthService,
         UsersAuthConfig,
         UsersAuthInterceptor,
         AuthGuardAdminUsers,
         AuthGuardUsers } from './auth';

const routes: Routes = [
    {
        path: 'users',
        children: [
            { path: 'login', component: UsersLoginComponent },
            { path: 'logout', component: UsersLogoutComponent, canActivate: [AuthGuardUsers] },
            { path: 'password', component: UsersPasswordComponent, canActivate: [AuthGuardUsers] },
            { path: 'users', component: UsersComponent, canActivate: [AuthGuardUsers]}
        ]
    }
];

export function setupLayoutForUsers(layout: AppRootLayout, user: User) {
    layout.clear();
    layout.setTitle("GRMS");
    let layoutConfig = layout.createConfig();
    layoutConfig.user = user;
    layoutConfig.homeRoot = UsersAuthService.loginRootURL;
    layoutConfig.loginURL = '/users/login';
    layoutConfig.logoutURL = '/users/logout';
    layoutConfig.changePasswordURL = '/users/password';
    layoutConfig.logo = "assets/images/logo.png";
    layoutConfig.addAdminMenu({name: 'Users', icon:'fas fa-users', title:'Users', route: 'users/users', order: 8,
                          check:(user)=>{return user.role == AuthRole.ADMIN;}});
}


@NgModule({
    declarations: [
        UsersComponent,
        UsersLoginComponent,
        UsersLogoutComponent,
        UsersPasswordComponent,
        UsersDialog,
    ],
    imports: [
        RouterModule.forRoot(routes),
        CookieModule.forRoot(),
        CommonModule,
        AppMaterialModule,
        FormsModule,
        ReactiveFormsModule,
        AuthModule
    ],
    providers: [
        SocketService,
        UsersService,
        UsersAuthService,
        UsersAuthConfig,
        AuthGuardUsers,
        AuthGuardAdminUsers,
        {
            provide: HTTP_INTERCEPTORS,
            useClass: UsersAuthInterceptor,
            multi: true,
        }
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class UsersModule {
    static setup(loginRootURL:string): ModuleWithProviders<UsersModule> {
        UsersAuthService.loginRootURL = loginRootURL;
        return {
            ngModule: UsersModule,
            providers: []
        };
    }
}


