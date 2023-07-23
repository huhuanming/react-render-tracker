import * as React from "react";
import { notify, subscribe, useSubscription } from "./subscription";
const PinnedContext = React.createContext({});
export const usePinnedContext = () => React.useContext(PinnedContext);
export const PinnedContextProvider = ({ children, }) => {
    const value = React.useMemo(() => {
        let pinnedId = 0;
        const subscriptions = new Set();
        const pin = nextPinnedId => {
            const prevPinnedId = pinnedId;
            if (nextPinnedId === prevPinnedId) {
                return;
            }
            pinnedId = nextPinnedId;
            notify(subscriptions, pinnedId);
        };
        return {
            get pinnedId() {
                return pinnedId;
            },
            set pinnedId(id) {
                pin(id);
            },
            pin,
            subscribe(fn) {
                return subscribe(subscriptions, fn);
            },
        };
    }, []);
    return (React.createElement(PinnedContext.Provider, { value: value }, children));
};
export const PinnedIdConsumer = ({ children, }) => {
    const { pinnedId, subscribe } = usePinnedContext();
    const [state, setState] = React.useState(pinnedId);
    useSubscription(() => subscribe(setState));
    return children(state);
};
export const usePinnedId = () => {
    const { pinnedId, subscribe, pin } = usePinnedContext();
    const [state, setState] = React.useState(pinnedId);
    useSubscription(() => subscribe(setState));
    return { pinnedId: state, pin };
};
