// Profiles
export declare const enum ProfileType {
    String = "string",
    Date = "date",
    YearMonth = "yearMonth"
}
    
export interface ProfileFormat {
    key: string
    title: string
    prefix: string
    postfix: string
    show: string
    alwaysPrefix: string
    alwaysPostfix: string
    type: ProfileType
}

export interface Profiles {
    attributes: ProfileFormat[]
}









