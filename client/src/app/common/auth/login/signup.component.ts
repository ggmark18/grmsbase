import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as CryptoJS from "crypto-js";
import { map, switchMap } from 'rxjs/operators';

import { AuthServiceBase} from '../auth.service';
import { AuthType, AuthStatus, LoginError } from '@api-dto/common/auth/dto';
import { ConfirmDialog } from '@grms/common/dialog/confirm.dialog';

import { PasswordChangeForm } from './password.form';

@Component({
    selector: 'grms-signup',
    templateUrl: './signup.component.html',
    styleUrls: ['./login.component.scss']
})
export class SignupComponentBase implements OnInit {
    @Input() set auth( service ) {
        this.authService = service;
    }
    @ViewChild(PasswordChangeForm) passwordForm: PasswordChangeForm;

    static selector(authServiceString) {
        return `<grms-signup [auth]='${authServiceString}'></grms-signup>`;
    }
    
    authService: AuthServiceBase;

    // decolation parameter
    _title : string = undefined;
    _icon : string = undefined;

    constructor( protected route: ActivatedRoute,
	             protected dialog: MatDialog,
	             protected router: Router,
                 protected location: Location){
    }

    ngOnInit() {
        console.log('signup');
        this.route.queryParams.pipe(switchMap( params => {
            let userid = params['id'];
            let encripted = params['value'];
            return this.authService.prelogin(userid, encripted);
        })).subscribe( user => {
            console.log('subscribe ret');
            console.log(user);
            this.setupTitle(user);
        }, error => {
            console.log('error ');
            console.log(error);
            let dialogconfig = undefined;
            if( error == LoginError.MISMATCH ) {
                dialogconfig = {
                    icon: ConfirmDialog.IconType.ERROR,
                    title: $localize`Invalid Link URL`,
                    content: $localize`This URL is invalid,<BR>Contact community office.`,
                    buttonTitle: "OK",
                    width: "300px"
                }
            } else if( error == LoginError.TIMEOVER ) {
                dialogconfig = {
                    icon: ConfirmDialog.IconType.ERROR,
                    title: $localize`Expire Link validation`,
                    content: $localize`This URL is expired,<BR> Request again.`,
                    buttonTitle: "OK",
                    width: "350px"
                }
            }
            if( dialogconfig ) {
                this.dialog.open(ConfirmDialog, {
                    data: dialogconfig,
                    width: dialogconfig.width
                });
            }
        });
    }

    signup() {
        console.log('shoud not be called');
        this.authService.signup(this.passwordForm.value).subscribe( user => {
            this.router.navigate([this.authService.loginRootURL()]);
        });
    }

    setupTitle(domain) {}
}







