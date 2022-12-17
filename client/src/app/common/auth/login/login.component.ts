import { Component, OnInit, OnDestroy, Injector, ViewChild, ElementRef } from '@angular/core';
import { Location } from '@angular/common';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { FormGroup, FormControl, Validators, UntypedFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as CryptoJS from "crypto-js";
import { NEVER } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

import { AuthServiceBase} from '../auth.service';
import { AuthType, AuthStatus } from '@api-dto/common/auth/dto.auth';
import { LoginError } from '@api-dto/common/auth/dto.auth';
import { ConfirmDialog } from '@grms/common/dialog/confirm.dialog';
import { ErrorDialog } from '@grms/common/dialog/error.dialog';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponentBase implements OnInit, OnDestroy {
    @ViewChild("passwordField") passwordElement: ElementRef;

    authService: AuthServiceBase;

    loginForm: FormGroup;
    loginid = new FormControl('', [Validators.required,
                                  Validators.maxLength(16)]);
    password = new FormControl('', [Validators.required,
                                    Validators.minLength(6)]);
    showpassword = false;
    
    token : FormControl = undefined;

    // decolation parameter
    _title : string = undefined;
    _icon : string = undefined;
    _maillogin: boolean = false;

    constructor( protected formBuilder: UntypedFormBuilder,
                 protected route: ActivatedRoute,
	             protected dialog: MatDialog,
	             protected router: Router,
                 protected location: Location){
        this.loginForm = this.formBuilder.group({
	        loginid: this.loginid,
	        password: this.password,
            token: this.token
	    });
    }

    ngOnInit() {
        if( this.authService?.isLoggedIn() ) {
            this.router.navigate([this.authService?.loginRootURL()]);
        } else {
            this.route.queryParams.pipe(switchMap( params => {
                let mode = params['mode'];
                if( mode ) {
                    let id = params['id'];
                    let encripted = params['val'];
                    return this.authService.decriptInfo(id,encripted)
                        .pipe(map(info => ({ encripted, info })));
                } else {
                    return NEVER;
                }})).subscribe(({ encripted, info }) => {
                    let dialogconfig = undefined;
                    if ( info.error ) {
                        this.loginid.setValue(info.loginid);
                        if( info.error == LoginError.MISMATCH ) {
                            dialogconfig = {
                                icon: ConfirmDialog.IconType.ERROR,
                                title: $localize`Invalid Link URL`,
                                content: $localize`This URL is invalid<BR>Select Mail Login again`,
                                buttonTitle: "OK",
                                width: "300px"
                            }
                        } else if( info.error == LoginError.TIMEOVER ) {
                            dialogconfig = {
                                icon: ConfirmDialog.IconType.ERROR,
                                title: $localize`Expire Link validation`,
                                content: $localize`This URL is expired<BR>Select Mail Login again.`,
                                buttonTitle: "OK",
                                width: "350px"
                            }
                        }
                    } else {
                        let bytes = CryptoJS.AES.decrypt(encripted, info.salt);
                        let decripted = bytes.toString(CryptoJS.enc.Utf8);
                        this.loginid.setValue(info.loginid);
                        this.password.setValue(decripted);
                        dialogconfig = {
                            title: $localize`Save initial password`,
                            content: $localize`New Password is set. <BR>Save correctly for the next time.`,
                            buttonTitle: "OK",
                            width: "400px"
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
    }

    ngOnDestroy() {
        this.showpassword = false;
    }
        
    loginIDReturn(e) {
        if(e.which == 13) {
            this.checkLoginID();
        } else {
            this.clearError();
        }
    }

    async checkLoginID() {
        if( this.loginid.value ) {
            let authType = await this.authService.checkAuthType(this.loginid.value);
            if( authType == AuthType.TwoFactor ) {
                this.token = new FormControl('',  [Validators.required,
                                              Validators.minLength(6)]);
            } else {
                this.token = undefined;
            }
            if( !authType ) {
                this.loginid.setErrors({message:$localize`Invalid LoginID`});
            }
        }
    }
    clearError() {}
    
    login() : void {
        this.authService.signupCheck(this.loginid.value).pipe(switchMap( status => {
            if( status == AuthStatus.NONE || status == AuthStatus.ENTRY  ) {
                this.loginid.setErrors({message:$localize`Invalid LoginID`});
                return NEVER;
            } else {
	            return this.authService.login(this.loginForm.value);
            }})).subscribe( data => {
		        this.router.navigate([this.authService.loginRootURL()]);
	        }, error => {
                if( error.statusCode == 401 ) {
                    if( error.message == LoginError.EXPIRED ) {
                        let dialogconfig = {
                            icon: ConfirmDialog.IconType.ERROR,
                            title: $localize`Expired Password`,
                            content: $localize`This password is no longer valid.<BR>Reset password by Mail Login.`,
                            buttonTitle: "OK",
                            width: "350px"
                        }
                        this.dialog.open(ConfirmDialog, {
                            data: dialogconfig,
                            width: dialogconfig.width
                        });
                    } else if( error.message == LoginError.UNINITIAL ) {
                        let dialogconfig = {
                            icon: ConfirmDialog.IconType.ERROR,
                            title: $localize`Not Activate Account`,
                            content: $localize`This account is not activate.<BR>Initialize by Mail Login.`,
                            buttonTitle: "OK",
                            width: "350px"
                        }
                        this.dialog.open(ConfirmDialog, {
                            data: dialogconfig,
                            width: dialogconfig.width
                        });
                    } else if( error.message == LoginError.BADTOKEN ) {
                        this.token.setErrors({message:$localize`Invalid Token`});
                    } else {
		                this.password.setErrors({message:$localize`Invalid Password`});
                    }
                }
	        });
    }
    maillogin() : void {
        let url_locale = this.location.prepareExternalUrl('');
        url_locale = url_locale.replace(/^\/+|\/+$/g,'');
        if ( url_locale.length == 0) url_locale = '-';

	    this.authService.signupCheck(this.loginid.value).pipe(switchMap( status => {
            if( status == AuthStatus.NONE || status == AuthStatus.ENTRY  ) {
                this.loginid.setErrors({message:$localize`This LoginID is not registered`});
                return NEVER;
            } else {
                return this.authService.maillogin(this.loginid.value, url_locale);
            }})).subscribe(status => {
                let config = {
                    title: $localize`Password setting is complited`,
                    content: $localize`Close this window, login from mail url that you have recieved`,
                    buttonTitle: "OK"
                }
                this.dialog.open(ConfirmDialog, {
                    data: config,
                    width: '400px'
                });
	        }, error => {
		        this.loginid.setErrors({message:error.message});
	        });
    }

    get loginButtonClass() {
        let clname =  "btn-outline-secondary";
        if( this.loginid.valid && this.password.valid && this.token?.valid) {
            clname = "btn-login";
        }
        return clname;
    }
    get mailLoginButtonClass() {
        let clname =  "btn-outline-secondary";
        if( this.loginid.valid && !this.password.valid ) {
            clname = "btn-maillogin";
        }
        return clname;
    }
    get passwordFieldType() {
        return (this.showpassword)?"test":"password";
    }

    get passwordEyes() {
        return (this.showpassword)?"fas fa-eye":"fas fa-eye-slash";
    }

    get mailLoginTooltip() {
        return $localize`New password will be generated automatically, and login by mail link. (When you forget the password, or initial login)`;
    }
}







