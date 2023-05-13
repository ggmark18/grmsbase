import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest} from '@angular/common/http';
import { Pipe, PipeTransform } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'

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

@Pipe({ name: 'secure'})
export class SecurePipe implements PipeTransform {
    constructor(private http: HttpClient, private sanitizer: DomSanitizer) { }
    
    transform(url): Observable<SafeUrl> {
        return this.http.get(url, { responseType: 'blob' }).pipe(
            map(blob => this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(blob))));
    }
}
