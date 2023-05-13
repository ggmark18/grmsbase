import { Component, Optional, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { CookieService } from 'ngx-cookie';

import { FileUploadComponent, FileUploadConfig } from './FileUpload.component'
import { CloseStatus } from '.';
import { AuthConfig } from '@grms/common/auth/auth.config';

export interface ImageDataAndConfig {
    height: string,
    width: string,
    token: string,
    get_api_path: string,
    post_api_path: string,
    title: string,
    icon?: string,
    cancelButton?: boolean
}

@Component({
    selector: 'prof-image-dialog',
    templateUrl: 'prof-image.dialog.html',
    styleUrls: ['./common.dialog.scss']
})
export class ProfImageDialog implements OnInit {
    @ViewChild("fileupload")  fileupload: FileUploadComponent
    
    CANCEL : CloseStatus = CloseStatus.CANCEL;
    OK : CloseStatus = CloseStatus.OK;

    title: string;

    cancelButton: boolean = true

    fileUploadConfig: FileUploadConfig 
    
    titleIcon = "far fa-image";

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: ImageDataAndConfig,
        private cookie: CookieService,
        public dialogRef: MatDialogRef<ProfImageDialog>
    ) {}
 
    ngOnInit(): void {
        const config = this.data;
        this.title = config.title;
        this.fileUploadConfig = {
            imageHeight: config.height,
            imageWidth: config.width,
            token: config.token,
            getApiPath: config.get_api_path,
            putApiPath: config.post_api_path,
        }
        
        if( config.icon ) {
            this.titleIcon = config.icon;
        }
    }

    fileUpload() {
        this.fileupload.upload((res) => {
            this.dialogRef.close({status: CloseStatus.OK});
        });
    }

}
