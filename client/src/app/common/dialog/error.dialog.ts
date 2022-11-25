import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
    selector: 'error.dialog',
    styleUrls: ['./error.dialog.scss'],
    templateUrl: 'error.dialog.html'
})
export class ErrorDialog {
    constructor(@Inject(MAT_DIALOG_DATA) public data, 
                public editorRef: MatDialogRef<ErrorDialog>
               ) {
        console.log(data);
    }
    
    get errorTitle() {
        let title = "Unknow Error";
        if( this.data.statusText ) {
            title = this.data.statusText;
        } else if ( this.data.error && typeof this.data.error == 'string' ) {
            title = this.data.error;
        }
	    return title;
    }
    get errorMessage() {
	    var message;
	    if( this.data.error && this.data.error.message ) {
	        message = this.data.error.message;
	    } else {
	        message = this.data.message;
	    }
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
	    if( this.data.error ) {
	        stack = this.data.error.stack;
	    }
	    return stack;
    }
    get iconstatus() {
	    var icon = "fas fa-exclamation-triangle";
	    if(this.data.status == 500 ) {
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
