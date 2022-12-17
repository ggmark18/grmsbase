import { AuthUser, AuthStatus } from '../auth/dto.auth';

export const targetName = 'GRMSBase'

export declare const enum Entities {
    User = "User"
}


export enum UserServiceError {
    CONFLICT = 'Conflict'
}

export interface User extends AuthUser {
    profiles?: string
}

export interface UserMixIn extends User {
    status: AuthStatus
    passwordUpdated?: Date
}
