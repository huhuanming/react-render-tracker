import * as React from "react";
import { LocType } from "../types";
interface OpenFileContext {
    anchorAttrs(loc: string, type?: LocType): {
        href: string;
        onClick?: (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => void;
    } | undefined;
    available: boolean;
}
declare const OpenFileContext: React.Context<OpenFileContext>;
export declare const useOpenFile: () => OpenFileContext;
export declare function OpenFileContextProvider({ children, }: {
    children: React.ReactNode;
}): React.JSX.Element;
export {};
