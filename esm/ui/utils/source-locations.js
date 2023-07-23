import * as React from "react";
import * as ReactDOM from "react-dom";
import { remoteSubscriber } from "../rempl-subscriber";
import { SubscribeMap, useSubscription } from "./subscription";
const callAsap = typeof requestIdleCallback === "function"
    ? requestIdleCallback
    : (fn) => Promise.resolve().then(fn);
const SourceLocationsContext = React.createContext({
    subscribe: () => () => undefined,
    resolvedLocation: () => null,
});
export const useSourceLocations = () => React.useContext(SourceLocationsContext);
export function SourceLocationsContextProvider({ children, }) {
    const value = React.useMemo(() => {
        const resolvedLocations = new SubscribeMap();
        const knownLocations = new Set();
        const awaitResolve = new Set();
        let flushAwaitResolveScheduled = false;
        let resolveMethodAvailable = false;
        const checkLoc = (loc) => {
            if (!loc || knownLocations.has(loc)) {
                return;
            }
            knownLocations.add(loc);
            awaitResolve.add(loc);
            if (!flushAwaitResolveScheduled) {
                callAsap(flushAwaitResolve);
                flushAwaitResolveScheduled = true;
            }
        };
        const flushAwaitResolve = () => {
            remoteSubscriber
                .callRemote("resolve-source-locations", [...awaitResolve])
                .then(result => {
                for (const { loc, resolved } of result) {
                    resolvedLocations.set(loc, resolved);
                }
                ReactDOM.unstable_batchedUpdates(() => {
                    resolvedLocations.notify();
                });
            });
            flushAwaitResolveScheduled = false;
            awaitResolve.clear();
        };
        remoteSubscriber.onRemoteMethodsChanged(methods => {
            const nextResolveMethodAvailable = methods.includes("resolve-source-locations");
            if (!resolveMethodAvailable) {
                flushAwaitResolve();
            }
            resolveMethodAvailable = nextResolveMethodAvailable;
        });
        return {
            resolvedLocation(loc) {
                checkLoc(loc);
                return resolvedLocations.get(loc || "") || null;
            },
            subscribe(loc, fn) {
                checkLoc(loc);
                return resolvedLocations.subscribe(loc, fn);
            },
        };
    }, []);
    return (React.createElement(SourceLocationsContext.Provider, { value: value }, children));
}
export const useResolvedLocation = (loc) => {
    const { resolvedLocation, subscribe } = useSourceLocations();
    const [state, setState] = React.useState(resolvedLocation(loc));
    useSubscription(() => (loc ? subscribe(loc, setState) : () => null), [loc]);
    return state;
};
