import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import jwt_decode from 'jwt-decode';
import { map } from 'rxjs/operators';
import { AppRootLayout } from '../../app-root.layout';
import { SocketService } from '../base/socket.service';
import { AuthConfig } from './auth.config';
import { AuthUser, AuthRole, LoginInfo, Payload, DecodeInfo, ChangePassword } from '@api-dto/common/auth/dto.auth';

export function isAdmin( user: AuthUser ) : boolean {
    return user?.role == AuthRole.ADMIN;
}

export class AuthServiceBase {
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
	        this.setDecodedUser(decodedUser);
	    }
    }

    login(useridAndPassword) : Observable<AuthUser> {
	    return Observable.create(observer => {
	        this.http.post(this.authConfig.param.loginAPI, useridAndPassword )
		        .subscribe( async (info : LoginInfo) => {
                    let access_token = info.access_token
                    if( access_token ) {
                        this.authConfig.saveToken(access_token);
                        const decodedUser = this.decodeUserFromToken(access_token);
                        try {
                            if( decodedUser.isTwoFactorAuthenticated ) {
                                await this.twoFactorAuth(decodedUser.userid, useridAndPassword.token);
                            }
                            this.setDecodedUser(decodedUser);
                            observer.next({user: decodedUser});
                            this.socket.emit('login', { userID: decodedUser.userid });
                        } catch (error){
                            this.authConfig.signOut();
                            observer.error(error);
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
        let url = this.authConfig.param.TwoFactorLoginAPI;
        return new Promise( (resulve, reject ) => {
            this.http.post(url,{ _id: id, twoFactorAuthenticationCode:token }).subscribe(
                (res: LoginInfo) => {
                resulve(res.access_token);
            }, err => {
                reject(err);
            });
        });
	}

    signupCheck( userid: string ) : Observable<any> {
        let url = this.authConfig.param.signupCheckAPI;
	    return this.http.get(`${url}/${userid}`,{ responseType: 'text'});
    }

    maillogin(userid, locale) : Observable<any> {
        let url = this.authConfig.param.mailloginAPI;
        return this.http.get(`${url}/${userid}/${locale}`,{ responseType: 'text'});
    }

    decriptInfo(id: string, key: string ) : Observable<DecodeInfo> {
        let url = this.authConfig.param.decriptAPI;
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

    async getLoginUser(): Promise<any> {
        let user = this.getUser();
        return new Promise( (resulve, reject ) => {
            if ( user ) {
                resulve(user);
            } else {
                this.$userSource.asObservable().subscribe( res => {
                    resulve(res);
                }, err => {
                    reject(err);
                });
            }
        });
    }

    me(): Observable<any> {
        let url = this.authConfig.param.loginUserAPI;
	    return Observable.create(observer => {
	        this.http.get(url).subscribe((data : any) => {
		        observer.next(data);
		        this.setUser(data);
		        observer.complete();
	        }, error => {
		        if( error.statusCode == 401 ) {
                    this.authConfig.signOut();
	                this.setUser(null);
		        }
                observer.error( error );
	        })
	    });
    }

    syncMe() : Promise<any> {
        return new Promise( (resulve, reject ) => {
            this.me().subscribe( res => {
                resulve(res);
            }, err => {
                reject(err);
            });
        });
    }
    
    decodeUserFromToken(token) : Payload {
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
    setDecodedUser( payload ) {
        let url = this.authConfig.param.loginUserAPI;
        this.http.get(url).subscribe((user : any) => {
            if( payload.userid == user._id ) {
                this.setUser(user); // call extended function
            } else {
                this.authConfig.signOut();
	            this.setUser(null);
            }
        }, error => {
		    if( error.statusCode == 401 ) {
                this.authConfig.signOut();
	            this.setUser(null);
		    }
	    });
    }
    setUser(user) : void {
        this.$userSource.next(user);
    }
    getUser() {
        return null;
    }
    loginRootURL() {
        return '/';
    }
    
    checkAuthType( loginid ) : any {
        let url = this.authConfig.param.typeCheckAPI;
        return new Promise( (resulve, reject ) => {
            this.http.get(`${url}/${loginid}`,{ responseType: 'text'}).subscribe( res => {
                resulve(res);
            }, err => {
                reject(err);
            });
        });
	}
    
    changePassword( password ) : Observable<any> {
        let url = this.authConfig.param.changePasswordAPI;
        let user = this.getUser();
        const cp : ChangePassword = { userid: user._id, password: password };
        return Observable.create(observer => {
            this.http.put(url, cp).subscribe((data : any) => {
                observer.next(data);
		        observer.complete();
		    }, error => {
                observer.error( error );
	        });
        });
	}
}


