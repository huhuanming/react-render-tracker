import { Message, TransferFiber, TransferFiberContext, TransferChangeDiff, TransferPropChange, TransferStateChange, TransferMemoChange, TransferHookInfo } from "common-types";
export declare type LocType = "default" | "jsx";
export declare type SourceEvent = Message;
export declare type LinkedEvent = CommitEvent | FiberEvent;
export declare type SourceCommitEvent = Extract<SourceEvent, {
    op: "commit-start";
}>;
export declare type SourceDefEvent = Extract<SourceEvent, {
    op: "fiber-type-def";
}>;
export declare type SourceFiberEvent = Exclude<SourceEvent, SourceCommitEvent | SourceDefEvent>;
export declare type FiberTypeHook = Omit<TransferHookInfo, "context"> & {
    index: number;
    context: TransferFiberContext | null;
};
export declare type FiberTypeDef = {
    contexts: TransferFiberContext[] | null;
    hooks: FiberTypeHook[];
};
export declare type FiberChanges = {
    props?: TransferPropChange[] | null;
    context: FiberContextChange[] | null;
    state?: FiberStateChange[] | null;
    memos?: TransferMemoChange[] | null;
    warnings: Set<TransferPropChange | FiberStateChange> | null;
};
export declare type FiberContextChange = {
    context: TransferFiberContext | null;
    prev?: string;
    next?: string;
    diff?: TransferChangeDiff;
};
export declare type FiberStateChange = Omit<TransferStateChange, "hook"> & {
    hook: FiberTypeHook | null;
};
export interface MessageFiber extends TransferFiber {
    displayName: string;
    typeDef: FiberTypeDef;
    mounted: boolean;
    leaked: number;
    leakedHooks: number[] | null;
    events: FiberEvent[];
    updatesCount: number;
    updatesBailoutCount: number;
    updatesBailoutStateCount: number;
    selfTime: number;
    totalTime: number;
    warnings: number;
}
export interface CommitEvent {
    target: "commit";
    targetId: number;
    event: Extract<SourceEvent, {
        op: "commit-start";
    }>;
    trigger: null;
}
export interface FiberEvent {
    target: "fiber";
    targetId: number;
    event: SourceFiberEvent;
    changes: FiberChanges | null;
    trigger: LinkedEvent | null;
    triggeredByOwner: boolean;
}
export interface ValueTransition {
    prev?: any;
    next?: any;
}
export interface Commit {
    commitId: number;
    start: CommitEvent;
    finish: LinkedEvent | null;
    events: Message[];
}
