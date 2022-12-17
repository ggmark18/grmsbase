import { Component, Optional, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
var _$iconType = {
    INFO: { icon:"fas fa-info-circle",          color:"black"},
    ERROR:{ icon:"fas fa-exclamation-triangle", color:"red"}
};

export declare const enum CloseStatus {
    OK = "ok",
    CANCEL = "cancel"
}

@Component({
    selector: 'confirm-dialog',
    templateUrl: 'confirm.dialog.html',
    styleUrls: ['./confirm.dialog.scss']
})
export class ConfirmDialog implements OnInit {

    CANCEL : CloseStatus = CloseStatus.CANCEL;
    OK : CloseStatus = CloseStatus.OK;

    static IconType = _$iconType;

    title: string;
    content: string;

    okButtonClass: string;
    buttonTitle: string = "";
    cancelButton: boolean = true;

    confirmIcon;
 
    constructor(
        @Inject(MAT_DIALOG_DATA) public data: any,
        public dialogRef: MatDialogRef<ConfirmDialog>
    ) {}
 
    ngOnInit(): void {
        const config = this.data;
        this.title = config.title;
        this.content = config.content;
        this.confirmIcon = ConfirmDialog.IconType.INFO;

        if( config.icon ) {
            this.confirmIcon = config.icon;
        }
        
        if( config.okButtonClass ) {
            this.okButtonClass = config.okButtonClass;
        }
        if( !config.cancelButton ) {
            this.cancelButton = config.cancelButton;
        }
        if( config.buttonTitle ) {
            this.buttonTitle = config.buttonTitle;
        }
    }
    get iconColor() {
        return this.confirmIcon.color;
    }
}
