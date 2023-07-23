import * as React from "react";
import { ReactRendererInfo, ReactUnsupportedRendererInfo } from "../types";
declare type ReactRenderersContext = {
    renderers: ReactRendererInfo[];
    unsupportedRenderers: ReactUnsupportedRendererInfo[];
    selected: ReactRendererInfo | null;
};
declare const ReactRenderersContext: React.Context<ReactRenderersContext>;
export declare const useReactRenderers: () => ReactRenderersContext;
export declare function ReactRenderersContextProvider({ children, }: {
    children: React.ReactNode;
}): React.JSX.Element;
export {};
