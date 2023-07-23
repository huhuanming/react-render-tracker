import { processEvents } from "./process-events";
import { SubscribeMap, Subset, SubsetSplit } from "./subscription";
import { Tree } from "./tree";
export function createFiberDataset(events = []) {
    const allEvents = [];
    const linkedEvents = new WeakMap();
    const commitById = new SubscribeMap();
    const fiberById = new SubscribeMap();
    const fiberTypeDefById = new SubscribeMap();
    const fibersByTypeId = new SubsetSplit();
    const fibersByProviderId = new SubsetSplit();
    const leakedFibers = new Subset();
    const parentTree = new Tree();
    const parentTreeIncludeUnmounted = new Tree();
    const ownerTree = new Tree();
    const ownerTreeIncludeUnmounted = new Tree();
    const dataset = {
        allEvents,
        linkedEvents,
        commitById,
        fiberById,
        fiberTypeDefById,
        fibersByTypeId,
        fibersByProviderId,
        leakedFibers,
        parentTree,
        parentTreeIncludeUnmounted,
        ownerTree,
        ownerTreeIncludeUnmounted,
        appendEvents(events) {
            processEvents(events, allEvents, dataset);
        },
        selectTree(groupByParent, includeUnmounted) {
            return groupByParent
                ? includeUnmounted
                    ? parentTreeIncludeUnmounted
                    : parentTree
                : includeUnmounted
                    ? ownerTreeIncludeUnmounted
                    : ownerTree;
        },
    };
    if (Array.isArray(events) && events.length > 0) {
        dataset.appendEvents(events);
    }
    return dataset;
}
