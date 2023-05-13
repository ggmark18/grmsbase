import { Component, Inject, OnInit, Input } from '@angular/core';
import { FormControl, Validators, FormBuilder, FormGroup } from '@angular/forms';

import { ProfileFormat, ProfileType } from '@api-dto/common/profile/dto';

@Component({
    selector: 'grms-profile-form',
    templateUrl: './profile.form.html',
    styleUrls: ['./profile.scss']
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
    
    constructor( private formBuilder: FormBuilder ) {}
    
    ngOnInit() {
        let forminfo = {};
        for(let attribute of this.attrs ) {
            forminfo[attribute.key] = [this.values[attribute.key]];
        }
        this.profileForm = this.formBuilder.group(forminfo);
    }

    isStringField( attribute ) {
        return attribute.type == ProfileType.String;
    }
    isDateField( attribute ) {
        return attribute.type == ProfileType.Date;
    }
    isYearMonthField( attribute ) {
        return attribute.type == ProfileType.YearMonth;
    }

    getValue() {
        return this.profileForm.value;
    }
}
