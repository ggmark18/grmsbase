import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef, MatDialogConfig } from '@angular/material/dialog';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { ErrorDialog } from '../dialog/error.dialog';
import { environment } from '../../../environments/environment';
import { retry, catchError } from 'rxjs/operators';

@Injectable()
export class CatchErrorInterceptor implements HttpInterceptor {
    constructor( private dialog: MatDialog ) {}    
    intercept(request : HttpRequest < any >, next : HttpHandler) : Observable < HttpEvent < any >> {
	    return next.handle(request).pipe(
            catchError((response: HttpErrorResponse) => {
                if ( response.error ) {
                    if( environment.debug ) console.log(`Reponse Error:${JSON.stringify(response)}`);
                    if( response.error.type ) {
                        if( response.error.type == "InternalError") {
                            this.dialog.open(ErrorDialog, {
                                data: response
                            });
                        }
                    }
                    return throwError(response.error);
                }
                return throwError(request);
            }));
    }
}
