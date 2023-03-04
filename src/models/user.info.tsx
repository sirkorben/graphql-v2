
export interface UserInfo {
    id?: number,
    login: string,
    level?: number,
    xp?: number,
}

export interface Progress {
    createdAt: string,
    isDone: boolean,
    path: string,
}

export interface Object {
    name: string,
}

export interface Transaction {
    amount: number,
    object: Object,
    path: string,
    type: string,
}