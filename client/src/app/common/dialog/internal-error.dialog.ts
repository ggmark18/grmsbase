import { Component, Inject, OnInit } from '@angular/core';
import { DomSanitizer, SafeHtml} from '@angular/platform-browser';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
    selector: 'internal-error',
    templateUrl: './internal-error.dialog.html',
    styleUrls: ['./error.dialog.scss']    
})
export class InternalErrorDialog implements OnInit {

    message : SafeHtml;
    stack;
    stacks = [];
    
    constructor(@Inject(MAT_DIALOG_DATA) public data,
                private sanitizer: DomSanitizer,
                public editorRef: MatDialogRef<InternalErrorDialog>) {
    }
    ngOnInit() {
        var error = this.data.error;
        if( error ) {
            if( error.message) {
                this.message = this.sanitizer.bypassSecurityTrustHtml(error.message);
            }
        } else if ( typeof this.data === "string") {
            this.message = this.data;
        }
    }
}
