/// <reference path="../../src/common/rempl.d.ts" />
import { ReactInternals, ReactUnsupportedRendererInfo, RecordEventHandler, RemoteCommandsApi } from "./types";
export declare const publisher: import("rempl").Publisher;
export declare function publishReactUnsupportedRenderer(rendererInfo: ReactUnsupportedRendererInfo): void;
export declare function publishReactRenderer(id: number, renderer: ReactInternals): RecordEventHandler;
export declare function remoteCommands({ breakLeakedObjectRefs, getExposedToGlobalLeaksState, subscribeToExposedToGlobalLeaksState, cancelExposingLeakedObjectsToGlobal, exposeLeakedObjectsToGlobal, }: RemoteCommandsApi): void;
