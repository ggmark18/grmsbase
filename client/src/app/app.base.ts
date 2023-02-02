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
import { CommonDialogModule } from './common/dialog';
import { CatchErrorInterceptor } from './common/base/http-error.interceptor';

import { AboutComponent } from './common/aboutIMB/about.component';
import { HeaderComponent } from './common/headerfooter/header.component';
import { FooterComponent } from './common/headerfooter/footer.component';

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
        BsDropdownModule.forRoot(),
        CommonDialogModule,
        AppSharedModule,
        AppModules,
    ],
    declarations: [
        AppRoot,
        AboutComponent,
        HeaderComponent,
        FooterComponent,
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
