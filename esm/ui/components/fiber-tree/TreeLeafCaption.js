import * as React from "react";
import { useSelectionState } from "../../utils/selection";
import { useHighlightingState } from "../../utils/highlighting";
import { usePinnedContext } from "../../utils/pinned";
import TreeLeafTimings from "./TreeLeafTimings";
import TreeLeafCaptionContent from "./TreeLeafCaptionContent";
const TreeLeafCaption = ({ fiber, depth = 0, showTimings = false, pinned = false, expanded = false, setExpanded, setFiberElement, }) => {
    const content = React.useMemo(() => (React.createElement(TreeLeafCaptionContent, { fiber: fiber, expanded: expanded, setExpanded: setExpanded, setFiberElement: setFiberElement })), [fiber, expanded, setExpanded, setFiberElement]);
    return (React.createElement(TreeLeafCaptionContainer, { fiber: fiber, depth: depth, pinned: pinned, showTimings: showTimings, content: content }));
};
const TreeLeafCaptionContainer = React.memo(({ fiber, depth, pinned, showTimings, content, }) => {
    const { id, ownerId, mounted } = fiber;
    const { selected, select } = useSelectionState(id);
    const { highlighted, startHighlight, stopHighlight } = useHighlightingState(id);
    const { pin } = usePinnedContext();
    const isRenderRoot = ownerId === 0;
    const classes = ["tree-leaf-caption"];
    if (highlighted) {
        classes.push("highlighted");
    }
    if (selected) {
        classes.push("selected");
    }
    if (pinned) {
        classes.push("pinned");
    }
    if (isRenderRoot) {
        classes.push("render-root");
    }
    const handleSelect = (event) => {
        event.stopPropagation();
        select(id);
    };
    const handlePin = (event) => {
        event.stopPropagation();
        pin(id);
    };
    const handleMouseEnter = mounted ? startHighlight : undefined;
    const handleMouseLeave = mounted ? stopHighlight : undefined;
    return (React.createElement("div", { className: classes.join(" "), style: { "--depth": depth }, onClick: handleSelect, onDoubleClick: handlePin, onMouseEnter: handleMouseEnter, onMouseLeave: handleMouseLeave },
        showTimings && React.createElement(TreeLeafTimings, { fiber: fiber }),
        content,
        pinned && (React.createElement("button", { className: "tree-leaf-caption__unpin-button", onClick: event => {
                event.stopPropagation();
                pin(0);
            } }, "Unpin"))));
});
TreeLeafCaptionContainer.displayName = "TreeLeafCaptionContainer";
export default TreeLeafCaption;
