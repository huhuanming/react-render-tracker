import * as React from "react";
import { CallTraceList } from "../CallStack";
import { FiberLink } from "../FiberLink";
import { FiberInfoSection } from "./FiberInfoSection";
export function FiberInfoSectionContexts({ fiber }) {
    const { typeDef } = fiber;
    if (!Array.isArray(typeDef.contexts)) {
        return null;
    }
    const contextReadMap = typeDef.hooks.reduce((map, hook) => {
        if (hook.context) {
            const traces = map.get(hook.context);
            if (traces === undefined) {
                map.set(hook.context, [hook.trace]);
            }
            else {
                traces.push(hook.trace);
            }
        }
        return map;
    }, new Map());
    return (React.createElement(FiberInfoSection, { id: "contexts", header: `Contexts (${typeDef.contexts.length})`, emptyText: "no contexts" },
        React.createElement("div", { className: "fiber-info-section-memo-contexts" }, typeDef.contexts.map((context, index) => {
            const traces = contextReadMap.get(context);
            return (React.createElement("div", { key: index },
                context.providerId !== undefined ? (React.createElement(FiberLink, { id: context.providerId, name: context.name })) : (React.createElement(React.Fragment, null,
                    context.name,
                    " ",
                    React.createElement("span", { className: "fiber-info-fiber-context__no-provider" }, "No provider found"))),
                traces && (React.createElement("div", { className: "fiber-info-fiber-context__reads" },
                    React.createElement(CallTraceList, { expanded: true, compat: false, traces: traces })))));
        }))));
}
