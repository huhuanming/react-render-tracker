import * as React from "react";
import { useFiber } from "../../../utils/fiber-maps";
import { ResolveSourceLoc } from "../../common/SourceLoc";
import { CallTracePath } from "../CallStack";
import { FiberInfoSection } from "./FiberInfoSection";
export function FiberInfoSectionLeakedHooks({ fiber, }) {
    const { typeDef, leakedHooks } = useFiber(fiber.id) || {};
    if (!leakedHooks || !leakedHooks.length) {
        return null;
    }
    return (React.createElement(FiberInfoSection, { id: "leaked-hooks", header: `Leaked hooks (${leakedHooks.length})` },
        React.createElement("ol", { className: "fiber-info-section-leaks-content" }, leakedHooks &&
            leakedHooks.map(hookIdx => {
                const hook = typeDef?.hooks[hookIdx];
                return (hook && (React.createElement("li", { key: hookIdx },
                    React.createElement(CallTracePath, { key: hook.index, expanded: true, path: hook.trace.path }),
                    React.createElement(ResolveSourceLoc, { loc: hook.trace.loc },
                        hook.name,
                        "(\u2026)"),
                    " ")));
            }))));
}
