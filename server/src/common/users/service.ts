import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import config from '@grms/config.base';
import { User, UserMixIn, targetName } from './dto';
import { AuthType } from '../auth/dto';
import { PSUser } from './entities/users.entity';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(PSUser,'sqldb')
        private readonly userRepository: Repository<PSUser>,
    ) {}

    async getAllUsers() : Promise<PSUser[]> {
        return await this.userRepository.find({ relations: { auth: true }});
    }

    async findByID(id: any): Promise<PSUser | undefined> {
        return await this.userRepository.findOne({
            relations: { auth: true },
            where: {_id: id} });
    }

    async findByLoginID(loginid: string ): Promise<PSUser | undefined> {
        return await this.userRepository.findOne({
            relations: { auth: { target: true } },
            where : { loginid: loginid, auth: {target: { name: targetName }}}
        });
    }
    
    async insert(user: Partial<PSUser> ) : Promise<User> {
        let {_id, ...attributes} = user;
        return await this.save(attributes);
    }
    
    async save( user: Partial<PSUser> ) : Promise<User> {
        const { auth, ...saved } = await this.userRepository.save(user);
        return saved;
    }

    async remove( user: PSUser ) : Promise<void>{
        await this.userRepository.remove(user);
    }
}
