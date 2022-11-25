import { Injectable, ConflictException } from '@nestjs/common';
import { PSAuthUser } from './entities/authUsers.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import config from '../../config.base';
import { AuthUser, UserServiceError, AuthType } from './dto.users';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(PSAuthUser,'sqldb')
        private readonly userRepository: Repository<PSAuthUser>,
    ) {}

    async findAuthUser(userid: string, target: string): Promise<PSAuthUser | undefined> {
        return await this.userRepository.findOne({
            select: ['_id', 'password','name','role','salt','passwordUpdated','userid'],
            relations: { target: true },
            where: { userid: userid, target: { name: target } },
        });
    }

    async getAllUsers(target:string) : Promise<AuthUser[]> {
        return await this.userRepository.find({
            select: ['_id', 'userid','email','name','role','passwordUpdated'],
            relations: { target: true },
            where : { target: { name: target }}
        });
    }

    async findByID(id: any): Promise<PSAuthUser | undefined> {
        return await this.userRepository.findOne({
            relations: { target: true },
            where: {_id: id} });
    }

    async findByUID(uid: any, target: string ): Promise<PSAuthUser | undefined> {
        return await this.userRepository.findOne({
            relations: { target: true },
            where : { userid: uid, target: { name: target }}
        });
    }
    
    async insert(user: Partial<AuthUser> ) : Promise<AuthUser> {
        let {_id, ...attributes} = user;
        return await this.save(attributes);
    }
    
    async save( user: Partial<AuthUser> ) : Promise<AuthUser> {
        return await this.userRepository.save(user);
    }

    async remove( user: PSAuthUser ) : Promise<void>{
        await this.userRepository.remove(user);
    }

    async setTFAuthSecret( id, secret ) {
        let user = await this.userRepository.findOne(id);
        if( user ) {
            user.authToken = secret;
            await this.userRepository.save(user);
        }
    }
    async turnOnTFAuth(id) {
        let user = await this.userRepository.findOne(id);
        if( user ) {
            user.authType = AuthType.TwoFactor;
            await this.userRepository.save(user);
        }
    }

}
