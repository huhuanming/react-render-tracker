import { ReactInternals, RendererBundleType } from "../types";
declare type RendererInfoProps = Pick<ReactInternals, "rendererPackageName" | "version" | "bundleType" | "injectProfilingHooks">;
export declare function getRendererInfo({ rendererPackageName, version, bundleType, injectProfilingHooks, }: RendererInfoProps): {
    name: string;
    version: string;
    bundleType: RendererBundleType;
};
export declare function isUnsupportedRenderer(renderer: RendererInfoProps): false | {
    reason: string;
    info: {
        name: string;
        version: string;
        bundleType: RendererBundleType;
    };
};
export {};
