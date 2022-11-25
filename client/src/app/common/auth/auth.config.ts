import { Injectable } from '@angular/core';

import { serviceName } from '@api-dto/common/auth/dto.auth';

export interface AuthParam {
    tokenKey: string

    serviceName: string
    loginAPI: string
    signupCheckAPI?: string
    mailloginAPI?: string
    decriptAPI?: string
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

@Injectable()
export class DefaultAuthConfig extends AuthConfig {
    constructor() {
        super({
            serviceName: serviceName,
            tokenKey: 'GRMSBaseTokenKey',
            loginAPI: '/api/auth/login',
        });
    }
}
