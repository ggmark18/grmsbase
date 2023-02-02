import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn,AfterLoad, BeforeUpdate, Index } from 'typeorm'
import { Contains, IsInt, Length, IsEmail, IsFQDN, IsDate, Min, Max } from 'class-validator'

import { checkStatus } from '@grms/common/auth';
import { WebSocketSubscriber } from '@grms/common/socket/WebSocketSubscriber';
import { AuthInfo, AuthUser, AuthRole} from '@grms/common/auth/dto'
import { User, UserMixIn, Entities } from '@grms/common/users/dto'
import { PSAuthInfo } from '@grms/common/auth/entities/authInfo.entity'

@Entity('Users')
@Index(['email'], { unique: true })
@Index(['loginid'], { unique: true })
export class PSUser implements User {
    @PrimaryGeneratedColumn()
    _id: number

    @Column({ length: 256, nullable: true })
    @IsEmail()
    email?: string

    @Column({ length: 16, nullable: true})
    loginid?: string
    
    @Column({ length: 64, nullable: true })
    name?: string

    @Column({ length: 8, default: AuthRole.MEMBER, nullable: true  })
    role?: AuthRole

    @Column('json', { nullable: true })
    profiles: string

    @ManyToOne(() => PSAuthInfo )
    @JoinColumn({ name: 'authId' })
    auth: PSAuthInfo

}

export class PSUsersSubscriber extends WebSocketSubscriber<UserMixIn> {
    get entityName() { return Entities.User; }
    entityClass() { return PSUser; }
    sliceEntity(entity) {
        const { auth, ...user } = entity;
        return { ...user, passwordUpdated: auth?.passwordUpdated, status: checkStatus(user, auth) };
    }
}

