import { extractCallLoc, parseStackTraceLine } from "./utils/stackTrace";
function extractHookPath(depth = 0) {
    const stack = String(new Error().stack)
        .split("\n")
        .slice(4 + depth);
    const path = [];
    const result = {
        path: undefined,
        loc: null,
    };
    let prev = result;
    for (const line of stack) {
        const parsed = parseStackTraceLine(line);
        if (!parsed) {
            break;
        }
        prev.loc = parsed.loc;
        if (!parsed.name.startsWith("use")) {
            break;
        }
        path.unshift((prev = {
            name: parsed.name,
            loc: null,
        }));
    }
    if (path.length) {
        result.path = path;
    }
    // console.log(String(new Error().stack).split("\n"));
    // console.log(path);
    return result;
}
export function createDispatcherTrap(renderer, { getFiberTypeId, isFiberRoot }) {
    let currentDispatcher = null;
    let currentRoot = null;
    let currentFiber = null;
    let currentFiberCollectInfo = null;
    let currentEffectFiber = null;
    let currentEffectName = null;
    let currentFiberHookIndex = 0;
    let dispatchCalls = [];
    // let currentFiberRerenderState: RerenderState | null = null;
    const knownDispatcher = new Set();
    const ignoreDispatcherTransition = new Set();
    const fiberTypeInfo = new Map();
    const fiberRoot = new WeakMap();
    const rerenderStates = new WeakMap();
    const fiberComputedMemo = new WeakMap();
    const fiberSyncStorageHooks = new WeakMap();
    function trackUseHook(name, deps = null, context = null) {
        if (currentFiberCollectInfo !== null) {
            currentFiberCollectInfo.hooks?.push({
                name,
                deps,
                context,
                trace: extractHookPath(1),
            });
        }
        return currentFiberHookIndex++;
    }
    function patchMemoHook(hookName, dispatcher) {
        const orig = dispatcher[hookName];
        dispatcher[hookName] = (fn, deps) => {
            trackUseHook(hookName, Array.isArray(deps) ? deps.length : null);
            return orig(fn, deps);
        };
    }
    function patchEffectHook(hookName, dispatcher) {
        const orig = dispatcher[hookName];
        dispatcher[hookName] = function (create, deps) {
            const hookIdx = trackUseHook(hookName);
            const hookOwnerFiber = currentFiber;
            // const path = trackHookLocation();
            const wrappedCreate = () => {
                currentEffectFiber = hookOwnerFiber;
                currentEffectName =
                    hookName === "useEffect" ? "effect" : "layout-effect";
                const destroy = create();
                currentEffectFiber = null;
                currentEffectName = null;
                // const fiberId = getOrGenerateFiberId(fiber);
                // recordEvent({
                //   op: "effect-create",
                //   commitId: -1,
                //   fiberId,
                //   path,
                // });
                if (typeof destroy === "function") {
                    return () => {
                        // recordEvent({
                        //   op: "effect-destroy",
                        //   commitId: -1,
                        //   fiberId,
                        //   path,
                        // });
                        return destroy();
                    };
                }
                return destroy;
            };
            wrappedCreate.hookIdx = hookIdx;
            return orig(wrappedCreate, deps);
        };
    }
    function patchStateHook(hookName, dispatcher) {
        const orig = dispatcher[hookName];
        const dispatchName = hookName === "useState"
            ? "setState"
            : hookName === "useTransition"
                ? "startTransition"
                : "dispatch";
        dispatcher[hookName] = (...args) => {
            const currentFiberHookIndex = trackUseHook(hookName);
            const [state, dispatch] = orig(...args);
            if (typeof dispatch.wrapper !== "function") {
                const hookOwnerFiber = currentFiber;
                const hookOwnerFiberRoot = currentRoot;
                dispatch.hookIdx = currentFiberHookIndex;
                dispatch.wrapper = value => {
                    // if (
                    //   !currentFiberRerenderState &&
                    //   currentFiber !== null &&
                    //   (currentFiber === hookOwnerFiber ||
                    //     currentFiber?.alternate === hookOwnerFiber)
                    // ) {
                    //   currentFiberRerenderState = {
                    //     state: currentFiber.memoizedState,
                    //   };
                    // }
                    // console.log(hookName, currentFiberRerenderState);
                    // console.log(
                    //   "dispatch",
                    //   hookOwnerFiberId,
                    //   currentFiber && getOrGenerateFiberId(currentFiber),
                    //   window.event?.type
                    // );
                    // console.dir(new Error());
                    // if (
                    //   !currentFiber &&
                    //   !currentEffectFiber &&
                    //   window.event?.type === "message"
                    // ) {
                    //   debugger;
                    // }
                    dispatchCalls.push({
                        dispatch,
                        dispatchName,
                        root: hookOwnerFiberRoot,
                        fiber: hookOwnerFiber,
                        renderFiber: currentFiber,
                        effectFiber: currentEffectFiber,
                        effectName: currentEffectName,
                        event: (!currentFiber && !currentEffectFiber && window.event?.type) ||
                            null,
                        loc: extractCallLoc(0),
                        // stack: String(new Error().stack),
                    });
                    // console.log("dispatch", new Error().stack, ...args);
                    return dispatch(value);
                };
            }
            return [state, dispatch.wrapper];
        };
    }
    function patchContextHook(dispatcher) {
        const orig = dispatcher.useContext;
        const hookName = "useContext";
        dispatcher[hookName] = (context, ...args) => {
            trackUseHook(hookName, null, context);
            const value = orig(context, ...args);
            return value;
        };
    }
    function patchSyncExternalStorage(dispatcher) {
        const orig = dispatcher.useSyncExternalStore;
        if (typeof orig !== "function") {
            return;
        }
        const hookName = "useSyncExternalStore";
        dispatcher[hookName] = (subscribe, getSnapshot, getServerSnapshot) => {
            const hookIdx = trackUseHook(hookName);
            if (currentFiber === null) {
                return orig(subscribe, getSnapshot, getServerSnapshot);
            }
            const hookOwnerFiber = currentFiber;
            const hookOwnerFiberRoot = currentRoot;
            const alternate = currentFiber.alternate;
            let fiberHooks = fiberSyncStorageHooks.get(currentFiber) ||
                (alternate !== null ? fiberSyncStorageHooks.get(alternate) : undefined);
            if (fiberHooks === undefined) {
                fiberSyncStorageHooks.set(currentFiber, (fiberHooks = []));
            }
            if (fiberHooks.length < hookIdx + 1) {
                fiberHooks[hookIdx] = {
                    subscribe: undefined,
                    getSnapshot: undefined,
                    wrappedSubscribe: () => undefined,
                    wrappedGetSnapshot: () => undefined,
                };
            }
            const wrapper = fiberHooks[hookIdx];
            if (wrapper.subscribe !== subscribe) {
                wrapper.subscribe = subscribe;
                wrapper.wrappedSubscribe = function (listener) {
                    return subscribe((prev, next) => {
                        dispatchCalls.push({
                            dispatch: wrapper.wrappedGetSnapshot,
                            dispatchName: "externalStorageSync",
                            root: hookOwnerFiberRoot,
                            fiber: hookOwnerFiber,
                            renderFiber: currentFiber,
                            effectFiber: currentEffectFiber,
                            effectName: currentEffectName,
                            event: (!currentFiber && !currentEffectFiber && window.event?.type) ||
                                null,
                            loc: extractCallLoc(0),
                        });
                        listener(prev, next);
                    });
                };
            }
            if (wrapper.getSnapshot !== getSnapshot) {
                wrapper.getSnapshot = getSnapshot;
                wrapper.wrappedGetSnapshot = Object.assign(() => getSnapshot(), {
                    hookIdx,
                });
            }
            const value = orig(wrapper.wrappedSubscribe, wrapper.wrappedGetSnapshot, getServerSnapshot);
            return value;
        };
    }
    function patchDispatcher(dispatcher) {
        if (dispatcher && !knownDispatcher.has(dispatcher)) {
            knownDispatcher.add(dispatcher);
            // ContextOnlyDispatcher has a single guard function for each hook,
            // detecting it by comparing two random hooks for equality
            if (dispatcher.useReducer === dispatcher.useState) {
                ignoreDispatcherTransition.add(dispatcher);
            }
            // In dev mode InvalidNestedHooksDispatcher* are used, that's the only
            // dispatchers which is changing current dispatcher for another InvalidNestedHooksDispatcher.
            // Detecting such dispatchers by testing a source of the readContext() method
            // which has just a single additional call for warnInvalidContextAccess().
            // We can't rely on a function name since it can be mangled.
            else if (/warnInvalidContextAccess\(\)/.test(dispatcher.readContext.toString())) {
                ignoreDispatcherTransition.add(dispatcher);
            }
            patchStateHook("useState", dispatcher);
            patchStateHook("useReducer", dispatcher);
            patchMemoHook("useMemo", dispatcher);
            patchMemoHook("useCallback", dispatcher);
            patchEffectHook("useEffect", dispatcher);
            patchEffectHook("useLayoutEffect", dispatcher);
            patchContextHook(dispatcher);
            patchSyncExternalStorage(dispatcher);
            if (typeof dispatcher.useTransition === "function") {
                patchStateHook("useTransition", dispatcher);
            }
        }
        return dispatcher;
    }
    if (typeof renderer.getCurrentFiber === "function") {
        Object.defineProperty(renderer.currentDispatcherRef, "current", {
            get() {
                return currentDispatcher;
            },
            set(nextDispatcher) {
                const nextCurrentFiber = renderer.getCurrentFiber();
                const prevDispatcher = currentDispatcher;
                currentDispatcher = patchDispatcher(nextDispatcher);
                // render
                if (nextCurrentFiber !== currentFiber) {
                    currentFiber = nextCurrentFiber;
                    currentFiberCollectInfo = null;
                    currentFiberHookIndex = 0;
                    if (currentFiber !== null) {
                        const alternate = currentFiber.alternate;
                        // collect info on mount only
                        if (alternate === null) {
                            const fiberTypeId = getFiberTypeId(currentFiber.type, currentFiber.tag);
                            if (!fiberTypeInfo.has(fiberTypeId)) {
                                fiberTypeInfo.set(fiberTypeId, (currentFiberCollectInfo = {
                                    hooks: [],
                                }));
                            }
                        }
                        else {
                            // reset stat on update
                            fiberComputedMemo.delete(currentFiber);
                        }
                        let nextCurrentRoot = fiberRoot.get(currentFiber) ||
                            (alternate !== null && fiberRoot.get(alternate)) ||
                            null;
                        if (nextCurrentRoot === null) {
                            let cursor = currentFiber.return;
                            while (cursor !== null) {
                                const root = fiberRoot.get(currentFiber);
                                if (root !== undefined) {
                                    nextCurrentRoot = root;
                                    break;
                                }
                                if (isFiberRoot(cursor)) {
                                    nextCurrentRoot = cursor.stateNode;
                                    break;
                                }
                                cursor = cursor.return;
                            }
                            if (nextCurrentRoot !== null) {
                                fiberRoot.set(currentFiber, nextCurrentRoot);
                            }
                        }
                        currentRoot = nextCurrentRoot;
                    }
                    // currentFiberRerenderState = null;
                    // rerenderStates.delete(currentFiber as Fiber);
                }
                // re-render
                else if (currentFiber !== null &&
                    prevDispatcher !== null &&
                    nextDispatcher !== null &&
                    !ignoreDispatcherTransition.has(prevDispatcher) &&
                    !ignoreDispatcherTransition.has(nextDispatcher)) {
                    //   if (currentFiberRerenderState) {
                    //     if (rerenderStates.has(currentFiber)) {
                    //       rerenderStates.get(currentFiber)?.push(currentFiberRerenderState);
                    //     } else {
                    //       rerenderStates.set(currentFiber, [currentFiberRerenderState]);
                    //     }
                    //   }
                    // avoid collecting info on re-renders
                    currentFiberCollectInfo = null;
                    currentFiberHookIndex = 0;
                }
            },
        });
    }
    return {
        getDispatchHookIndex(dispatch) {
            return dispatch.hookIdx ?? null;
        },
        getFiberTypeHookInfo(fiberTypeId) {
            return fiberTypeInfo.get(fiberTypeId)?.hooks || [];
        },
        getFiberComputes(fiber) {
            return fiberComputedMemo.get(fiber) || [];
        },
        getFiberRerenders(fiber) {
            return rerenderStates.get(fiber);
        },
        flushDispatchCalls(root) {
            const accepted = [];
            const rejected = [];
            for (const dispatchCall of dispatchCalls) {
                if (dispatchCall.root === root) {
                    accepted.push(dispatchCall);
                }
                else {
                    rejected.push(dispatchCall);
                }
            }
            dispatchCalls = rejected;
            return accepted;
        },
    };
}
