import { Component, Inject, Input, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { UntypedFormGroup, UntypedFormControl, Validators, UntypedFormBuilder, ValidationErrors } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { AppRootLayout } from '@grms/app-root.layout';

import { AuthServiceBase} from '../auth.service';
import { PasswordChangeForm } from './password.form';


function PasswordMatchValidator(control: UntypedFormControl): ValidationErrors {
    let password = control.root.get('password');
    return password && control.value !== password.value ? {
	    passwordMatch: true
	}: null;
}

@Component({
    selector: 'grms-password-change',
    templateUrl: './password.component.html',
    styleUrls: ['./login.component.scss']
})
export class PasswordComponentBase {
    @Input() set auth( service ) {
        this.authService = service;
    }
    @ViewChild(PasswordChangeForm) passwordForm: PasswordChangeForm;

    static selector(authServiceString) {
        return `<grms-password-change [auth]='${authServiceString}'></grms-password-change>`;
    }
    
    authService: AuthServiceBase;
    
    constructor(protected layout: AppRootLayout, 
		        protected dialog: MatDialog,
		        protected router: Router) {
    }

    change() : void {
        this.authService.changePassword(this.passwordForm?.value).subscribe( ok => {
            this.router.navigate([this.layout.logoutURL()]);
        })
    }

    get changeButtonClass() {
        let clname =  "btn-outline-secondary";
        if( this.passwordForm?.isValid ) {
            clname = "btn-login";
        }
        return clname;
    }
}




