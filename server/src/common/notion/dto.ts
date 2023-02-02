export declare const enum CreatePageType {
    POST = 'post'
}

export declare const enum NotionPostStatus {
    LIVE = 'Live',
    ENTRY = 'Entry',
    PUBLISH = 'Publish',
    DENIED = 'Denied',
}

export declare const enum NotionPageType {
    TOP = 'Top',
    POSTS = 'Posts',
    ARTICLE = 'Article',
    POST_ADMIN = 'PSTAdmin',
}


export interface NotionDashboard {
    _id: number
    secret: string
    pageid: string
    title?: string
    pages: NotionPage[]
}

export interface NotionPage {
    _id: number
    pageid: string
    type: NotionPageType

    description?: string
    dashboard: NotionDashboard
    control?: NotionPostControl
    parent?: NotionPage
    children: NotionPage[]
}

export interface NotionPostCategory {
    _id: number
    title: string
    control: NotionPostControl
}

export interface NotionPostControl {
    _id: number
    title: string
    name: string
    icon?: string
    pages: NotionPage[]
    posts: NotionPost[]
    categories: NotionPostCategory[]
}

export interface NotionPost {
    blockid: string
    status?: NotionPostStatus
    category?: string
    title?: string
    writer?: string
    blocks: NotionBlock[]
    page: NotionPage
    control: NotionPostControl
    updatedAt?: Date
}

export interface NotionBlock {
    blockid: string
    type: string
    context?: any
    blocks?: NotionBlock[]
    post: NotionPost
}

export interface NotionPostDigest {
    thumbnail: NotionBlock
    paragraph: NotionBlock
}

export declare const enum NotionDashboardPageOperation {
    CREATE,
    UPDATE,
    DELETE
}

export interface NotionDashboardPageParam {
    controlid: number
    dashboardid: number
    pageid?: number
    blockid?: string
    operation: NotionDashboardPageOperation
}









