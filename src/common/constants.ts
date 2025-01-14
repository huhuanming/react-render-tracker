import {
  FiberType,
  FiberRootMode,
  TrackingObjectType,
  TrackingObjectTypeHook,
} from "common-types";

export const ToolId = "React Render Tracker";

export const ElementTypeClass: FiberType = 1;
export const ElementTypeFunction: FiberType = 2;
export const ElementTypeMemo: FiberType = 3;
export const ElementTypeForwardRef: FiberType = 4;
export const ElementTypeProvider: FiberType = 5;
export const ElementTypeConsumer: FiberType = 6;
export const ElementTypeHostRoot: FiberType = 7;
export const ElementTypeHostComponent: FiberType = 8;
export const ElementTypeHostText: FiberType = 9;
export const ElementTypeHostPortal: FiberType = 10;
export const ElementTypeSuspense: FiberType = 11;
export const ElementTypeSuspenseList: FiberType = 12;
export const ElementTypeProfiler: FiberType = 13;
export const ElementTypeOtherOrUnknown: FiberType = 14;

export const FiberTypeName: Record<FiberType, string> = {
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

export const LegacyRoot: FiberRootMode = 0;
export const ConcurrentRoot: FiberRootMode = 1;

export const fiberRootMode: Record<FiberRootMode, string> = {
  [LegacyRoot]: "Legacy Mode",
  [ConcurrentRoot]: "Concurrent Mode",
};

// Tracking object types must a power of 2
export const TrackingObjectFiber: TrackingObjectType = 0;
export const TrackingObjectAlternate: TrackingObjectType = 1;
export const TrackingObjectStateNode: TrackingObjectType = 2;
export const TrackingObjectHook: TrackingObjectTypeHook = 3;

export const TrackingObjectTypeName: Record<TrackingObjectType, string> = {
  [TrackingObjectFiber]: "fiber",
  [TrackingObjectAlternate]: "alternate",
  [TrackingObjectStateNode]: "stateNode",
  [TrackingObjectHook]: "hook",
};

export const FeatureMemLeaks = true;
export const FeatureCommits = false;
