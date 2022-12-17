export interface ProfileFormat {
    key: string
    title: string
    prefix: string
    postfix: string
    show: string
}
export interface Profiles {
    attributes: ProfileFormat[]
}

export { ProfileForm } from './profile.form';
