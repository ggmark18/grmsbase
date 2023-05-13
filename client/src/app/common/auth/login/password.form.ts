import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { UntypedFormGroup, UntypedFormControl, Validators, UntypedFormBuilder, ValidationErrors } from '@angular/forms';

import { AppRootLayout } from '@grms/app-root.layout';
import { AuthServiceBase} from '../auth.service';

function PasswordMatchValidator(control: UntypedFormControl): ValidationErrors {
    let password = control.root.get('password');
    return password && control.value !== password.value ? {
	    passwordMatch: true
	}: null;
}

@Component({
    selector: 'grms-password-change-form',
    templateUrl: './password.form.html',
    styleUrls: ['./login.component.scss']
})
export class PasswordChangeForm implements OnInit, OnDestroy {
    
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

    get value() {
        return this.password.value;
    }

    get isValid() {
        return this.password.valid && this.password2.valid;
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




