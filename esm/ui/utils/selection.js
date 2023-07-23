import * as React from "react";
import { notify, notifyById, subscribe, subscribeById, useSubscription, } from "./subscription";
const SelectionContext = React.createContext({});
const useSelectionContext = () => React.useContext(SelectionContext);
export const SelectionContextProvider = ({ children, }) => {
    const value = React.useMemo(() => {
        function createHistoryState() {
            const hasPrev = historyIndex > 0;
            const hasNext = historyIndex < history.length - 1;
            return {
                hasPrev,
                prev() {
                    if (hasPrev) {
                        if (selectedId !== null && history[historyIndex] !== selectedId) {
                            history.push(selectedId);
                            historyIndex++;
                        }
                        selectInternal(history[--historyIndex]);
                        notify(historySubscriptions, (historyState = createHistoryState()));
                    }
                },
                hasNext,
                next() {
                    if (hasNext) {
                        selectInternal(history[++historyIndex]);
                        notify(historySubscriptions, (historyState = createHistoryState()));
                    }
                },
            };
        }
        let selectedId = null;
        let historyIndex = -1;
        let history = [];
        let historyState = createHistoryState();
        const subscriptions = new Set();
        const historySubscriptions = new Set();
        const stateSubscriptionsById = new Map();
        const select = (nextSelectedId, pushHistory = true) => {
            if (nextSelectedId === selectedId) {
                return;
            }
            if (nextSelectedId !== null) {
                history = history.slice(0, historyIndex + 1);
                if (pushHistory) {
                    if (selectedId !== null && history[historyIndex] !== selectedId) {
                        history.push(selectedId);
                    }
                    historyIndex = history.push(nextSelectedId) - 1;
                }
                notify(historySubscriptions, (historyState = createHistoryState()));
            }
            selectInternal(nextSelectedId);
        };
        const selectInternal = (nextSelectedId) => {
            const prevSelectedId = selectedId;
            selectedId = nextSelectedId;
            if (prevSelectedId !== null) {
                notifyById(stateSubscriptionsById, prevSelectedId, false);
            }
            if (nextSelectedId !== null) {
                notifyById(stateSubscriptionsById, nextSelectedId, true);
            }
            notify(subscriptions, selectedId);
        };
        return {
            get selectedId() {
                return selectedId;
            },
            set selectedId(id) {
                select(id);
            },
            select,
            subscribe(fn) {
                return subscribe(subscriptions, fn);
            },
            subscribeToIdState(id, fn) {
                return subscribeById(stateSubscriptionsById, id, fn);
            },
            // history
            get historyState() {
                return historyState;
            },
            subscribeToHistoryState(fn) {
                return subscribe(historySubscriptions, fn);
            },
        };
    }, []);
    return (React.createElement(SelectionContext.Provider, { value: value }, children));
};
export const SelectedIdConsumer = ({ children, }) => {
    const { selectedId } = useSelectedId();
    return children(selectedId);
};
export const useSelectionState = (id) => {
    const { selectedId, subscribeToIdState, select } = useSelectionContext();
    const [state, setState] = React.useState(id === selectedId);
    useSubscription(() => subscribeToIdState(id, setState), [id]);
    return { selected: state, select };
};
export const useSelectionHistoryState = () => {
    const { historyState, subscribeToHistoryState } = useSelectionContext();
    const [state, setState] = React.useState(historyState);
    useSubscription(() => subscribeToHistoryState(setState));
    return state;
};
export const useSelectedId = () => {
    const { selectedId, subscribe, select } = useSelectionContext();
    const [state, setState] = React.useState(selectedId);
    useSubscription(() => subscribe(setState));
    return { selectedId: state, select };
};
