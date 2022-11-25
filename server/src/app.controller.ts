import { Controller, Request, Response, Get, Post, UseGuards, Param , Res, Body, HttpCode, HttpException, HttpStatus}  from '@nestjs/common';
import { LocalAuthGuard } from './common/auth/local-auth.guard';
import { JwtAuthGuard } from './common/auth/jwt-auth.guard';

import { LoginError } from './common/auth/dto.auth';
import { AuthService, makeSalt } from './common/auth/auth.service';
import { UsersService } from './common/users/users.service';
import { UserStatus } from './common/users/dto.users';

@Controller('api/auth')
export class AppController {
    constructor(private authService: AuthService,
                private usersService: UsersService) {}

    @Get('signupCheck/:target/:userid')
    async signupCheck( @Param('userid') userid, @Param('target') target ) {
        let status = UserStatus.NONE;
        const user = await this.usersService.findByUID( userid,target);
        if( user ) {
            if( user.password ) {
                status = UserStatus.SIGNUP;
            } else {
                status = UserStatus.ENTRY;
            }
        }
        return status;
    }
    
    @Get('maillogin/:target/:userid/:locale')
    async mailLogin( @Param('userid') userid, @Param('locale') locale, @Param('target') target ) {
        let status = UserStatus.NONE;
        const user = await this.usersService.findByUID( userid, target);
        if( user ) {
            let now = new Date();
            if( user.password ) {
                status = UserStatus.RESET;
            } else {
                status = UserStatus.SIGNUP;
            }
            let passwordString = makeSalt();
            user.password = passwordString;
            user.passwordUpdated = now;
            await this.usersService.save(user);
            await this.authService.mailLogin(user, passwordString, status, locale);
        }
        return { status };
    }

    @Post('maillogin/decode')
    async decodeInfo( @Request() req ) {
        const key = req.body.key;
        const user = await this.usersService.findByID(req.body.id);
        let info = await this.authService.decodeInfo(user, key);
        return info;
    }

    @UseGuards(LocalAuthGuard)
    @Post('login')
    login(@Request() req) {
        return this.authService.login(req.user);
    }

    @Post('2fa/generate')
    @UseGuards(JwtAuthGuard)
    async register(@Response() response, @Request() request) {
        const { secret, otpAuthUrl } =
            await this.authService.generateTFAuthSecret(
                request.authAppName,
                request.user
            );
        await this.usersService.setTFAuthSecret(
            request.user._id,
            secret
        );
        return response.json(
            await this.authService.generateQrCodeURL(otpAuthUrl),
        );
    }

    @Post('2fa/turn-on')
    @UseGuards(JwtAuthGuard)
    async turnOnTwoFactorAuthentication(@Request() req, @Body() body) {
        const user = await this.usersService.findByID(body._id);
        const isCodeValid =
            this.authService.isTFAuthCodeValid(
                body.twoFactorAuthenticationCode,
                user,
            );
        if (!isCodeValid) {
            throw new HttpException(LoginError.BADTOKEN, HttpStatus.UNAUTHORIZED);
        }
        await this.usersService.turnOnTFAuth(user._id);
    }

    @Post('2fa/authenticate')
    @HttpCode(200)
    @UseGuards(JwtAuthGuard)
    async authenticate(@Request() req, @Body() body) {
        const user = await this.usersService.findByID(body._id);
        const isCodeValid = this.authService.isTFAuthCodeValid(
            body.twoFactorAuthenticationCode,
            user,
        );
        if (!isCodeValid) {
            throw new HttpException(LoginError.BADTOKEN,HttpStatus.UNAUTHORIZED);
        }
        return this.authService.loginWith2fa(user);
    }
}
