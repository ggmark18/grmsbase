import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
    selector: 'error.dialog',
    templateUrl: 'error.dialog.html',
    styleUrls: ['../dialog/common.dialog.scss','./errors.component.scss'],
})
export class ErrorDialog {
    constructor(@Inject(MAT_DIALOG_DATA) public data, 
                public editorRef: MatDialogRef<ErrorDialog>
               ) {
    }
    
    get errorTitle() {
        let title = "Unknow Error";
        if( this.data.type ) {
            title = this.data.type;
        }
	    return title;
    }
    get errorMessage() {
	    let message = this.data.message;
	    return message;
    }
    
    get htmlMessage() {
	    var html;
	    if( this.data.html ) {
	        html = this.data.html;
	    }
	    return html;
    }
    get errorStack() {
	    var stack = null;
	    if( this.data.stack) {
	        stack = this.data.stack;
	    }
	    return stack;
    }
    get iconstatus() {
	    var icon = "fas fa-exclamation-triangle";
	    if(this.data.statusCode == 500 ) {
	        icon = "fas fa-bomb";
	    }
	    return icon;
    }
    
    get showOKButton() {
	    var showOKButton : boolean = false;
	    if( this.data.ok ) {
	        showOKButton = this.data.ok;
	    }
	    return showOKButton;
    }
}
