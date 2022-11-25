import { Injectable } from '@nestjs/common';
import { UserStatus, AuthUser } from '../users/dto.users';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as CryptoJS from "crypto-js";
import * as crypto from 'crypto';
//import { toDataURL } from 'qrcode';
import * as QRCode from 'qrcode';
import { sendmail } from '../tools/mailtool';
import { authenticator } from 'otplib';
import { DecodeInfo, LoginInfo, LoginError } from './dto.auth';
import { PSAuthUser } from '../users/entities/authUsers.entity';
import { toTimeString, toDate, calcDays } from '../tools/formats/date';

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
        )
        .toString('base64');
}

export function makeSalt() {
    const byteSize = 16;
    return crypto.randomBytes(byteSize).toString('base64').substring(0,byteSize);
}


@Injectable()
export class AuthService {
    constructor(
        private jwtService: JwtService,
        private config: ConfigService,
    ) {}

    validatePassword(user: AuthUser, pass: string) {
        return user.password === encryptPassword(pass, user.salt);
    }

    async mailLogin(user: AuthUser, passwordString: string, status: UserStatus, locale: string) {
        let now = new Date();

        let subject = this.config.get('serviceName');
        subject += ' Login Information'
        
        let url= this.config.get('hostUrl');
        let encripted = encodeURIComponent(CryptoJS.AES.encrypt(passwordString, user.salt).toString());

        let termsec = this.config.get('mailLoginTermSec');
        let termEnd = new Date(now.getTime()+termsec*1000);
        let termMin = termsec/60;

        if ( locale != "-" ) url += `/${locale}`;

        let content;

        if( locale == 'en' ) {
            content = `Dear ${user.name},\n\nPlease login with a following url.\n`;
            content += `${url}/login?mode=${status}&id=${user._id}&val=${encripted}`;
            content += `\nValid time period：${termMin} minutes, till ${toTimeString(termEnd)}`;
            content += '\n\nAbove URL include encrypted login information.';
            content += '\nDelete this email soon after login operation.';
            content += "\If you don't know the reason to have this email,";
            content += "let the administorator know you have recieved this email.";
        } else {
            content = `${user.name}さん\n\n以下のリンクからログインしてください。\n`;
            content += `${url}/login?mode=${status}&id=${user._id}&val=${encripted}`;
            content += `\n有効時間：${termMin}分間　${toTimeString(termEnd)}迄`;
            content += '\n\n上記URLは、暗号化されたログイン情報を含んでいます。';
            content += '\nログイン後は、直ぐにこのメールを削除してください。';
            content += '\nまた、このメールに心当たりのない方は、直ぐに管理者に報告してください。';
        }

        let mailcontents = {
            from: this.config.get('mail.adminAddress'),
            to: user.email,
            subject: subject,
            text: content
        }
        await sendmail( this.config.get('mail'), mailcontents);
    }

    async decodeInfo(user: PSAuthUser, key: string) : Promise<DecodeInfo> {
        let bytes = CryptoJS.AES.decrypt(key, user.salt);
        let decripted = bytes.toString(CryptoJS.enc.Utf8);

        if ( !user.authenticate(decripted) ) {
            return { error: LoginError.MISMATCH, userid: user.userid }; // this serious probem, maybe huck, so inform admin
        }
        let now = new Date();
        let termsec = this.config.get('mailLoginTermSec');
        let difftime = now.getTime() - user.passwordUpdated.getTime()
        if ( difftime > termsec*1000 ) {
            return { error: LoginError.TIMEOVER, userid: user.userid }; 
        }
        return { salt: user.salt, userid: user.userid }
    }

    async login(user: Partial<AuthUser>) : Promise<LoginInfo> {
        const payload = { _id: user._id, name: user.name, role: user.role, userid: user.userid, target: user.target.name };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }

    async loginWith2fa(user: Partial<AuthUser>) {
        const payload = { _id: user._id, name: user.name, role: user.role, userid: user.userid, target: user.target.name,
                          isTwoFactorAuthenticated: true};
        return {
            access_token: this.jwtService.sign(payload),
        };
    }

    async generateTFAuthSecret(appname: string, user: AuthUser) {
        const secret = authenticator.generateSecret();

        const otpAuthUrl = authenticator.keyuri(
            user.userid,
            appname,
            secret,
        );

        return {
            secret,
            otpAuthUrl,
        };
    }

    async generateQrCodeURL(otpAuthUrl: string) {
        return QRCode.toDataURL(otpAuthUrl);
    }

    isTFAuthCodeValid(twoFactorAuthenticationCode: string, user: AuthUser) {
        return authenticator.verify({
            token: twoFactorAuthenticationCode,
            secret: user?.authToken,
        });
    }
}    

