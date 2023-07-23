import * as React from "react";
import { remoteSubscriber } from "../rempl-subscriber";
const MemoryLeaksContext = React.createContext({
    breakLeakedObjectRefs: () => undefined,
    exposeLeakedObjectsToGlobal: () => undefined,
    cancelExposingLeakedObjectsToGlobal: () => undefined,
    exposedLeaks: null,
});
export const useMemoryLeaks = () => React.useContext(MemoryLeaksContext);
export function MemoryLeaksContextProvider({ children, }) {
    const ns = remoteSubscriber.ns("memory-leaks");
    const [exposedLeaksState, setExposedLeaksState] = React.useState(null);
    const value = React.useMemo(() => {
        return {
            exposedLeaks: exposedLeaksState,
            breakLeakedObjectRefs() {
                ns.callRemote("breakLeakedObjectRefs");
            },
            exposeLeakedObjectsToGlobal(fiberIds) {
                ns.callRemote("exposeLeakedObjectsToGlobal", fiberIds);
            },
            cancelExposingLeakedObjectsToGlobal() {
                ns.callRemote("cancelExposingLeakedObjectsToGlobal");
            },
        };
    }, [exposedLeaksState]);
    React.useEffect(() => remoteSubscriber
        .ns("memory-leaks")
        .subscribe(state => setExposedLeaksState(state)), []);
    return (React.createElement(MemoryLeaksContext.Provider, { value: value }, children));
}
