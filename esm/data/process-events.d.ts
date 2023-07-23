import { Message } from "common-types";
import { createFiberDataset } from "./fiber-dataset";
export declare function processEvents(newEvents: Message[], allEvents: Message[], { linkedEvents, commitById, fiberById, fiberTypeDefById, fibersByTypeId, fibersByProviderId, leakedFibers, parentTree, parentTreeIncludeUnmounted, ownerTree, ownerTreeIncludeUnmounted, }: ReturnType<typeof createFiberDataset>): {
    mountCount: number;
    unmountCount: number;
    updateCount: number;
};
