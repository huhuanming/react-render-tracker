import { Fiber } from "../../types";
export declare function getInternalReactConstants(version: string): {
    getDisplayNameForFiber: (fiber: Fiber) => string | null;
    getTypeSymbol: (type: any) => string | number;
    ReactPriorityLevels: {
        ImmediatePriority: number;
        UserBlockingPriority: number;
        NormalPriority: number;
        LowPriority: number;
        IdlePriority: number;
        NoPriority: number;
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
    ReactTypeOfSideEffect: {
        DidCapture: number;
        NoFlags: number;
        PerformedWork: number;
        Placement: number;
        Incomplete: number;
    };
};
