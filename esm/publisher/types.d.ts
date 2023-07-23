import { FiberType, Message, TransferCallTrace, TransferFiberChanges } from "common-types";
import { HighlightState } from "rempl";
import { ExposedLeaksStateSubscription, TrackingObjectWeakRef } from "./react-integration/unmounted-fiber-leak-detector";
import { ExposedToGlobalLeaksState } from "rempl";
export * from "common-types";
export declare type DistributiveOmit<T, K extends keyof T> = T extends any ? Omit<T, K> : never;
export declare type ReactInternals = {
    bundleType?: number;
    reconcilerVersion?: string;
    rendererPackageName?: string;
    version?: string;
    injectProfilingHooks?: () => void;
    currentDispatcherRef: any;
    getCurrentFiber: () => Fiber | null;
    findFiberByHostInstance: (hostInstance: NativeType) => Fiber | null;
};
export declare type NativeType = Record<string, unknown>;
declare type HookType = "useState" | "useReducer" | "useContext" | "useRef" | "useEffect" | "useLayoutEffect" | "useCallback" | "useMemo" | "useImperativeHandle" | "useDebugValue" | "useDeferredValue" | "useTransition" | "useMutableSource" | "useOpaqueIdentifier" | "useCacheRefresh";
export declare type RefObject = {
    current: any;
};
export declare type WorkTag = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20 | 21 | 22 | 23 | 24;
export declare type ReactNode = ReactElement | ReactPortal | ReactText | ReactFragment | ReactProvider<any> | ReactConsumer<any>;
export declare type ReactEmpty = null | void | boolean;
export declare type ReactFragment = ReactEmpty | Iterable<ReactNode>;
export declare type ReactNodeList = ReactEmpty | ReactNode[];
export declare type ReactText = string | number;
export declare type ReactElement = {
    $$typeof: symbol | number;
    type: any;
    key: null | string;
    ref: any;
    props: Record<string, unknown>;
    _owner: Fiber;
    _store: {
        validated: boolean;
    };
    _self: ReactElement;
    _shadowChildren: any;
    _source: Source;
};
export declare type ReactProvider<T> = {
    $$typeof: symbol | number;
    type: ReactProviderType<T>;
    key: null | string;
    ref: null;
    props: {
        value: T;
        children?: ReactNodeList;
    };
};
export declare type ReactProviderType<T> = {
    $$typeof: symbol | number;
    _context: ReactContext<T>;
};
export declare type ReactConsumer<T> = {
    $$typeof: symbol | number;
    type: ReactContext<T>;
    key: null | string;
    ref: null;
    props: {
        children: (value: T) => ReactNodeList;
    };
};
export declare type ReactContext<T> = {
    $$typeof: symbol | number;
    Consumer: ReactContext<T>;
    Provider: ReactProviderType<T>;
    _currentValue: T;
    _currentValue2: T;
    _threadCount: number;
    _currentRenderer?: Record<string, unknown> | null;
    _currentRenderer2?: Record<string, unknown> | null;
    displayName?: string;
};
export declare type ReactPortal = {
    $$typeof: symbol | number;
    key: null | string;
    containerInfo: any;
    children: ReactNodeList;
    implementation: any;
};
export declare type ContextDependency<T> = {
    context: ReactContext<T>;
    next: ContextDependency<any> | null;
};
export declare type Dependencies = {
    lanes: Lanes;
    firstContext: ContextDependency<any> | null;
};
export declare type OldDependencies = {
    first: ContextDependency<any> | null;
};
declare type Lanes = number;
declare type Flags = number;
export declare type FiberRoot = {
    current: Fiber;
    tag: number;
};
declare type MemoizedStateMemo = {
    memoizedState: [any, any[] | null];
    next: MemoizedState;
};
export declare type MemoizedState = any;
export interface Fiber {
    tag: WorkTag;
    key: null | string;
    elementType: any;
    type: any;
    stateNode: any;
    return: Fiber | null;
    child: Fiber | null;
    sibling: Fiber | null;
    index: number;
    ref: null | (((handle: any) => void) & {
        _stringRef: string | null;
    }) | RefObject;
    pendingProps: any;
    memoizedProps: any;
    updateQueue: null;
    memoizedState: MemoizedState;
    dependencies?: Dependencies | null;
    contextDependencies?: OldDependencies | null;
    mode: number;
    flags: Flags;
    subtreeFlags: Flags;
    deletions: Array<Fiber> | null;
    nextEffect: Fiber | null;
    firstEffect: Fiber | null;
    lastEffect: Fiber | null;
    lanes: Lanes;
    childLanes: Lanes;
    alternate: Fiber | null;
    actualDuration?: number;
    actualStartTime?: number;
    selfBaseDuration?: number;
    treeBaseDuration?: number;
    _debugSource?: Source | null;
    _debugOwner?: Fiber | null;
    _debugIsCurrentlyTiming?: boolean;
    _debugNeedsRemount?: boolean;
    _debugHookTypes?: Array<HookType> | null;
}
export declare type PathFrame = {
    key: string | null;
    index: number;
    displayName: string | null;
};
export declare type PathMatch = {
    id: number;
    isFullMatch: boolean;
};
export declare type SerializedElement = {
    displayName: string | null;
    id: number;
    key: number | string | null;
    type: FiberType;
};
export declare type OwnersList = {
    id: number;
    owners: Array<SerializedElement> | null;
};
export declare type ReactCommitData = {
    commitTime: number;
    changeDescriptions: Map<number, TransferFiberChanges> | null;
    duration: number;
    effectDuration: number | null;
    fiberActualDurations: Array<[number, number]>;
    fiberSelfDurations: Array<[number, number]>;
    passiveEffectDuration: number | null;
    priorityLevel: string | null;
    timestamp: number;
    updaters: Array<SerializedElement> | null;
};
export declare type Source = {
    fileName: string;
    lineNumber: number;
    columnNumber?: number;
};
export declare type InspectedElement = {
    id: number;
    displayName: string | null;
    canEditHooks: boolean;
    canEditFunctionProps: boolean;
    canEditHooksAndDeletePaths: boolean;
    canEditHooksAndRenamePaths: boolean;
    canEditFunctionPropsDeletePaths: boolean;
    canEditFunctionPropsRenamePaths: boolean;
    canToggleError: boolean;
    isErrored: boolean;
    targetErrorBoundaryID?: number;
    canToggleSuspense: boolean;
    canViewSource: boolean;
    hasLegacyContext: boolean;
    context: Record<string, unknown> | null;
    hooks: Record<string, unknown> | null;
    props: Record<string, unknown> | null;
    state: Record<string, unknown> | null;
    key: number | string | null;
    errors: Array<[string, number]>;
    warnings: Array<[string, number]>;
    owners: Array<SerializedElement> | null;
    source: Source | null;
    type: FiberType;
    rootType: string | null;
    rendererPackageName: string | null;
    rendererVersion: string | null;
};
export declare type RerenderState = {
    state: MemoizedState;
};
export declare type FiberDispatcherContext = {
    context: ReactContext<any>;
    reads: Array<{
        index: number;
        trace: TransferCallTrace;
    }>;
};
export declare type FiberDispatchCall = {
    dispatch: any;
    dispatchName: "setState" | "dispatch" | "startTransition" | "externalStorageSync";
    root: FiberRoot;
    fiber: Fiber;
    renderFiber: Fiber | null;
    effectFiber: Fiber | null;
    effectName: "effect" | "layout-effect" | null;
    event: string | null;
    loc: string | null;
    stack?: string;
};
export declare type ClassComponentUpdateCall = {
    type: "setState" | "forceUpdate";
    rootId?: number;
    fiberId?: number;
    loc: string | null;
};
export declare type HookInfo = {
    name: string;
    deps: number | null;
    context: ReactContext<any> | null;
    trace: TransferCallTrace;
};
export declare type HookCompute = {
    render: number;
    hook: number;
    prev: MemoizedStateMemo;
    next: MemoizedStateMemo;
};
export declare type ReactDevtoolsHookHandlers = {
    handleCommitFiberRoot: (fiber: FiberRoot, commitPriority?: number) => void;
    handlePostCommitFiberRoot: (fiber: FiberRoot) => void;
    handleCommitFiberUnmount: (fiber: Fiber) => void;
};
export declare type ReactInterationApi = {
    findNativeNodesForFiberId: (id: number) => any[] | null;
    getFiberIdForNative: (hostInstance: NativeType, findNearestUnfilteredAncestor?: boolean) => number | null;
    getDisplayNameForFiberId: (id: number) => string | null;
    getOwnersList: (id: number) => Array<SerializedElement> | null;
    getPathForElement: (id: number) => Array<PathFrame> | null;
};
export declare type TrackingObject = Fiber | object;
export declare type TrackingObjectMap = Record<string, TrackingObjectWeakRef>;
export declare type MemoryLeakDetectionApi = {
    getLeakedObjectsProbe: () => {
        readonly objects: TrackingObjectMap | null;
        readonly markedObjects: {
            objects: TrackingObjectMap | null;
        } | null;
        release: () => void;
    };
    breakLeakedObjectRefs: () => void;
    getExposedToGlobalLeaksState: () => ExposedToGlobalLeaksState | null;
    subscribeToExposedToGlobalLeaksState: (fn: ExposedLeaksStateSubscription) => () => void;
    exposeLeakedObjectsToGlobal: (fiberIds?: number[]) => ExposedToGlobalLeaksState | null;
    cancelExposingLeakedObjectsToGlobal: () => void;
};
export declare type ReactDispatcherTrapApi = {
    getDispatchHookIndex: (dispatch: (state: any) => any) => number | null;
    getFiberTypeHookInfo: (fiberTypeId: number) => HookInfo[];
    getFiberComputes: (fiber: Fiber) => HookCompute[];
    getFiberRerenders: (fiber: Fiber) => RerenderState[] | undefined;
    flushDispatchCalls: (root: FiberRoot) => FiberDispatchCall[];
};
export declare type HighlightApi = {
    subscribe: (fn: (state: HighlightState) => void) => void;
    startHighlight: (fiberId: number) => void;
    stopHighlight: () => void;
    startInspect: () => void;
    stopInspect: () => void;
};
export declare type RemoteCommandsApi = Omit<MemoryLeakDetectionApi, "getLeakedObjectsProbe"> & {
    highlightApi: HighlightApi;
};
export declare type ReactIntegrationApi = ReactDevtoolsHookHandlers & ReactInterationApi & MemoryLeakDetectionApi;
export declare type RecordEventHandler = (payload: DistributiveOmit<Message, "id">) => number;
