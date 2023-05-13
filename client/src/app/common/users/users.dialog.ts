import { Component, Inject, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { FormControl, Validators, UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA  } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { UsersService } from './service';
import { ConfirmDialog } from '@grms/common/dialog/confirm.dialog';
import { DisplayErrorMessage } from '@grms/common/errors/messages';
import { AuthRole } from '@api-dto/common/auth/dto';
import { User, UserServiceError } from '@api-dto/common/users/dto';

import * as _ from 'lodash';

@Component({
    selector: 'users.dialog',
    templateUrl: 'users.dialog.html',
    styleUrls: ['./users.component.scss']
})
export class UsersDialog implements OnInit, OnDestroy {
    
    model: User;
    attributes = [];
    roleCandidate = [];
    error = null;

    userForm: UntypedFormGroup;
    subscriptions: Subscription = undefined;
    
    constructor(@Inject(MAT_DIALOG_DATA) public data,
                private strage: UsersService,
                private editorRef: MatDialogRef<UsersDialog>,
                private formBuilder: UntypedFormBuilder,
                private dialog: MatDialog) {

        this.model = data.model;
        this.roleCandidate = data.roles;
    }

    public ngOnInit() {
        this.userForm = this.formBuilder.group({
            _id: [''],
            loginid: ['', [Validators.required]],
            name: ['', [Validators.required]],
            email: ['',[Validators.required, Validators.email]],
            role: [AuthRole.MEMBER],
        });
        if( this.model ) this.userForm.patchValue(this.model);
    }
    
    ngOnDestroy() {
        this.subscriptions?.unsubscribe();
    }
    
    async onSubmit() {
        if(this.model) {
            this.strage.updateUser(this.userForm.value).subscribe( result => {
                this.editorRef.close();
            }, error => {
                if( error.message ) {
                    this.error = error.message;
                }
            });
        } else {
            this.strage.createUser(this.userForm.value).subscribe( result => {
                this.editorRef.close();
            }, error => {
                if( error.error && error.error == UserServiceError.CONFLICT ) {
                    let field = this.userForm.get(error.message);
                    if( field ) {
                        field.setErrors({ message: DisplayErrorMessage.DuplicateKey});
                    } else {
                        this.error = error.message;
                    }
                } else if( error.message ) {
                    this.error = error.message;
                }
            });
        }
    }
    get loginid() { return this.userForm.get('loginid'); }
    get email() { return this.userForm.get('email'); }
}
