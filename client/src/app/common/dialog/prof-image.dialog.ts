import { Component, Optional, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { CookieService } from 'ngx-cookie';

import { FileHandle } from './dragDrop.directive';
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

    CANCEL : CloseStatus = CloseStatus.CANCEL;
    OK : CloseStatus = CloseStatus.OK;

    title: string;

    cancelButton: boolean = true;
    
    imageHeight: string;
    imageWidth: string;
    get_url: string;
    token: string;
    post_api_path: string;

    titleIcon = "far fa-image";

    files: FileHandle[] = [];

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: ImageDataAndConfig,
        private cookie: CookieService,
        public dialogRef: MatDialogRef<ProfImageDialog>
    ) {
    }
 
    ngOnInit(): void {
        const config = this.data;
        this.title = config.title;
        this.token = config.token;
        this.imageHeight = config.height;
        this.imageWidth = config.width;
        this.post_api_path = config.post_api_path;
        this.get_url = `${window.location.origin}${config.get_api_path}`;
        
        if( config.icon ) {
            this.titleIcon = config.icon;
        }
    }

    filesDropped(files: FileHandle[]): void {
        this.files = files;
    }

    fileUpload() {
        let imageFile = this.files[0].file;
        let uploader = new Observable( observer => {
            var formData: any = new FormData();
            var xhr = new XMLHttpRequest();
            formData.append("file", imageFile, imageFile.name);
            xhr.onreadystatechange = function () {
                if (xhr.readyState == 4) {
                    if (xhr.status == 204) {
                        observer.complete();
                    } else if (xhr.status == 201) {
                        observer.next(xhr.response);
                    } else {
                        observer.error(xhr.response);
                    }
                }
            }
            xhr.open("POST", this.post_api_path, true);
            let ctoken = this.cookie.get('XSRF-TOKEN');
            xhr.setRequestHeader('X-XSRF-TOKEN', ctoken);
            xhr.setRequestHeader('Authorization', `Bearer ${this.token}`);
            xhr.send(formData);
        });
        uploader.subscribe( res => {
            this.dialogRef.close({status: CloseStatus.OK });
        });
    }

    get imageStyle() {
        return { height: this.imageHeight, width: this.imageWidth, display: 'block', margin: 'auto' };
    }

}
