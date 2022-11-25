import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PDFJS } from 'pdfjs-dist/build/pdf';

@Component({
    selector: 'pdf-dialog',
    template:`
        <div mat-dialog-content>
        <pdf-viewer [src]="receiptFileSrc "
                    [render-text]="true"
                    [show-all]="true"
                    [autoresize]="true"
                    style="display: block;"
        ></pdf-viewer>
        </div>
    `,
    styleUrls: ['./pdf.component.scss']
})
export class PDFDialog {
    receiptFileSrc;
    constructor(@Inject(MAT_DIALOG_DATA) public pdfurl: string,
                public editorRef: MatDialogRef<PDFDialog>
               ) {
        var today = new Date();
        let token = localStorage.getItem('token');

        console.log(pdfurl);
        
        this.receiptFileSrc = {
            url: pdfurl + '?update='
			    +today.getFullYear()+today.getMonth()+today.getDate()
			    +today.getHours()+today.getMinutes()+today.getSeconds(),
            httpHeaders: {'Authorization': `Bearer ${token}`}
        }
    }
}

