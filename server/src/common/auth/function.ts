import { AuthUser, AuthInfo, AuthStatus } from './dto';
import { authenticator } from 'otplib';
import * as crypto from 'crypto';

export function encryptPassword(password, salt) {
    if (!password || !salt) {
        return null;
    }
    const defaultIterations = 10000;
    const defaultKeyLength = 64;
    const base64salt = new Buffer(salt, 'base64');
    return crypto
        .pbkdf2Sync(
            password,
            base64salt,
            defaultIterations,
            defaultKeyLength,
            'SHA1',
        ).toString('base64');
}

export function makeSalt() {
    const byteSize = 16;
    return crypto.randomBytes(byteSize).toString('base64').substring(0,byteSize);
}

export function validatePassword(auth: AuthInfo, pass: string) {
    return auth.password === encryptPassword(pass, auth.salt);
}

export function isTFAuthCodeValid(twoFactorAuthenticationCode: string, auth: AuthInfo) {
    return authenticator.verify({
        token: twoFactorAuthenticationCode,
        secret: auth?.authToken,
    });
}

export function generateTFAuthSecret(appname: string, loginid: string) {
    const secret = authenticator.generateSecret();
    const otpAuthUrl = authenticator.keyuri(
        loginid,
        appname,
        secret,
    );
    return {
        secret,
        otpAuthUrl,
    };
}

export function checkStatus( user: AuthUser, auth: AuthInfo ) {
    let status = AuthStatus.NONE;
    if( user ) {
        status = AuthStatus.ENTRY;
        if( auth ) {
            status = ( auth.initial ) ? AuthStatus.INITIAL : AuthStatus.SIGNUP;
        }
    }
    return status;
}


