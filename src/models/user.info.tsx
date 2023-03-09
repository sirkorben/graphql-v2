
export interface UserInfo {
    id?: number,
    login?: string,
    level?: number,
    xp?: number,
    auditRatio?: string,
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
    object?: Object,
    path?: string,
    type?: string,
    createdAt: string
}

export interface AuditTransactions {
    upTransactions: Transaction[],
    downTransactions: Transaction[],
    labels?: string[],
}