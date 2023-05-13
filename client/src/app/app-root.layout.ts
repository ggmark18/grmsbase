import { Title } from "@angular/platform-browser"
import { Injectable, Inject } from '@angular/core'
import { DOCUMENT } from '@angular/common'
import { Observable, Subject } from 'rxjs'
import * as _ from 'lodash'

import { AuthUser, AuthRole } from '../api-dto/common/auth/dto'

export declare const enum MenuType {
    TOP,
    BOTTOM,
    BOTH
}

export function noCheck(): Promise<boolean> {
    return new Promise((resolve, reject) => {
        resolve(true)
    })
}
export function adminCheck(user: AuthUser): Promise<boolean> {
    return new Promise((resolve, reject) => {
        resolve(user.role === AuthRole.ADMIN)
    })
}

export interface MenuItem {
    name: string
    icon: string
    title: string
    route?: string
    order: number
    check: any
    badge?: { send:string, recieve:string, data: any, trigger?: string }
    list?: any
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
    mobileButtons = [];

    addMenu( menu: MenuItem ) {
        this.menus.push(menu);
    }
    addAdminMenu( menu: MenuItem ) {
        this.adminMenus.push(menu);
    }
    addSettingMenu( menu: MenuItem ) {
        this.settingMenus.push(menu);
    }
    addButtons( menu: MenuItem ) {
        this.mobileButtons.push(menu);
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

    updateLogo() {
        if( this.layoutConfig ) {
            let logo = this.layoutConfig.logo;
            var uid = (new Date().getTime()).toString(36);
            logo += `?${uid}`;
            this.layoutConfig.logo = logo;
        }
    }

    get logo() : string {
        return this.layoutConfig?.logo;
    }
}



