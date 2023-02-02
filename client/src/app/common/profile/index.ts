import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule } from '@angular/material/dialog';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { DragDropModule } from '@angular/cdk/drag-drop';

import { ProfileForm } from './profile.form';
import { NameForm } from './name.form';
import { AttributeEditDialog } from './attribute-edit.dialog';
import { AttributeOrderDialog } from './attribute-order.dialog';

@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatDialogModule,
        MatSelectModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatCheckboxModule,
        DragDropModule,
    ],
    declarations: [
        ProfileForm,
        NameForm,
        AttributeEditDialog,
        AttributeOrderDialog
    ],
    exports: [
        ProfileForm,
        NameForm,
        AttributeEditDialog,
        AttributeOrderDialog
    ],
    providers: [
	    {provide: MAT_DATE_LOCALE, useValue: 'ja-JP'}
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ProfileModule { }

export { NameForm } from './name.form';
export { ProfileForm } from './profile.form';
export { AttributeEditDialog } from './attribute-edit.dialog';
export { AttributeOrderDialog } from './attribute-order.dialog';
