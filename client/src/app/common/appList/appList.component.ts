import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

interface AppInfo {
    name: string
    route: string
    logo: string
    explain: string
    version: string
}

@Component({
    selector: 'app-list',
    templateUrl: './appList.component.html',
    styleUrls: ['./appList.component.scss']
})
export class AppListComponent {
    static apps : AppInfo[] = [];
    constructor(private router: Router) {}

    static addAppInfo( app: AppInfo ) {
        AppListComponent.apps.push(app);
    }

    get apps() {
        return AppListComponent.apps;
    }
}
