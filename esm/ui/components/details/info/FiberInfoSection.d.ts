import * as React from "react";
interface IFiberInfoSection {
    id: string;
    header: string;
    emptyText?: string;
    expandedOpts?: JSX.Element | JSX.Element[] | string | null;
    children?: JSX.Element | JSX.Element[] | string | null;
}
export declare function FiberInfoSection({ id, header, emptyText, expandedOpts, children, }: IFiberInfoSection): React.JSX.Element;
export {};
