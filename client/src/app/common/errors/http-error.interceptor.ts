import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef, MatDialogConfig } from '@angular/material/dialog';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse} from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';

import { AppRootLayout } from '@grms/app-root.layout';
import { environment } from '../../../environments/environment';

import { ErrorDialog } from './error.dialog';

@Injectable()
export class CatchErrorInterceptor implements HttpInterceptor {
    constructor(private router: Router,
                private layout: AppRootLayout,
                private dialog: MatDialog ) {}    
    intercept(request : HttpRequest < any >, next : HttpHandler) : Observable < HttpEvent < any >> {
	    return next.handle(request).pipe(
            catchError((response: HttpErrorResponse) => {
                if ( response.error ) {
                    if( environment.debug ) console.log(`Reponse Error:${JSON.stringify(response)}`);
                    if( response.status == 401 ) {
                        let loginURL = this.layout.loginURL();
                        this.layout.clear();
                        this.layout.subscribeLayoutConfig();
                        if( loginURL ) this.router.navigate([loginURL]);
                    } else if( response.error.type ) {
                        this.dialog.open(ErrorDialog, {
                            data: response.error
                        });
                    }
                    return throwError(response.error);
                }
                return throwError(request);
            }));
    }
}
