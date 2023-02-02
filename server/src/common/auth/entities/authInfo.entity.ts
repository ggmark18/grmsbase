import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn,AfterLoad, BeforeInsert, BeforeUpdate, Index } from 'typeorm';
import { Contains, IsInt, Length, IsEmail, IsFQDN, IsDate, Min, Max } from 'class-validator';
import * as crypto from 'crypto';

import { AuthInfo, AuthRole, AuthType} from '../dto';
import { PSAuthTarget } from './authTargets.entity';
import { encryptPassword, makeSalt } from '../function';

@Entity('AuthInfo')
export class PSAuthInfo implements AuthInfo {
    @PrimaryGeneratedColumn()
    _id: number

    @Column({ length: 128, nullable: true })
    password?: string

    @Column({ length: 16, nullable: true })
    salt?: string

    @Column('datetime', { nullable: true })
    passwordUpdated?: Date

    @Column({ length: 8, nullable: true })
    authType?: AuthType

    @Column({ nullable: true })
    authKey?: string

    @Column({ nullable: true })
    authToken?: string

    @Column({ nullable: true })
    initial?: boolean

    @ManyToOne(() => PSAuthTarget, (target) => target.users )
    @JoinColumn({ name: 'targetId' })
    target: PSAuthTarget
    
    private tempPassword: string
    @AfterLoad()
    private loadTempPassword(): void {
        this.tempPassword = this.password;
    }
    @BeforeInsert()
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
