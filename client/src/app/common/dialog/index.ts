import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { MatDialogModule } from '@angular/material/dialog'

import { DragDirective } from './dragDrop.directive'
import { ProfImageDialog } from './prof-image.dialog'
import { InputDialog } from './input.dialog'
import { ConfirmDialog } from './confirm.dialog'
import { FileUploadComponent, FileUploadConfig } from './FileUpload.component'
import { InternalErrorDialog } from './internal-error.dialog'
import { AuthModule } from '../auth'

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
        AuthModule
    ],
    declarations: [
        ProfImageDialog,
        InputDialog,
        ConfirmDialog,
        DragDirective,
        InternalErrorDialog,
        FileUploadComponent,
    ],
    exports: [
        ProfImageDialog,
        InputDialog,
        ConfirmDialog,
        InternalErrorDialog,
        FileUploadComponent,

    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class CommonDialogModule { }

export { ProfImageDialog, ImageDataAndConfig } from './prof-image.dialog'
export { InputDialog, InputDataAndConfig } from './input.dialog'
export { ConfirmDialog } from './confirm.dialog'
export { InternalErrorDialog } from './internal-error.dialog'
export { FileUploadComponent, FileUploadConfig } from './FileUpload.component'

