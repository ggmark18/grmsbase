import { Controller, UseGuards, Param, Request, Response, Get, Put, Post, Delete, Body, HttpCode,
         ForbiddenException, NotFoundException } from '@nestjs/common';
import { AuthService } from '@grms/common/auth/auth.service';
import { checkStatus } from '@grms/common/auth/auth.function';
import { AuthType, AuthStatus, ChangePassword, LoginError } from '@grms/common/auth/dto.auth';

import { JwtAuthGuard } from './authGuards/jwt-auth.guard';
import { JwtAdminGuard } from './authGuards/jwt-admin.guard';
import { LocalAuthGuard } from './authGuards/local-auth.guard';
import { UsersService } from './users.service';
import { User, UserMixIn, targetName } from './dto.users';

@Controller('api/users')
export class UsersController {
    constructor( private usersService: UsersService,
                 private authService: AuthService ){}

    // AuthConfig APIs
    @Get('signupCheck/:loginid')
    async signupCheck( @Param('loginid') loginid ) {
        const user = await this.usersService.findByLoginID( loginid );
        return checkStatus(user,user.auth);
    }
    @Get('checkType/:loginid')
    async getAuthType( @Param("loginid") loginid) : Promise<AuthType> {
        let user = await this.usersService.findByLoginID( loginid );
        return user?.auth.authType;
    }
    @Get('maillogin/:loginid/:locale')
    async mailLogin( @Param('loginid') loginid, @Param('locale') locale ) : Promise<AuthStatus>{
        const user = await this.usersService.findByLoginID( loginid ) ;
        return await this.authService.passwordResetByMail(user, user.auth, loginid, locale);
    }
    @Post('maillogin/decode')
    async decodeInfo( @Request() req ) {
        const user = await this.usersService.findByID(req.body.id);
        return await this.authService.decodeInfo(user.auth, req.body.loginid, req.body.key);
    }
    @UseGuards(LocalAuthGuard)
    @Post('login')
    login(@Request() req) {
        return this.authService.login(req.user, req.user.auth);
    }
    @UseGuards(JwtAuthGuard)
    @Post('2fa/generate')    
    async register(@Response() response, @Request() request) {
        const user = await this.usersService.findByID(request.user._id);
        return response.json(
            await this.authService.generateQRCode(targetName, user.loginid, user.auth),
        );
    }
    @UseGuards(JwtAuthGuard)
    @Post('2fa/turn-on')
    async turnOnTwoFactorAuthentication(@Request() req, @Body() body) {
        const user = await this.usersService.findByID(body._id);
        await this.authService.turnOnTFAuth(user.auth, body.twoFactorAuthenticationCode);
    }
    @Post('2fa/authenticate')
    @UseGuards(JwtAuthGuard)
    async authenticate(@Request() req, @Body() body) {
        const user = await this.usersService.findByID(body._id);
        return this.authService.loginWith2fa(user, user.auth, body.twoFactorAuthenticationCode);
    }
    @UseGuards(JwtAuthGuard)
    @Get('me')
    async me(@Request() req) : Promise<User> {
        return await this.usersService.findByID(req.user._id);
    }
    @UseGuards(JwtAuthGuard)
    @Post('password')
    async changePassword(@Request() req, @Body() body: ChangePassword ) : Promise<void> {
        const user = await this.usersService.findByID(req.user._id);
        if( req.user._id != user._id ) throw new ForbiddenException();
        if( !user ) throw new NotFoundException();
        await this.authService.changePassword(user.auth, body.password);
    }

    // Users API
    @UseGuards(JwtAdminGuard)
    @Get('')
    async getAllUsers() : Promise<UserMixIn[]>{
        let users =  await this.usersService.getAllUsers();
        let mixins = [];
        for( let user of users ) {
            mixins.push({ ...user,
                          passwordUpdated: user.auth?.passwordUpdated,
                          status: checkStatus(user, user.auth) })
        }
        return mixins;
    }

    @UseGuards(JwtAdminGuard)
    @Put(':id')
    async update(@Param("id") id, @Body() user: Partial<User>) : Promise<User>{
        const origin = await this.usersService.findByID(id);
        if (!origin) throw new NotFoundException();
        let {_id, ...attributes} = user;
        const updated = Object.assign(origin, attributes);
        return await this.usersService.save(updated);
    }

    @UseGuards(JwtAdminGuard)
    @Post('')
    async insert(@Body() user: Partial<User> ) : Promise<User>{
        return await this.usersService.insert(user);
    }

    @UseGuards(JwtAdminGuard)
    @Delete(':id')
    async remove( @Param("id") id ) : Promise<void> {
        let user = await this.usersService.findByID(id);
        if( !user ) throw new NotFoundException();
        await this.usersService.remove(user);
    }
}
