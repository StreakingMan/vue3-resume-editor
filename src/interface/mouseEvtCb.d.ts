export interface MouseEvtInfo {
    clientX: number;
    clientY: number;
}

export interface MouseEvtCb {
    (info: MouseEvtInfo): void;
}
