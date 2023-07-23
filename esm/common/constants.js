export const ToolId = "React Render Tracker";
export const ElementTypeClass = 1;
export const ElementTypeFunction = 2;
export const ElementTypeMemo = 3;
export const ElementTypeForwardRef = 4;
export const ElementTypeProvider = 5;
export const ElementTypeConsumer = 6;
export const ElementTypeHostRoot = 7;
export const ElementTypeHostComponent = 8;
export const ElementTypeHostText = 9;
export const ElementTypeHostPortal = 10;
export const ElementTypeSuspense = 11;
export const ElementTypeSuspenseList = 12;
export const ElementTypeProfiler = 13;
export const ElementTypeOtherOrUnknown = 14;
export const FiberTypeName = {
    [ElementTypeClass]: "Class component",
    [ElementTypeFunction]: "Function component",
    [ElementTypeMemo]: "Memo",
    [ElementTypeForwardRef]: "ForwardRef",
    [ElementTypeProvider]: "Provider",
    [ElementTypeConsumer]: "Consumer",
    [ElementTypeHostRoot]: "Render root",
    [ElementTypeHostComponent]: "Host component",
    [ElementTypeHostText]: "Host text",
    [ElementTypeHostPortal]: "Host portal",
    [ElementTypeSuspense]: "Suspense",
    [ElementTypeSuspenseList]: "Suspense list",
    [ElementTypeProfiler]: "Profiler",
    [ElementTypeOtherOrUnknown]: "Unknown",
};
export const LegacyRoot = 0;
export const ConcurrentRoot = 1;
export const fiberRootMode = {
    [LegacyRoot]: "Legacy Mode",
    [ConcurrentRoot]: "Concurrent Mode",
};
// Tracking object types must a power of 2
export const TrackingObjectFiber = 0;
export const TrackingObjectAlternate = 1;
export const TrackingObjectStateNode = 2;
export const TrackingObjectHook = 3;
export const TrackingObjectTypeName = {
    [TrackingObjectFiber]: "fiber",
    [TrackingObjectAlternate]: "alternate",
    [TrackingObjectStateNode]: "stateNode",
    [TrackingObjectHook]: "hook",
};
export const FeatureMemLeaks = false;
export const FeatureCommits = false;
