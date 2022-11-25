import { NgModule,CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes } from '@angular/router';

import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';

import { AppRoot } from './app-root.component';
import { AppRootLayout } from './app-root.layout';
import { AppMaterialModule } from './app.material';


import { AuthService } from './common/auth/auth.service';
import { DefaultAuthConfig } from './common/auth/auth.config';

import { AuthHeaderInterceptor } from './common/auth/header.interceptor';
import { CatchErrorInterceptor } from './common/base/http-error.interceptor';

import { HeaderComponent } from './common/headerfooter/header.component';
import { FooterComponent } from './common/headerfooter/footer.component';

import { ConfirmDialog } from './common/dialog/confirm.dialog';
import { ErrorDialog } from './common/dialog/error.dialog';
import { InternalErrorDialog } from './common/dialog/internal-error.dialog';
import { SocketService } from './common/base/socket.service';

import { UsersService } from './common/users/users.service';
import { UsersComponent } from './common/users/users.component';
import { UsersDialog } from './common/users/users.dialog';
import { OnlyAdminUsersGuard } from './common/users/admin-user-guard';
import { AppSharedModule } from './app.share';
import { AppModules } from './app-modules/app.modules';

import { AuthGuardLogin } from './common/auth/auth-guard-login.service';
import { AuthGuardAdmin } from './common/auth/auth-guard-admin.service';
import { AboutComponent } from './common/aboutIMB/about.component';
import { LoginComponentBase,LoginComponent } from './common/auth/login/login.component';
import { LogoutComponent } from './common/auth/login/logout.component';
import { PasswordComponent } from './common/auth/login/password.component';

const routes: Routes = [
    { path: 'about', component: AboutComponent },
    { path: 'login', component: LoginComponent },
    { path: 'logout', component: LogoutComponent, canActivate: [AuthGuardLogin] },
    { path: 'password', component: PasswordComponent, canActivate: [AuthGuardLogin] },
    { path: 'users', component: UsersComponent, canActivate: [AuthGuardLogin]}
];


@NgModule({
    imports: [
        RouterModule.forRoot(routes),
        BrowserModule,
        BrowserAnimationsModule,
        HttpClientModule,
        FormsModule,
        ReactiveFormsModule,
        AppMaterialModule,
        AppModules,
        AppSharedModule,
        BsDropdownModule.forRoot()
    ],
    declarations: [
        AppRoot,
        HeaderComponent,
        FooterComponent,
        LoginComponentBase,
        LoginComponent,
        LogoutComponent,
        PasswordComponent,
        ConfirmDialog,
        UsersComponent,
        UsersDialog,
        ErrorDialog,
        InternalErrorDialog,
    ],
    providers: [
        AuthGuardLogin,
        AuthGuardAdmin,
        AppRootLayout,
        AuthService,
        DefaultAuthConfig,
        {
            provide: HTTP_INTERCEPTORS,
            useClass: AuthHeaderInterceptor,
            multi: true,
        }, {
            provide: HTTP_INTERCEPTORS,
            useClass: CatchErrorInterceptor,
            multi: true,
        },
        UsersService,
        SocketService
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    bootstrap: [AppRoot]
})
export class AppBase { }
