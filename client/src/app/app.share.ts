import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { AppListComponent } from './common/appList/appList.component';

@NgModule({
    declarations: [
        AppListComponent,
    ],
    imports: [
        CommonModule,
        RouterModule,
    ],
    exports: [
        AppListComponent,
    ]
})
export class AppSharedModule { }
