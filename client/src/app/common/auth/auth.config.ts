import { Injectable } from '@angular/core';

export interface AuthParam {
    tokenKey: string

//    targetName: string

    loginAPI: string
    loginUserAPI: string
    typeCheckAPI: string
    signupCheckAPI: string
    changePasswordAPI: string
    mailloginAPI?: string
    decriptAPI?: string
    TwoFactorLoginAPI?: string
};

export class AuthConfig {

    _param :AuthParam 

    constructor(param: AuthParam) {
        this._param = param;
    }

    signOut() {
	    window.localStorage.removeItem(this._param.tokenKey);
	    window.localStorage.clear();
    }

    public saveToken(token: string) {
	    if (!token) return;
	    window.localStorage.removeItem(this._param.tokenKey);
	    window.localStorage.setItem(this._param.tokenKey,  token);
    }

    public get token(): string {
	    return localStorage.getItem(this._param.tokenKey);
    }

    public get param(): AuthParam {
        return this._param;
    }
}
