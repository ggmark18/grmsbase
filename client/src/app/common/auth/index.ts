import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
/*
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { BrowserModule } from '@angular/platform-browser';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule } from '@angular/material/dialog';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
*/
import { LoginComponentBase } from './login/login.component';
import { PasswordComponentBase } from './login/password.component';
import { PasswordChangeForm } from './login/password.form';
import { SignupComponentBase } from './login/signup.component';
import { SecurePipe } from './header.interceptor';

@NgModule({
    imports: [
        ReactiveFormsModule,
        RouterModule
    ],
    declarations: [
        LoginComponentBase,
        SignupComponentBase,
        PasswordComponentBase,
        PasswordChangeForm,
        SecurePipe
    ],
    exports: [
        LoginComponentBase,
        SignupComponentBase,
        PasswordComponentBase,
        PasswordChangeForm,
        SecurePipe
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AuthModule { }

export { LoginComponentBase, HeaderParts } from './login/login.component';
export { SignupComponentBase } from './login/signup.component';
export { PasswordComponentBase } from './login/password.component';
