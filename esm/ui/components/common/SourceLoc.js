import * as React from "react";
import { useOpenFile } from "../../utils/open-file";
import { useResolvedLocation } from "../../utils/source-locations";
export function SourceLoc({ loc, type, children, }) {
    const { anchorAttrs } = useOpenFile();
    if (!loc) {
        return React.createElement(React.Fragment, null, children);
    }
    const attrs = anchorAttrs(loc, type);
    if (!attrs) {
        return (React.createElement("span", { className: "source-loc", title: loc }, children));
    }
    return (React.createElement("a", { className: "source-loc source-loc_openable", title: `Open source location: ${attrs.href}`, ...attrs }, children));
}
export function ResolveSourceLoc({ loc, type, children, }) {
    const resolvedLoc = useResolvedLocation(loc);
    if (!loc) {
        return React.createElement(React.Fragment, null, children);
    }
    if (!resolvedLoc) {
        return (React.createElement("span", { className: "source-loc source-loc_unresolved", title: "Resolving..." }, children));
    }
    return (React.createElement(SourceLoc, { type: type, loc: resolvedLoc }, children));
}
