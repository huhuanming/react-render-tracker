import * as React from "react";
import { ResolveSourceLoc } from "../common/SourceLoc";
export function CallTracePath({ path, expanded = false, }) {
    const [collapsed, setCollapsed] = React.useState(!expanded);
    if (!Array.isArray(path)) {
        return null;
    }
    const isFit = path.length === 2 && path[1].name.length < 12;
    if (collapsed && path.length > 1 && !isFit) {
        const first = path[0];
        return (React.createElement("span", { className: "details-call-stack" },
            React.createElement(ResolveSourceLoc, { loc: first.loc }, first.name),
            " → ",
            React.createElement("span", { className: "details-call-stack-more", onClick: () => setCollapsed(false) },
                "\u2026",
                path.length - 1,
                " more\u2026"),
            " → "));
    }
    return (React.createElement("span", { className: "details-call-stack" }, path.map((entry, index) => (React.createElement(React.Fragment, { key: index },
        React.createElement(ResolveSourceLoc, { loc: entry.loc }, entry.name),
        " → ")))));
}
export function CallTraceList({ traces, expanded, compat = true, }) {
    const [collapsed, setCollapsed] = React.useState();
    if (compat && traces.length < 2) {
        return React.createElement(CallTracePath, { expanded: expanded, path: traces[0]?.path });
    }
    if (collapsed === undefined ? !expanded : collapsed) {
        return (React.createElement("span", null,
            React.createElement("span", { className: "details-call-stack-show-paths", onClick: () => setCollapsed(false) },
                "\u2026",
                traces.length,
                " paths\u2026")));
    }
    return (React.createElement("ol", { className: "details-call-stack-list" }, traces.map((trace, index) => (React.createElement("li", { key: index },
        React.createElement(CallTracePath, { path: trace?.path, expanded: collapsed !== undefined ? !collapsed : expanded }),
        React.createElement(ResolveSourceLoc, { loc: trace?.loc }, "useContext(\u2026)"))))));
}
