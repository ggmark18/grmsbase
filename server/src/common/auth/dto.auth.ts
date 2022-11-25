export const serviceName = 'GRMSBase'

export enum LoginError {
    UNINITIAL='uninitial',
    MISMATCH= 'mismatch',
    TIMEOVER= 'timeover',
    EXPIRED = 'expired',
    BADTOKEN = 'badtoken'
}

export interface DecodeInfo {
    userid: string
    salt?: string
    error?: string
}

export interface LoginInfo {
    access_token: string
}
