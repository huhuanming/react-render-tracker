import * as React from "react";
import { useFiber } from "../../../utils/fiber-maps";
import { ResolveSourceLoc } from "../../common/SourceLoc";
import { CallTracePath } from "../CallStack";
import { EventChangesSummary } from "../EventChangesSummary";
import { ChangesMatrix } from "./ChangesMatrix";
import { FiberInfoSection } from "./FiberInfoSection";
export function FiberInfoSectionMemoHooks({ fiber }) {
    const { events = [] } = useFiber(fiber.id) || {};
    const memoHooks = new Map();
    for (const hook of fiber.typeDef.hooks) {
        if (hook.name === "useMemo" || hook.name === "useCallback") {
            memoHooks.set(hook.index, {
                hook,
                deps: hook.deps,
                updates: [],
                computeCount: 0,
                headers: hook.deps === null
                    ? ["[value]"]
                    : ["[value]"].concat(Array.from({ length: hook.deps }, (_, index) => "dep " + index)),
            });
        }
    }
    if (memoHooks.size === 0) {
        return null;
    }
    for (const { event, changes } of events) {
        if (event.op !== "update") {
            continue;
        }
        for (const hookChanges of memoHooks.values()) {
            hookChanges.updates.push({
                num: hookChanges.updates.length + 1,
                main: (React.createElement(React.Fragment, null,
                    hookChanges.updates.length + 1,
                    ".",
                    " ",
                    React.createElement(EventChangesSummary, { changes: changes }))),
                values: null,
            });
        }
        if (changes?.memos) {
            for (const memoChange of changes?.memos) {
                const hookUpdates = memoHooks.get(memoChange.hook);
                if (hookUpdates === undefined) {
                    console.warn("[react-render-tracker] Update for unknown memo");
                    continue;
                }
                const lastUpdate = hookUpdates.updates[hookUpdates.updates.length - 1];
                hookUpdates.computeCount++;
                lastUpdate.values =
                    hookUpdates.deps !== null
                        ? [
                            memoChange,
                            ...Array.from({ length: hookUpdates.deps }, () => null),
                        ]
                        : [memoChange];
                if (hookUpdates.deps !== null &&
                    Array.isArray(memoChange.deps) &&
                    Array.isArray(lastUpdate.values)) {
                    for (const dep of memoChange.deps) {
                        lastUpdate.values[dep.index + 1] = dep;
                    }
                }
            }
        }
    }
    return (React.createElement(FiberInfoSection, { id: "memo-hooks", header: `Memo hooks (${memoHooks.size})` },
        React.createElement("ol", { className: "fiber-info-section-memo-content" }, [...memoHooks.values()].map(({ hook, updates, computeCount, headers }) => {
            return (React.createElement("li", { key: hook.index },
                React.createElement(CallTracePath, { key: hook.index, expanded: true, path: hook.trace.path }),
                React.createElement(ResolveSourceLoc, { loc: hook.trace.loc },
                    hook.name,
                    "(\u2026)"),
                " ",
                React.createElement("span", { className: "fiber-info-section-memo-content__recompute-stat" }, computeCount === 0
                    ? "Never recompute"
                    : computeCount === updates.length
                        ? "Every update recompute"
                        : `${computeCount} of ${updates.length} updates recompute`),
                updates.some(update => update.values !== null) && (React.createElement(ChangesMatrix, { mainHeader: "Update", headers: headers, data: updates }))));
        }))));
}
