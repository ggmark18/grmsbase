import { Component, Inject, OnInit, Input } from '@angular/core';
import { FormControl, Validators, FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA  } from '@angular/material/dialog';

import { ProfileFormat } from './';

@Component({
    selector: 'profile-form',
    templateUrl: 'profile.form.html',
    styleUrls: ['']
})
export class ProfileForm implements OnInit {
    @Input() set attributes( value ) {
        if( value ) this.attrs = value;
    }
    @Input() set profiles( param ) {
        if( param ) this.values = param;
    }

    attrs: ProfileFormat[] = [];
    values = {};
    profileForm: FormGroup;
    error = null;
    
    constructor( private formBuilder: FormBuilder ) {

    }
    
    ngOnInit() {
        let forminfo = {};
        for(let attribute of this.attrs ) {
            forminfo[attribute.key] = [this.values[attribute.key]];
        }
        this.profileForm = this.formBuilder.group(forminfo);
    }

    getValue() {
        return this.profileForm.value;
    }
}
