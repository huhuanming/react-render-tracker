import { ReactIntegrationApi, ReactInternals, ReactUnsupportedRendererInfo, Fiber, FiberRoot } from "./types";
declare type ReactDevtoolsHook = {
    supportsFiber: boolean;
    inject: (renderer: ReactInternals, rendererId?: number) => number;
    onCommitFiberUnmount: (rendererId: number, fiber: Fiber) => void;
    onCommitFiberRoot: (rendererId: number, root: FiberRoot, priorityLevel: any) => void;
    onPostCommitFiberRoot: (rendererId: number, root: FiberRoot) => void;
    renderers?: Map<any, any>;
};
export declare function createReactDevtoolsHook(attachRenderer: (id: number, renderer: ReactInternals) => ReactIntegrationApi, onUnsupportedRenderer: (rendererInfo: ReactUnsupportedRendererInfo) => void, existing: ReactDevtoolsHook): ReactDevtoolsHook;
export declare function installReactDevtoolsHook(target: any, attachRenderer: (id: number, renderer: ReactInternals) => ReactIntegrationApi, onUnsupportedRenderer: (rendererInfo: ReactUnsupportedRendererInfo) => void): any;
export {};
