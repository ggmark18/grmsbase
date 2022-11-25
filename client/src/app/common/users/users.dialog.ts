import { Component, Inject, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { FormControl, Validators, UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA  } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { UsersService } from './users.service';
import { ConfirmDialog } from '../dialog/confirm.dialog';
import { DisplayMessage } from '../base/messages';
import { AuthUser, UserRole, UserServiceError } from '../../../api-dto/common/users/dto.users';

import * as _ from 'lodash';

@Component({
    selector: 'users.dialog',
    templateUrl: 'users.dialog.html',
    styleUrls: ['./users.component.scss']
})
export class UsersDialog implements OnInit, OnDestroy {
    
    model: AuthUser;
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
            userid: ['', [Validators.required]],
            name: ['', [Validators.required]],
            email: ['',[Validators.required, Validators.email]],
            role: [UserRole.MEMBER],
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
                        field.setErrors({ message: DisplayMessage.DuplicateKey});
                    } else {
                        this.error = error.message;
                    }
                } else if( error.message ) {
                    this.error = error.message;
                }
            });
        }
    }
    get userid() { return this.userForm.get('userid'); }
    get email() { return this.userForm.get('email'); }
}
