import { Title } from "@angular/platform-browser";
import { Injectable, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Observable, Subject } from 'rxjs';
import * as _ from 'lodash';

import { AuthUser } from '../api-dto/common/users/dto.users';

interface MenuItem {
    name: string
    icon: string
    title: string
    route: string
    order: number
    check: any
}

export class HeaderLayoutConfig {

    user: AuthUser = undefined;
    
    homeRoot = undefined;
    loginURL = '/login';
    logoutURL = '/logout';
    changePasswordURL = '/password';
    logo = "assets/images/logo.png";
    rootPath = '';
    menus = [];
    adminMenus = [];
    settingMenus = [];

    addMenu( menu: MenuItem ) {
        this.menus.push(menu);
    }
    addAdminMenu( menu: MenuItem ) {
        this.adminMenus.push(menu);
    }
    addSettingMenu( menu: MenuItem ) {
        this.settingMenus.push(menu);
    }
}

@Injectable()
export class AppRootLayout {

    footer = true;

    headerConfig: HeaderLayoutConfig = null;
    $headerConfig = new Subject<HeaderLayoutConfig>();
    
    constructor( private titleService:Title,
                 @Inject(DOCUMENT) private _document: HTMLDocument ) {
    }

    createHeader(): HeaderLayoutConfig {
        this.headerConfig = new HeaderLayoutConfig();
        return this.headerConfig;
    }

    getHeaderLayoutConfig() : Observable<HeaderLayoutConfig> {
        return this.$headerConfig.asObservable();
    }

    hasFooter () { return this.footer; }

    subscribeHeaderLayoutConfig(user: AuthUser) {
        if( this.headerConfig )  this.headerConfig.user = user;
        return this.$headerConfig.next(this.headerConfig);
    }

    setTitle( title ) {  this.titleService.setTitle(title); }

    setFooter( visible ) { this.footer = visible; }

    setAppFavicon(basepath: string, icon: string){
        this._document.getElementById('appFavicon').setAttribute('href', basepath+"/"+ icon);
    }

    clear() {
        this.footer = true;
        this.headerConfig = null;
    }

    loginURL() : string {
        return this.headerConfig?.loginURL;
    }

    logoutURL() : string {
        return this.headerConfig?.logoutURL;
    }
}



