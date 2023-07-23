import type { CoreApi } from "./core";
import { ReactInterationApi } from "../types";
export declare function createReactInteractionApi({ ReactTypeOfWork, getFiberIdThrows, getFiberById, getElementTypeForFiber, getDisplayNameForFiber, getRootPseudoKey, shouldFilterFiber, findFiberByHostInstance, }: CoreApi): ReactInterationApi;
