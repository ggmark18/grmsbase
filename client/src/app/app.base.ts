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
import { ProfileForm } from './common/profile';
import { CatchErrorInterceptor } from './common/base/http-error.interceptor';

import { AboutComponent } from './common/aboutIMB/about.component';
import { HeaderComponent } from './common/headerfooter/header.component';
import { FooterComponent } from './common/headerfooter/footer.component';

import { LoginComponentBase } from './common/auth/login/login.component';
import { LogoutComponentBase } from './common/auth/login/logout.component';
import { PasswordComponentBase } from './common/auth/login/password.component';
import { ConfirmDialog } from './common/dialog/confirm.dialog';
import { ErrorDialog } from './common/dialog/error.dialog';
import { InternalErrorDialog } from './common/dialog/internal-error.dialog';
import { SocketService } from './common/base/socket.service';
import { AppSharedModule } from './app.share';
import { AppModules } from './app-modules/app.modules';

const routes: Routes = [
    { path: 'about', component: AboutComponent },
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
        AboutComponent,
        HeaderComponent,
        FooterComponent,
        ConfirmDialog,
        ErrorDialog,
        InternalErrorDialog,
        LoginComponentBase,
        LogoutComponentBase,
        PasswordComponentBase,
        ProfileForm,
    ],
    providers: [
        SocketService,
        AppRootLayout,
        { 
            provide: HTTP_INTERCEPTORS,
            useClass: CatchErrorInterceptor,
            multi: true,
        },
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    bootstrap: [AppRoot]
})
export class AppBase { }
