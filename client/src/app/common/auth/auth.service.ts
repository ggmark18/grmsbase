import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import jwt_decode from 'jwt-decode';
import { map } from 'rxjs/operators';
import { AppRootLayout } from '../../app-root.layout';
import { SocketService } from '../base/socket.service';
import { AuthConfig, DefaultAuthConfig } from './auth.config';
import { AuthUser, UserStatus, UserRole } from '../../../api-dto/common/users/dto.users';
import { DecodeInfo } from '../../../api-dto/common/auth/dto.auth';

export class AuthServiceBase {
    static isAdmin( user: AuthUser ) : boolean {
        return user?.role == UserRole.ADMIN;
    }
    
    public $userSource = new Subject<AuthUser>();
    
    protected http : HttpClient;
    protected socket: SocketService;
    protected authConfig: AuthConfig;
    protected layout: AppRootLayout;

    constructor(http : HttpClient,
                socket: SocketService,
                authConfig: AuthConfig ) {
        this.http = http;
        this.socket = socket;
        this.authConfig = authConfig;
        
        const tokenVal = this.authConfig.token;
	    if (tokenVal) {
	        const decodedUser = this.decodeUserFromToken(tokenVal);
	        this.setUser(decodedUser);
	    }
    }

    login(useridAndPassword) : Observable<AuthUser> {
	    return Observable.create(observer => {
	        this.http.post(this.authConfig.param.loginAPI, useridAndPassword )
		        .subscribe( async (data : any) => {
		            if( data.access_token ) {
                        try {
                            this.authConfig.saveToken(data.access_token);
                            const decodedUser = this.decodeUserFromToken(data.access_token);
                            if ( useridAndPassword.token ) {
                                let res = await this.twoFactorAuth(decodedUser['_id'], useridAndPassword.token);
                                this.authConfig.saveToken(res.access_token);
                            }
                            this.setUser(decodedUser);
                            observer.next({user: decodedUser});
                            this.socket.emit('login', { userID: decodedUser['_id'] });
                        } catch (error){
                            observer.error(error);
                            observer.complete();
                        }
		            }
		            observer.complete();
		        }, error => {
                    observer.error(error);
                    observer.complete();
                })
	    });
    }

    twoFactorAuth( id, token ) : any {
        return new Promise( (resulve, reject ) => {
            this.http.post('/api/auth/2fa/authenticate',{ _id: id, twoFactorAuthenticationCode:token }).subscribe( res => {
                resulve(res);
            }, err => {
                reject(err);
            });
        });
	}

    signupCheck( userid: string ) : Observable<any> {
        let url = this.authConfig.param.signupCheckAPI;
        if(!url) url = '/api/auth/signupCheck';
	    return this.http.get(`${url}/${this.authConfig.param.serviceName}/${userid}`,{ responseType: 'text'});
    }

    maillogin(userid, locale) : Observable<any> {
        let url = this.authConfig.param.mailloginAPI;
        if(!url) url = '/api/auth/maillogin';
        return this.http.get(`${url}/${this.authConfig.param.serviceName}/${userid}/${locale}`,{ responseType: 'text'});
    }

    decriptInfo(id: string, key: string ) : Observable<DecodeInfo> {
        let url = this.authConfig.param.decriptAPI;
        if(!url) url = '/api/auth/maillogin/decode';
        return this.http.post<DecodeInfo>(url, { id: id, key: key });
    }

    logout(): void {
	    this.authConfig.signOut();
        let user = this.getUser();
        if( user ) {
            this.socket.emit('logout', { userID: user._id });
        }
	    this.setUser(null);
    }

    getUserSource(): Subject<AuthUser> {
        return this.$userSource;
    }

    me(): Observable<AuthUser> {
	    return Observable.create(observer => {
	        this.http.get('/api/users/me').subscribe((data : any) => {
		        observer.next(data);
		        this.setUser(data);
		        observer.complete();
	        }, error => {
		        if( error.statusCode == 401 ) {
                    this.authConfig.signOut();
	                this.setUser(null);
		            observer.error( error );
		        }
	        })
	    });
    }

    syncMe() : Promise<AuthUser> {
        return new Promise( (resulve, reject ) => {
            this.me().subscribe( res => {
                resulve(res);
            }, err => {
                reject(err);
            });
        });
    }

    
    decodeUserFromToken(token) {
        return jwt_decode(token);
    }

    public hasToken(): boolean {
	    const item = this.authConfig.token;
	    return item && item.length > 0;
    }

    // Be Extended
    isLoggedIn() {
        return false;
    }
    setUser(user): void {
        this.$userSource.next(user);
    }
    getUser() {
        return null;
    }
    loginRootURL() {
        return '/users';
    }
    
    checkAuthType( uid ) : any {
        return new Promise( (resulve, reject ) => {
            this.http.get(`/api/users/checkType/${this.authConfig.param.serviceName}/${uid}`,{ responseType: 'text'}).subscribe( res => {
                resulve(res);
            }, err => {
                reject(err);
            });
        });
	}
}

@Injectable()
export class AuthService extends AuthServiceBase {
    constructor(protected http : HttpClient,
                protected socket: SocketService,
                protected authConfig: DefaultAuthConfig ) {
        super(http,socket,authConfig)
    }

    setUser(user): void {
        super.setUser(user);
	    if (user) {
	        (<any>window).user = user;
	    } else {
	        if ((<any>window).user) {
		        delete (<any>window).user;
	        }
	    }
    }
    getUser() {
        return (<any>window)?.user;
    }
    isLoggedIn() {
        return (<any>window)?.user != null;
    }

}

