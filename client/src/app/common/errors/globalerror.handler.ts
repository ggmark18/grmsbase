import { Injectable, ErrorHandler } from '@angular/core';
import { MatDialog, MatDialogRef, MatDialogConfig } from '@angular/material/dialog';
import { InternalErrorDialog } from './internal-error.dialog';

import { ConfirmDialog } from '../dialog/confirm.dialog';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
    constructor( private dialog: MatDialog ) {
    }
    handleError(error) {
        if( error.status ) {
            let errors = ["url:" + error.url,
                          "status:"+ error.status,
                          "statusText:"+ error.statusText];
            if( error._body ){
                let reserror = JSON.parse(error._body);
                console.log(reserror);
                /*
                if( reserror.error &&
                    reserror.error.name == 'UnauthorizedError' ) {
                    const config = new MatDialogConfig();
                    config.data = {
                        title: 'セッション有効期限切れ',
                        content: '自動的にログアウトしました。',
                        cancelButton: false
                    }
                    this.dialog.open(ConfirmDialog, config);
                    return;
                } else {

                }
                */
                errors.push(reserror.error.message);
            }
            error = {
                error: {
                    message: 'Response Error',
                    stacks: errors
                }}
        } else if (error instanceof Error ) {
            error = {
                error: {
                    name: error.name,
                    message: error.name,
                    stack: error.message
                }}
            
        } else {
            console.log('else!!!')
        }

        if( error.error &&
            error.error.name == 'UnauthorizedError' ) {
            const config = new MatDialogConfig();
            config.data = {
                title: 'セッション有効期限切れ',
                content: '自動的にログアウトしました。',
                cancelButton: false
            }
            this.dialog.open(ConfirmDialog, config);

        } else {
            this.dialog.open(InternalErrorDialog, {
                data: error
            });
        }
    }
}
