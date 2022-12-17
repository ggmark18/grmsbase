export enum AuthType {
    Password = 'PW',
    TwoFactor = 'TF'
}

export enum AuthStatus {
    NONE    = "None",
    ENTRY   = "Entry",
    INITIAL = "Initial",
    SIGNUP  = "Signup",
}

export enum AuthRole {
    ADMIN = 'admin',
    MEMBER = 'member',
    GURST = 'gurst',
}

export interface AuthTarget {
    _id: number
    name: string
    description?: string
}

export interface AuthInfo {
    _id: number
    salt?: string
    authType?: AuthType
    authKey?: string
    authToken?: string
    password?: string
    passwordUpdated?: Date
    initial?: boolean
    target: AuthTarget
}

export interface AuthUser {
    _id: number
    loginid?: string
    email?: string
    name?: string
    role?: AuthRole
}
export interface Payload {
    userid: number,
    role: AuthRole,
    authid: number,
    target: string,
    isTwoFactorAuthenticated?: boolean
}

export interface DecodeInfo {
    loginid?: string
    salt?: string
    error?: string
}

export interface LoginInfo {
    access_token: string,
    twofactor_id?: string
}

export interface ChangePassword {
    userid: string
    password: string
}
export enum LoginError {
    UNINITIAL='uninitial',
    MISMATCH= 'mismatch',
    TIMEOVER= 'timeover',
    EXPIRED = 'expired',
    BADTOKEN = 'badtoken'
}
