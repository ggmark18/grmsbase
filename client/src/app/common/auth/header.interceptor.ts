import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest} from '@angular/common/http';
import { Observable } from 'rxjs';

import { DefaultAuthConfig } from './auth.config';

export class AuthHeaderInterceptorBase implements HttpInterceptor {

    getTokenValue() { return null; }
    
    intercept(req : HttpRequest <any>, next : HttpHandler) : Observable <HttpEvent<any>> {
		// Clone the request to add the new header
	    const tokenVal = this.getTokenValue();
        if( tokenVal ) {
	        const clonedRequest = req.clone({
	            headers: req
		            .headers
		            .set('Authorization', tokenVal ? `Bearer ${tokenVal}` : '')
	        });
	        // Pass the cloned request instead of the original request to the next handle
	        return next.handle(clonedRequest);
        } else {
            return next.handle(req);
        }
    }
}

export class AuthHeaderInterceptor extends AuthHeaderInterceptorBase {

    getTokenValue() {
        const config = new DefaultAuthConfig();
	    return config.token;
    }
}
