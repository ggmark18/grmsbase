import { Entity, PrimaryGeneratedColumn, Column, OneToOne, OneToMany, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn, Timestamp} from 'typeorm'

import { PSAuthUser } from './authUsers.entity'
import { AuthTarget } from '../dto.users'

@Entity('AuthTargets')
export class PSAuthTarget implements AuthTarget {
    @PrimaryGeneratedColumn()
    readonly _id: number

    @Column()
    name: string

    @Column({ nullable: true })
    description: string

    @OneToMany(() => PSAuthUser, (user) => user.target )
    users: PSAuthUser[]

}
