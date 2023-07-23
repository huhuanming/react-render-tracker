/// <reference path="../../../src/common/types.d.ts" />
import * as React from "react";
export declare const useFiberMaps: () => {
    allEvents: import("common-types").Message[];
    linkedEvents: WeakMap<import("common-types").Message, import("../types").LinkedEvent>;
    commitById: import("./subscription").SubscribeMap<number, import("../types").Commit>;
    fiberById: import("./subscription").SubscribeMap<number, import("../types").MessageFiber>;
    fiberTypeDefById: import("./subscription").SubscribeMap<number, import("../types").FiberTypeDef>;
    fibersByTypeId: import("./subscription").SubsetSplit<number, number>;
    fibersByProviderId: import("./subscription").SubsetSplit<number, number>;
    leakedFibers: import("./subscription").Subset<number>;
    parentTree: import("../../data").Tree;
    parentTreeIncludeUnmounted: import("../../data").Tree;
    ownerTree: import("../../data").Tree;
    ownerTreeIncludeUnmounted: import("../../data").Tree;
    appendEvents(events: import("common-types").Message[]): void;
    selectTree(groupByParent: boolean, includeUnmounted: boolean): import("../../data").Tree;
};
export declare function FiberMapsContextProvider({ children, }: {
    children: React.ReactNode;
}): React.JSX.Element;
export declare const useCommit: (commitId: number) => import("../types").Commit | undefined;
export declare const useCommits: () => import("../types").Commit[];
export declare const useFiber: (fiberId: number) => import("../types").MessageFiber | undefined;
export declare const useFiberChildren: (fiberId: number, groupByParent?: boolean, includeUnmounted?: boolean) => number[];
export declare const useFiberAncestors: (fiberId: number, groupByParent?: boolean) => import("../../data").TreeNode[];
export declare const useTypeIdFibers: (typeId: number) => number[];
export declare const useProviderConsumers: (providerId: number) => number[];
export declare const useLeakedFibers: () => number[];
