import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from "@angular/forms";
import { Observable } from 'rxjs';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { ProfileFormat, ProfileType } from '@api-dto/common/profile/dto';

export declare const enum CloseFunction {
    SAVE = "save",
    CREATE = "create",
    DELETE = "delete"
};

@Component({
    selector: 'attribute-edit.dialog',
    templateUrl: 'attribute-edit.dialog.html',
    styleUrls: ['./profile.scss']
})
export class AttributeEditDialog implements OnInit {

    attributeForms: FormGroup;

    typeCandidate = [
        { value: ProfileType.String, title: '文字列' },
        { value: ProfileType.Date, title: '日付' },
        { value: ProfileType.YearMonth, title: '年/月' }
    ];

    constructor(@Inject(MAT_DIALOG_DATA) public model: ProfileFormat,
                public editorRef: MatDialogRef<AttributeEditDialog>,
                public fb: FormBuilder,
                private dialog: MatDialog) {
    }

    ngOnInit() {
        this.attributeForms = this.fb.group({
            key: [''],
            title: [''],
            prefix: [''],
            alwaysPrefix: [false],
            postfix: [''],
            alwaysPostfix: [false],
            type: [ProfileType.String],
            show: [true],
        });
        if( this.model) this.attributeForms.patchValue(this.model);
    }

    onSubmit() {
        if(this.model) {
            this.editorRef.close({function:CloseFunction.SAVE, value:this.attributeForms.value});
        } else {
            this.editorRef.close({function:CloseFunction.CREATE, value:this.attributeForms.value});
        }
    }

    onDelete() {
        this.editorRef.close({function:CloseFunction.DELETE, value:this.attributeForms.value});
    }
}

