import * as React from "react";
import { useFiberMaps } from "../../../utils/fiber-maps";
import FiberId from "../../common/FiberId";
import { ResolveSourceLoc } from "../../common/SourceLoc";
import { CallTracePath, CallTraceList } from "../CallStack";
import { Diff } from "../diff/Diff";
import { FiberLink } from "../FiberLink";
function Change({ type, prelude, name, index, diffPrelude, diff, values, warn = false, }) {
    return (React.createElement("div", { key: index, className: "event-render-reason" },
        React.createElement("span", { className: "event-render-reason__type-badge" +
                (warn ? " event-render-reason__type-badge_has-warning" : "") }, type),
        prelude,
        name,
        typeof index === "number" && React.createElement(FiberId, { id: index }),
        " ",
        diffPrelude,
        React.createElement(Diff, { diff: diff, values: values })));
}
export function PropChange({ entry, warn, }) {
    return (React.createElement(Change, { type: "prop", name: entry.name, diff: entry.diff, values: entry, warn: warn }));
}
export function StateChange({ entry, warn, }) {
    return (React.createElement(Change, { type: "state", prelude: entry.hook && React.createElement(CallTracePath, { path: entry.hook.trace.path }), name: entry.hook && (React.createElement(ResolveSourceLoc, { loc: entry.hook.trace.loc }, entry.hook.name)), index: entry.hook?.index, diffPrelude: entry.calls && (React.createElement("span", { style: { color: "#888", fontSize: "11px" } },
            " ",
            "[[",
            entry.calls.map((entry, idx) => (React.createElement(ResolveSourceLoc, { key: idx, loc: entry.loc }, entry.name))),
            "]]",
            " ")), diff: entry.diff, values: entry, warn: warn }));
}
export function ContextChange({ fiberId, entry, }) {
    const { fiberById } = useFiberMaps();
    const fiber = fiberById.get(fiberId);
    const context = entry.context;
    const contextReads = context !== null
        ? fiber?.typeDef.hooks.filter(hook => hook.context === context)
        : null;
    return (React.createElement(Change, { type: "context", prelude: contextReads?.length && (React.createElement(CallTraceList, { traces: contextReads.map(hook => hook.trace) })), name: typeof context?.providerId === "number" ? (React.createElement(FiberLink, { id: context?.providerId, name: context.name })) : (context?.name || "UnknownContext"), diff: entry.diff, values: entry, warn: false }));
}
