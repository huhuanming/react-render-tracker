import * as React from "react";
import { createFiberDataset } from "../../data";
import { useComputeSubscription } from "./subscription";
const FiberMapsContext = React.createContext({});
export const useFiberMaps = () => React.useContext(FiberMapsContext);
export function FiberMapsContextProvider({ children, }) {
    const value = React.useMemo(createFiberDataset, []);
    return (React.createElement(FiberMapsContext.Provider, { value: value }, children));
}
export const useCommit = (commitId) => {
    const { commitById } = useFiberMaps();
    const compute = React.useCallback(() => commitById.get(commitId), [commitById, commitId]);
    const subscribe = React.useCallback(requestRecompute => commitById.subscribe(commitId, requestRecompute), [commitById, commitId]);
    return useComputeSubscription(compute, subscribe);
};
export const useCommits = () => {
    const { commitById } = useFiberMaps();
    const compute = React.useCallback(() => [...commitById.values()], [commitById]);
    const subscribe = React.useCallback(requestRecompute => commitById.subscribeValues(requestRecompute), [commitById]);
    return useComputeSubscription(compute, subscribe);
};
export const useFiber = (fiberId) => {
    const { fiberById } = useFiberMaps();
    const compute = React.useCallback(() => fiberById.get(fiberId), [fiberById, fiberId]);
    const subscribe = React.useCallback(requestRecompute => fiberById.subscribe(fiberId, requestRecompute), [fiberById, fiberId]);
    return useComputeSubscription(compute, subscribe);
};
const EMPTY_ARRAY = Object.seal([]);
export const useFiberChildren = (fiberId, groupByParent = false, includeUnmounted = false) => {
    const { selectTree } = useFiberMaps();
    const tree = selectTree(groupByParent, includeUnmounted);
    const leaf = tree.getOrCreate(fiberId);
    const compute = React.useCallback(() => leaf.children || EMPTY_ARRAY, [leaf]);
    const subscribe = React.useCallback(requestRecompute => leaf.subscribe(requestRecompute), [leaf]);
    return useComputeSubscription(compute, subscribe);
};
export const useFiberAncestors = (fiberId, groupByParent = false) => {
    const { selectTree } = useFiberMaps();
    const tree = selectTree(groupByParent, true);
    const leaf = tree.getOrCreate(fiberId);
    const compute = React.useCallback(() => leaf.ancestors(), [leaf]);
    const subscribe = React.useCallback(requestRecompute => leaf.subscribe(requestRecompute), [leaf]);
    return useComputeSubscription(compute, subscribe);
};
export const useTypeIdFibers = (typeId) => {
    const { fibersByTypeId } = useFiberMaps();
    const subset = fibersByTypeId.get(typeId);
    const compute = React.useCallback(() => subset.value || EMPTY_ARRAY, [subset]);
    const subscribe = React.useCallback(requestRecompute => subset.subscribe(requestRecompute), [subset]);
    return useComputeSubscription(compute, subscribe);
};
export const useProviderConsumers = (providerId) => {
    const { fibersByProviderId } = useFiberMaps();
    const subset = fibersByProviderId.get(providerId);
    const compute = React.useCallback(() => subset.value || EMPTY_ARRAY, [subset]);
    const subscribe = React.useCallback(requestRecompute => subset.subscribe(requestRecompute), [subset]);
    return useComputeSubscription(compute, subscribe);
};
export const useLeakedFibers = () => {
    const { leakedFibers } = useFiberMaps();
    const compute = React.useCallback(() => leakedFibers.value, [leakedFibers]);
    const subscribe = React.useCallback(requestRecompute => leakedFibers.subscribe(requestRecompute), [leakedFibers]);
    return useComputeSubscription(compute, subscribe);
};
