import { Title } from "@angular/platform-browser";
import { Injectable, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Observable, Subject } from 'rxjs';
import * as _ from 'lodash';

import { AuthUser } from '../api-dto/common/auth/dto.auth';

interface MenuItem {
    name: string
    icon: string
    title: string
    route: string
    order: number
    check: any
}

export class LayoutConfig {

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

    layoutConfig: LayoutConfig = null;
    $layoutConfig = new Subject<LayoutConfig>();
    
    constructor( private titleService:Title,
                 @Inject(DOCUMENT) private _document: HTMLDocument ) {
    }

    createConfig(): LayoutConfig {
        this.layoutConfig = new LayoutConfig();
        return this.layoutConfig;
    }

    getLayoutConfig() : Observable<LayoutConfig> {
        return this.$layoutConfig.asObservable();
    }

    hasFooter () { return this.footer; }

    subscribeLayoutConfig() {
        return this.$layoutConfig.next(this.layoutConfig);
    }

    setTitle( title ) {  this.titleService.setTitle(title); }

    setFooter( visible ) { this.footer = visible; }

    setAppFavicon(basepath: string, icon: string){
        this._document.getElementById('appFavicon').setAttribute('href', basepath+"/"+ icon);
    }

    clear() {
        this.footer = true;
        this.layoutConfig = null;
    }

    loginURL() : string {
        return this.layoutConfig?.loginURL;
    }

    logoutURL() : string {
        return this.layoutConfig?.logoutURL;
    }
}



