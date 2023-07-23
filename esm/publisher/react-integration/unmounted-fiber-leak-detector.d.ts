import { TrackingObjectType } from "common-types";
import { Fiber, MemoryLeakDetectionApi, RecordEventHandler, TrackingObject } from "../types";
import { ExposedToGlobalLeaksState } from "rempl";
export declare type ExposedLeaksStateSubscription = (state: ExposedToGlobalLeaksState | null) => void;
declare const WeakRefBase: WeakRefConstructor;
export declare class TrackingObjectWeakRef extends WeakRefBase<TrackingObject> {
    fiberId: number;
    type: TrackingObjectType;
    displayName: string | null;
    hookIdx: number | null;
    constructor(target: TrackingObject, fiberId: number, type: TrackingObjectType, displayName: string | null, hookIdx?: number | null);
    get tag(): string;
    get descriptor(): {
        fiberId: number;
        type: TrackingObjectType;
        hookIdx: number | null;
    };
    get alive(): boolean;
}
export declare function createUnmountedFiberLeakDetectionApi(recordEvent: RecordEventHandler, roots: Map<number, Fiber>, fiberToId: WeakMap<Fiber, number>): MemoryLeakDetectionApi & {
    trackObjectForLeaking: (target: TrackingObject, fiberId: number, type: TrackingObjectType, displayName: string | null, hookIdx: number | null) => void;
};
export {};
