import { NgModule } from '@angular/core';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';

import { ErrorDialog } from './error.dialog';
import { CatchErrorInterceptor } from './http-error.interceptor';

@NgModule({
    imports: [
        CommonModule,
        MatDialogModule
    ],
    declarations: [
        ErrorDialog,
    ],
    providers: [
        { 
            provide: HTTP_INTERCEPTORS,
            useClass: CatchErrorInterceptor,
            multi: true,
        },
    ],
})
export class CommonErrorModule { }


