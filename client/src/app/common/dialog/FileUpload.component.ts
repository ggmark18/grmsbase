import { Component, Optional, Inject, Input } from '@angular/core';
import { Observable } from 'rxjs'
import { CookieService } from 'ngx-cookie';
import { FileHandle } from './dragDrop.directive';

export interface FileUploadConfig {
    token: string,
    getApiPath: string,
    putApiPath: string,
    imageHeight: string,
    imageWidth: string,
}

@Component({
    selector: 'file-upload',
    templateUrl: 'FileUpload.component.html',
    styleUrls: ['./common.dialog.scss']
})
export class FileUploadComponent {
    @Input() config: FileUploadConfig

    files: FileHandle[] = [];

    constructor( private cookie: CookieService ) {}
    
    filesDropped(files: FileHandle[]): void {
        this.files = files;
    }

    upload( resultFunc : (result : any) => void ) {
        if (this.isSetFile) {
            this._uploadFile(`${this.config.putApiPath}`,this.files[0].file, this.config.token).subscribe( data => {
                resultFunc(JSON.parse(data))
            })
        } else {
            resultFunc(null)
        }
    }

    _uploadFile(path, imageFile, token): Observable<any> {
        return new Observable( observer => {
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
            xhr.open("POST", path, true);
            let ctoken = this.cookie.get('XSRF-TOKEN');
            xhr.setRequestHeader('X-XSRF-TOKEN', ctoken);
            xhr.setRequestHeader('Authorization', `Bearer ${token}`);
            xhr.send(formData);
        });
    }

    get imageStyle() {
        return { height: this.config.imageHeight, width: this.config.imageWidth, display: 'block', margin: 'auto' };
    }

    get isSetFile() {
        return this.files.length > 0 
    }
}
