import { Component, Optional, Inject, OnInit } from '@angular/core';
import { FormControl, Validators, FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { CloseStatus } from '.';

export interface InputDataAndConfig {
    value: string,
    title: string,
    icon?: string,
    buttonClass?: string,
    buttonTitle?: string,
    cancelButton?: boolean
}

@Component({
    selector: 'input-dialog',
    templateUrl: 'input.dialog.html',
    styleUrls: ['./common.dialog.scss']
})
export class InputDialog implements OnInit {

    CANCEL : CloseStatus = CloseStatus.CANCEL;
    OK : CloseStatus = CloseStatus.OK;

    title: string;

    buttonClass: string;
    buttonTitle: string = "";
    cancelButton: boolean = true;

    titleIcon = "far fa-edit";

    forms: FormGroup;
 
    constructor(
        @Inject(MAT_DIALOG_DATA) public data: InputDataAndConfig,
        private formBuilder: FormBuilder,
        public dialogRef: MatDialogRef<InputDialog>
    ) {
    }
 
    ngOnInit(): void {
        const config = this.data;
        this.title = config.title;
        
        this.forms = this.formBuilder.group({
            target: [config.value],
        });

        if( config.icon ) {
            this.titleIcon = config.icon;
        }
        if( config.buttonClass ) {
            this.buttonClass = config.buttonClass;
        }
        if( config.buttonTitle ) {
            this.buttonTitle = config.buttonTitle;
        }
    }

    get value() {
        return this.forms.get('target').value;
    }
}
