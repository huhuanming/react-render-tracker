/// <reference path="../../../src/common/types.d.ts" />
/// <reference path="../../../src/common/rempl.d.ts" />
import { ReactInternals, Fiber, NativeType, RecordEventHandler } from "../types";
export declare type CoreApi = ReturnType<typeof createIntegrationCore>;
export declare function createIntegrationCore(renderer: ReactInternals, recordEvent: RecordEventHandler): {
    ReactTypeOfSideEffect: {
        DidCapture: number;
        NoFlags: number;
        PerformedWork: number;
        Placement: number;
        Incomplete: number;
    };
    ReactTypeOfWork: {
        CacheComponent: number;
        ClassComponent: number;
        ContextConsumer: number;
        ContextProvider: number;
        CoroutineComponent: number;
        CoroutineHandlerPhase: number;
        DehydratedSuspenseComponent: number;
        ForwardRef: number;
        Fragment: number;
        FunctionComponent: number;
        HostComponent: number;
        HostPortal: number;
        HostRoot: number;
        HostText: number;
        IncompleteClassComponent: number;
        IndeterminateComponent: number;
        LazyComponent: number;
        LegacyHiddenComponent: number;
        MemoComponent: number;
        Mode: number;
        OffscreenComponent: number;
        Profiler: number;
        ScopeComponent: number;
        SimpleMemoComponent: number;
        SuspenseComponent: number;
        SuspenseListComponent: number;
        YieldComponent: number;
    };
    ReactPriorityLevels: {
        ImmediatePriority: number;
        UserBlockingPriority: number;
        NormalPriority: number;
        LowPriority: number;
        IdlePriority: number;
        NoPriority: number;
    };
    getElementTypeForFiber: (fiber: Fiber) => import("common-types").FiberType;
    getFiberTypeId: (type: any, tag: number) => number;
    getOrGenerateFiberId: (fiber: Fiber) => number;
    getFiberIdThrows: (fiber: Fiber) => number;
    getFiberIdUnsafe: (fiber: Fiber) => number | null;
    getFiberById: (id: number) => Fiber | null;
    getFiberOwnerId: (fiber: Fiber) => number;
    removeFiber: (fiber: Fiber, refs?: {
        stateNode: unknown;
        alternate: Fiber | null;
        memoizedState: Fiber["memoizedState"];
    }) => void;
    getDisplayNameForFiber: (fiber: Fiber) => string | null;
    getDisplayNameForRoot: (fiber: Fiber) => string;
    isFiberRoot: (fiber: Fiber) => boolean;
    setRootPseudoKey: (id: number, fiber: Fiber) => void;
    getRootPseudoKey: (id: number) => any;
    removeRootPseudoKey: (id: number) => void;
    didFiberRender: (prevFiber: Fiber, nextFiber: Fiber) => boolean;
    shouldFilterFiber: (fiber: Fiber) => boolean;
    findFiberByHostInstance: (hostInstance: NativeType) => Fiber | null;
    memoryLeaksApi: {
        getLeakedObjectsProbe: () => {
            readonly objects: import("../types").TrackingObjectMap | null;
            readonly markedObjects: {
                objects: import("../types").TrackingObjectMap | null;
            } | null;
            release: () => void;
        };
        breakLeakedObjectRefs: () => void;
        getExposedToGlobalLeaksState: () => import("rempl").ExposedToGlobalLeaksState;
        subscribeToExposedToGlobalLeaksState: (fn: import("./unmounted-fiber-leak-detector").ExposedLeaksStateSubscription) => () => void;
        exposeLeakedObjectsToGlobal: (fiberIds?: number[] | undefined) => import("rempl").ExposedToGlobalLeaksState;
        cancelExposingLeakedObjectsToGlobal: () => void;
    };
};
