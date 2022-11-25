import { Component, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA  } from '@angular/material/dialog';

@Component({
    selector: 'pdf.dialog',
    template:`
        <mat-dialog>
        <mat-dialog-content class="pdf-dialog-content">
        <pdf-viewer [src]="pdfFileSrc "
                    [render-text]="true"
                    [show-all]="true"
                    [original-size]="false"
                    style="width: 60vw; height: 100vh"
        ></pdf-viewer>
        </mat-dialog-content>
        </mat-dialog>
    `,
    styleUrls: ['./pdf.component.scss']
})
export class PDFDialog {
    pdfFileSrc;
    constructor(@Inject(MAT_DIALOG_DATA) public url,
                public editorRef: MatDialogRef<PDFDialog>
               ) {
        var today = new Date();
        let token = localStorage.getItem('token');

        console.log(url);
        
        this.pdfFileSrc = {
            url:`${url}?update=`
			    +today.getFullYear()+today.getMonth()+today.getDate()
			    +today.getHours()+today.getMinutes()+today.getSeconds(),
            httpHeaders: {'Authorization': `Bearer ${token}`},
        }
        
    }
    callBackFn(pdf: any) {
        console.log(pdf);
    }
}

