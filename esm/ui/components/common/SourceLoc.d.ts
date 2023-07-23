import * as React from "react";
import { LocType } from "../../types";
export declare function SourceLoc({ loc, type, children, }: {
    loc: string | null | undefined;
    type?: LocType;
    children: React.ReactNode;
}): React.JSX.Element;
export declare function ResolveSourceLoc({ loc, type, children, }: {
    loc: string | null | undefined;
    type?: LocType;
    children: React.ReactNode;
}): React.JSX.Element;
