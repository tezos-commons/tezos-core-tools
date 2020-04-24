export interface ContractCall {
    entrypoint: string,
    value: any[]
}

export interface ContractOrigination {
    code: any[],
    storage: any
}