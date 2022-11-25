import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AboutComponent } from './common/aboutIMB/about.component';
import { AppListComponent } from './common/appList/appList.component';

@NgModule({
    declarations: [
        AboutComponent,
        AppListComponent,
    ],
    imports: [
        CommonModule,
        RouterModule,
    ],
    exports: [
        AboutComponent,
        AppListComponent,
    ]
})
export class AppSharedModule { }
