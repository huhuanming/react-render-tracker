import * as React from "react";
import { MessageFiber } from "../../types";
interface TreeLeafCaptionProps {
    fiber: MessageFiber;
    depth?: number;
    showTimings?: boolean;
    pinned?: boolean;
    expanded?: boolean;
    setExpanded?: (value: boolean) => void;
    setFiberElement?: (id: number, element: HTMLElement | null) => void;
}
declare const TreeLeafCaption: ({ fiber, depth, showTimings, pinned, expanded, setExpanded, setFiberElement, }: TreeLeafCaptionProps) => React.JSX.Element;
export default TreeLeafCaption;
