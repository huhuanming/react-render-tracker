import * as React from "react";
import { useSectionStateContext } from "./FiberInfo";
export function FiberInfoSection({ id, header, emptyText, expandedOpts, children, }) {
    const { get: getSectionState, toggle: toggleSectionState } = useSectionStateContext();
    const expanded = getSectionState(id) && Boolean(children);
    return (React.createElement("div", { className: "fiber-info-section" +
            (!children ? " fiber-info-section_no-data" : "") +
            (expanded ? " fiber-info-section_expanded" : "") },
        React.createElement("div", { className: "fiber-info-section__header", onClick: () => toggleSectionState(id) },
            header,
            !children ? (React.createElement("span", { className: "fiber-info-section__header-no-data" }, emptyText || "no data")) : (""),
            expanded ? expandedOpts : null),
        expanded && children));
}
