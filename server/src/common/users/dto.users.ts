export enum UserServiceError {
    CONFLICT = 'Conflict'
}

export enum AuthType {
    Password = 'PW',
    TwoFactor = 'TF'
}

export enum UserStatus {
    NONE = 'None',
    ENTRY = 'Entry',
    SIGNUP = 'SignUp',
    RESET = 'Reset'
}

export enum UserRole {
    ADMIN = 'admin',
    MEMBER = 'member',
}

export interface AuthTarget {
    _id: number
    name: string
    description?: string
}

export interface AuthUser {
    _id: number
    userid?: string
    name?: string
    email?: string
    salt?: string
    authType?: AuthType
    authID?: string
    authToken?: string
    password?: string
    passwordUpdated?: Date
    role?: UserRole
    target: AuthTarget
}

export interface UserInfo {
    userid: string
    email: string
    name: string
}
