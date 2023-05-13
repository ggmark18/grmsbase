import { AuthUser } from '../auth/dto';

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

export declare const enum PostReputationType {
    LIKE,
    SORRY,
    CHEER,
    LOVE,
}

export declare const enum PostApproveType {
    WRITER = 'writer',
    ADMIN = 'admin',
    APPROVER = 'approver'
}

export declare const enum PostActiveStatus {
    ACTIVE = 'A',
    OUTOFDATE = 'O',
    MODAL = 'M',
}

export declare const enum PostType {
    COMMUNITY = 'C',
    GROUP = 'G',
    EVENT = 'E',
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
    icon?: string
    writerProfile?: string
    approveType?: PostApproveType
    numberOfApprover?: number
    activeDays?: number
    disabled: boolean
    pages: NotionPage[]
    posts: NotionPost[]
    categories: NotionPostCategory[]
}

export interface PostReputation {
    _id: number
    reputation?: PostReputationType
    comment?: string
    read: boolean
    post: NotionPost
    reputator: AuthUser
}

export interface PostApproveLog {
    _id: number
    status: NotionPostStatus
    comment?: string
    post: NotionPost
    approver: AuthUser
    createdAt: Date
}

export interface NotionPost {
    blockid: string
    status?: NotionPostStatus
    category?: string
    title?: string
    writer?: AuthUser
    postDate?: Date
    postType?: PostType
    activeStatus: PostActiveStatus
    blocks: NotionBlock[]
    page: NotionPage
    control: NotionPostControl
    reputations: PostReputation[]
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
    unread: boolean
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


export function statusToNotion(status:NotionPostStatus) {
    switch (status) {
        case NotionPostStatus.LIVE:
            return 'LIVE';
        case NotionPostStatus.PUBLISH:
            return '公開';
        case NotionPostStatus.DENIED:
            return '拒絶';
        case NotionPostStatus.ENTRY:
            return '作成';
        default:
            return '';
    }
}
export function notionToStatus(status:string) {
    switch (status) {
        case 'LIVE':
            return NotionPostStatus.LIVE;
        case '公開':
            return NotionPostStatus.PUBLISH;
        case '拒絶':
            return NotionPostStatus.DENIED;
        case '作成':
            return NotionPostStatus.ENTRY;
        default:
            return '';
    }
}











