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
import { CommonErrorModule } from './common/errors';

import { AboutComponent } from './common/aboutIMB/about.component';
import { HeaderComponent } from './common/headerfooter/header.component';
import { HeaderMenuComponent } from './common/headerfooter/menu.component';
import { FooterComponent } from './common/headerfooter/footer.component';

import { SocketService } from './common/socket/service';
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
        CommonErrorModule,
        AppSharedModule,
        AppModules,
    ],
    declarations: [
        AppRoot,
        AboutComponent,
        HeaderComponent,
        HeaderMenuComponent,
        FooterComponent,
    ],
    providers: [
        SocketService,
        AppRootLayout,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    bootstrap: [AppRoot]
})
export class AppBase { }
