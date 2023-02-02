import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';

import { DragDirective } from './dragDrop.directive';
import { ProfImageDialog } from './prof-image.dialog';
import { InputDialog } from './input.dialog';
import { ConfirmDialog } from './confirm.dialog';
import { ErrorDialog } from './error.dialog';
import { InternalErrorDialog } from './internal-error.dialog';

export declare const enum CloseStatus {
    OK = "ok",
    CANCEL = "cancel"
}

@NgModule({
    imports: [
        FormsModule,
        ReactiveFormsModule,
        CommonModule,
        MatDialogModule,
    ],
    declarations: [
        ProfImageDialog,
        InputDialog,
        ConfirmDialog,
        ErrorDialog,
        DragDirective,
        InternalErrorDialog
    ],
    exports: [
        ProfImageDialog,
        InputDialog,
        ConfirmDialog,
        ErrorDialog,
        InternalErrorDialog
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class CommonDialogModule { }

export { ProfImageDialog, ImageDataAndConfig } from './prof-image.dialog';
export { InputDialog, InputDataAndConfig } from './input.dialog';
export { ConfirmDialog } from './confirm.dialog';
export { ErrorDialog } from './error.dialog';
export { InternalErrorDialog } from './internal-error.dialog';

