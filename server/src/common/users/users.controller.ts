import { Controller, UseGuards, Param, Request, Get, Put, Post, Delete, Body, HttpCode, NotFoundException } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { JwtAdminGuard } from '../auth/jwt-admin.guard';
import { LocalAuthGuard } from '../auth/local-auth.guard';
import { PSAuthUser } from './entities/authUsers.entity';
import { UsersService } from './users.service';
import { AuthUser, UserInfo, AuthType } from './dto.users';

@Controller('api/users')
export class UsersController {
    constructor( private service: UsersService ){}

    @Get('checkType/:target/:uid')
    async getAuthType( @Param("uid") uid, @Param("target") target) : Promise<AuthType> {
        let user = await this.service.findByUID(uid, target);
        return user?.authType;
    }

    @Get('info/:target/:uid')
    async getUserInfo(@Param("uid") uid, @Param("target") target,) : Promise<UserInfo> {
        let user = await this.service.findByUID(uid, target);
        return { userid: user?.userid, email: user?.email, name: user?.name };
    }
    
    @UseGuards(JwtAuthGuard)
    @Get('me')
    async me(@Request() req) : Promise<AuthUser> {
        return await this.service.findByID(req.user._id);
    }

    @UseGuards(JwtAuthGuard)
    @Post('password')
    async changePassword(@Request() req, @Body() body: any ) : Promise<void> {
        const user = await this.service.findByID(req.user._id);
        if( !user ) throw new NotFoundException();
        user.password = body.password;
        user.passwordUpdated = new Date();
        await this.service.save(user);
    }

    @UseGuards(JwtAdminGuard)
    @Get('/:target')
    async getAllUsers( @Param("target") target) : Promise<AuthUser[]>{
        return await this.service.getAllUsers(target);
    }

    @UseGuards(JwtAdminGuard)
    @Put(':id')
    async update(@Param("id") id, @Body() user: Partial<AuthUser>) : Promise<AuthUser>{
        const origin = await this.service.findByID(id);
        if (!origin) throw new NotFoundException();
        let {_id, ...attributes} = user;
        const updated = Object.assign(origin, attributes);
        return await this.service.save(updated);
    }

    @UseGuards(JwtAdminGuard)
    @Post('')
    async insert(@Body() user: Partial<AuthUser> ) : Promise<AuthUser>{
        return await this.service.insert(user);
    }

    @UseGuards(JwtAdminGuard)
    @Delete(':id')
    async remove( @Param("id") id ) : Promise<void> {
        let user = await this.service.findByID(id);
        if( !user ) throw new NotFoundException();
        await this.service.remove(user);
    }
}
