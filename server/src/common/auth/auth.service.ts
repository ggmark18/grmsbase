import { Injectable, BadRequestException, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as CryptoJS from "crypto-js";

import * as QRCode from 'qrcode';
import { sendmail } from '../tools/mailtool';

import { AuthUser, AuthInfo, AuthType, DecodeInfo, Payload, AuthStatus, LoginInfo, LoginError } from './dto.auth';
import { PSAuthInfo } from './entities/authInfo.entity';
import { PSAuthTarget } from './entities/authTargets.entity';
import { toTimeString, toDate, calcDays } from '../tools/formats/date';
import { generateTFAuthSecret,
         isTFAuthCodeValid,
         makeSalt } from './auth.function';

@Injectable()
export class AuthService {
    constructor(
        private jwtService: JwtService,
        private config: ConfigService,
        @InjectRepository(PSAuthInfo,'sqldb')
        private readonly authRepository: Repository<PSAuthInfo>,
    ) {}

    async passwordResetByMail(user: AuthUser, auth: AuthInfo, loginid: string, locale: string) {
        if( !user ) return AuthStatus.NONE;
        if( !auth ) return AuthStatus.ENTRY;

        let passwordString = makeSalt();
        auth.password = passwordString;
        auth.passwordUpdated = new Date();
        auth.initial = true;
        await this.authRepository.save(auth);
        
        let now = new Date();
        let subject = this.config.get('serviceName');
        subject += ' Login Information'
        
        let url= this.config.get('hostUrl');
        let encripted = encodeURIComponent(CryptoJS.AES.encrypt(passwordString, auth.salt).toString());

        let termsec = this.config.get('mailLoginTermSec');
        let termEnd = new Date(now.getTime()+termsec*1000);
        let termMin = termsec/60;

        if ( locale != "-" ) url += `/${locale}`;

        let content;

        if( locale == 'en' ) {
            content = `Dear ${user.name},\n\nPlease login with a following url.\n`;
            content += `${url}/login?mode=email&id=${user._id}&val=${encripted}&loginid=${loginid}`;
            content += `\nValid time period：${termMin} minutes, till ${toTimeString(termEnd)}`;

            content += '\n\nAbove URL include encrypted login information.';
            content += '\nDelete this email soon after login operation.';
            content += "\If you don't know the reason to have this email,";
            content += "let the administorator know you have recieved this email.";
        } else {
            content = `${user.name}さん\n\n以下のリンクからログインしてください。\n`;
            content += `${url}/login?mode=email&id=${user._id}&val=${encripted}&loginid=${loginid}`;
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
        return AuthStatus.INITIAL;
    }

    async decodeInfo(auth: PSAuthInfo, id: string, key: string) : Promise<DecodeInfo> {
        if( !auth || !auth.initial ) throw new BadRequestException();
        let bytes = CryptoJS.AES.decrypt(key, auth.salt);
        let decripted = bytes.toString(CryptoJS.enc.Utf8);

        if ( !auth.authenticate(decripted) ) {
            return { error: LoginError.MISMATCH }; // this serious probem, maybe huck, so inform admin
        }
        let now = new Date();
        let termsec = this.config.get('mailLoginTermSec');
        let difftime = now.getTime() - auth.passwordUpdated.getTime()
        if ( difftime > termsec*1000 ) {
            return { error: LoginError.TIMEOVER }; 
        }
        return { salt: auth.salt, loginid: id }
    }

    async login(user: AuthUser, auth: AuthInfo) : Promise<LoginInfo> {
        return { access_token: this.jwtService.sign(this.makePayload(user,auth)) };
    }

    async loginWith2fa(user: AuthUser, auth: AuthInfo,  tfCode: string) : Promise<LoginInfo>{
        const isCodeValid = isTFAuthCodeValid( tfCode, auth ) ;
        if (!isCodeValid) {
            throw new HttpException(LoginError.BADTOKEN,HttpStatus.UNAUTHORIZED);
        }
        return { access_token: this.jwtService.sign(this.makePayload(user,auth)) };
    }

    private makePayload(user: AuthUser, auth: AuthInfo) : Payload {
        let twofactor = ( auth.authType == AuthType.TwoFactor );
        return { userid: user._id, role: user.role, authid: auth._id,
                 target: auth.target.name, isTwoFactorAuthenticated: twofactor};
    }

    async turnOnTFAuth(auth: AuthInfo, tfCode: string) {
        const isCodeValid = isTFAuthCodeValid( tfCode, auth ) ;
        if (!isCodeValid) {
            throw new HttpException(LoginError.BADTOKEN, HttpStatus.UNAUTHORIZED);
        }
        auth.authType = AuthType.TwoFactor;
        await this.authRepository.save(auth);
    }

    async changePassword(auth: AuthInfo, password: string ) : Promise<void> {
        auth.password = password;
        auth.passwordUpdated = new Date();
        await this.authRepository.save(auth);
    }

    async generateQRCode(appname: string, loginid: string, auth: Partial<AuthInfo>) {
        const { secret, otpAuthUrl } =
            await generateTFAuthSecret(
                appname,
                loginid
            );
        auth.authToken = secret;
        await this.authRepository.save(auth);
        return QRCode.toDataURL(otpAuthUrl);
    }

}    

