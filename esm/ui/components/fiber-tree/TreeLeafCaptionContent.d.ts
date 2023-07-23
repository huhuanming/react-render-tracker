import * as React from "react";
import { MessageFiber } from "../../types";
interface TreeLeafCaptionMainProps {
    fiber: MessageFiber;
    expanded?: boolean;
    setExpanded?: (value: boolean) => void;
    setFiberElement?: (id: number, element: HTMLElement | null) => void;
}
declare const TreeLeafCaptionContent: ({ fiber, expanded, setExpanded, setFiberElement, }: TreeLeafCaptionMainProps) => React.JSX.Element;
export default TreeLeafCaptionContent;
