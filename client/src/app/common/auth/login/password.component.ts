import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { UntypedFormGroup, UntypedFormControl, Validators, UntypedFormBuilder, ValidationErrors } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { AppRootLayout } from '@grms/app-root.layout';
import { AuthServiceBase} from '../auth.service';
import { ErrorDialog } from '@grms/common/dialog/error.dialog';

function PasswordMatchValidator(control: UntypedFormControl): ValidationErrors {
    let password = control.root.get('password');
    return password && control.value !== password.value ? {
	    passwordMatch: true
	}: null;
}

@Component({
    selector: 'app-password-change',
    templateUrl: './password.component.html',
    styleUrls: ['./login.component.scss']
})
export class PasswordComponentBase implements OnInit, OnDestroy {
    authService: AuthServiceBase;
    
    passwordForm: UntypedFormGroup;
    password = new UntypedFormControl('', [Validators.required,
                                    Validators.minLength(6)]);
    password2 = new UntypedFormControl('', [Validators.required,
                                     PasswordMatchValidator] );

    showpassword = false;
    showpassword2 = false;
    
    constructor(protected layout: AppRootLayout, 
		        protected formBuilder: UntypedFormBuilder,
                protected route: ActivatedRoute,
		        protected dialog: MatDialog,
		        protected router: Router) {
        this.passwordForm = this.formBuilder.group({
	        password: this.password,
            password2: this.password2
	    });
    }

    ngOnInit() {
    }

    ngOnDestroy() {
        this.showpassword = false;
        this.showpassword2 = false;
    }

    change() : void {
        this.authService.changePassword(this.password.value).subscribe( ok => {
            this.router.navigate([this.layout.logoutURL()]);
        }, error => {
            this.dialog.open(ErrorDialog, {
				data: error,
			});
        });
    }

    get changeButtonClass() {
        let clname =  "btn-outline-secondary";
        if( this.password.valid && this.password2.valid ) {
            clname = "btn-login";
        }
        return clname;
    }
    get passwordFieldType() {
        return (this.showpassword)?"test":"password";
    }

    get password2FieldType() {
        return (this.showpassword2)?"test":"password";
    }

    get passwordEyes() {
        return (this.showpassword)?"fas fa-eye":"fas fa-eye-slash";
    }
    
    get password2Eyes() {
        return (this.showpassword2)?"fas fa-eye":"fas fa-eye-slash";
    }

}




