import { Entity, PrimaryGeneratedColumn, Column, OneToOne, OneToMany, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn, Timestamp} from 'typeorm'

import { PSAuthInfo } from './authInfo.entity'
import { AuthTarget } from '../dto'

@Entity('AuthTargets')
export class PSAuthTarget implements AuthTarget {
    @PrimaryGeneratedColumn()
    readonly _id: number

    @Column()
    name: string

    @Column({ nullable: true })
    description?: string

    @OneToMany(() => PSAuthInfo, (info) => info.target )
    users: PSAuthInfo[]

}
