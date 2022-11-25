import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn,AfterLoad, BeforeUpdate, Index } from 'typeorm';
import { Contains, IsInt, Length, IsEmail, IsFQDN, IsDate, Min, Max } from 'class-validator';
import * as crypto from 'crypto';

import { AuthUser, UserRole, AuthType} from '../dto.users';
import { PSAuthTarget } from './authTargets.entity';
import { encryptPassword, makeSalt } from '../../auth/auth.service';

@Entity('AuthUsers')
@Index(['email', 'target'], { unique: true })
@Index(['userid', 'target'], { unique: true })
export class PSAuthUser implements AuthUser {
    @PrimaryGeneratedColumn()
    _id: number

    @Column({ length: 256 })
    @IsEmail()
    email: string

    @Column({ length: 16})
    userid: string
    
    @Column({ length: 64, nullable: true })
    name?: string

    @Column({ length: 128, nullable: true })
    password?: string

    @Column({ length: 16, nullable: true })
    salt?: string

    @Column('datetime', { nullable: true })
    passwordUpdated?: Date

    @Column({ length: 8, nullable: true })
    authType?: AuthType

    @Column({ nullable: true })
    authID?: string

    @Column({ nullable: true })
    authToken?: string

    @Column({default: UserRole.MEMBER, nullable: true  })
    role?: UserRole

    @ManyToOne(() => PSAuthTarget, (target) => target.users )
    @JoinColumn({ name: 'targetId' })
    target: PSAuthTarget
    
    private tempPassword: string
    @AfterLoad()
    private loadTempPassword(): void {
        this.tempPassword = this.password;
    }

    @BeforeUpdate()
    private changePasswordHook() {
        if (this.tempPassword !== encryptPassword(this.password, this.salt)
            || (!this.tempPassword && this.password)) {
            this.updatePassword();
        }
    }

    authenticate(password: string) {
        return this.password === encryptPassword(password, this.salt);
    }

    resetPassword() {
        this.salt = null;
        this.password = null;
    }

    validatePresenceOf(value) {
        return value && value.length;
    }

    updatePassword() {
        // Handle new/update passwords
        if (this.password) {
            if (!this.validatePresenceOf(this.password)) {
                throw new Error('Invalid password');
            }
            this.salt = makeSalt();
            this.password = encryptPassword(this.password, this.salt);
        }
    }
}
