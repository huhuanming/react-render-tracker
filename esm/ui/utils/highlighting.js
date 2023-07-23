import * as React from "react";
import { notify, notifyById, subscribe, subscribeById, useSubscription, } from "./subscription";
import { remoteSubscriber } from "../rempl-subscriber";
import { useSelectedId } from "./selection";
const defaultHighlightingContext = {
    enabled: false,
    inspectMode: false,
    highlightedId: null,
    highlight: () => undefined,
    subscribeToInspectMode: () => () => undefined,
    subscribeToHighlightedId: () => () => undefined,
    subscribeToFiberState: () => () => undefined,
    startHighlight: () => undefined,
    stopHighlight: () => undefined,
    startInspect: () => undefined,
    stopInspect: () => undefined,
    toggleInspect: () => undefined,
};
const HighlightingContext = React.createContext(defaultHighlightingContext);
const useHighlightingContext = () => React.useContext(HighlightingContext);
export const HighlightingContextProvider = ({ children, }) => {
    const value = React.useMemo(() => {
        const channel = remoteSubscriber.ns("highlighting");
        let highlightedId = null;
        const inspectModeSubscriptions = new Set();
        const highlightedIdSubscriptions = new Set();
        const fiberStateSubscriptionsById = new Map();
        let inspectMode = false;
        const startInspect = () => {
            channel.callRemote("startInspect");
        };
        const stopInspect = () => {
            channel.callRemote("stopInspect");
        };
        const toggleInspect = () => {
            if (inspectMode) {
                stopInspect();
            }
            else {
                startInspect();
            }
        };
        const highlight = (nextHighlightedId) => {
            if (highlightedId === nextHighlightedId) {
                return;
            }
            if (highlightedId !== null) {
                notifyById(fiberStateSubscriptionsById, highlightedId, false);
            }
            highlightedId = nextHighlightedId;
            if (nextHighlightedId !== null) {
                notifyById(fiberStateSubscriptionsById, nextHighlightedId, true);
            }
            notify(highlightedIdSubscriptions, nextHighlightedId);
        };
        return {
            enabled: true,
            get inspectMode() {
                return inspectMode;
            },
            set inspectMode(mode) {
                mode = Boolean(mode);
                if (mode !== inspectMode) {
                    inspectMode = mode;
                    notify(inspectModeSubscriptions, inspectMode);
                }
            },
            get highlightedId() {
                return highlightedId;
            },
            set highlightedId(id) {
                highlight(id);
            },
            highlight,
            subscribeToInspectMode(fn) {
                return subscribe(inspectModeSubscriptions, fn);
            },
            subscribeToHighlightedId(fn) {
                return subscribe(highlightedIdSubscriptions, fn);
            },
            subscribeToFiberState(id, fn) {
                return subscribeById(fiberStateSubscriptionsById, id, fn);
            },
            startHighlight(id) {
                channel.callRemote("startHighlight", id);
            },
            stopHighlight() {
                channel.callRemote("stopHighlight");
            },
            startInspect,
            stopInspect,
            toggleInspect,
        };
    }, []);
    const { highlight } = value;
    const { select } = useSelectedId();
    React.useEffect(() => {
        let lastInspecting = undefined;
        return remoteSubscriber.ns("highlighting").subscribe(state => {
            if (!state) {
                return;
            }
            const { inspecting, hoveredFiberId } = state;
            if (lastInspecting && inspecting === false && hoveredFiberId !== null) {
                select(hoveredFiberId);
            }
            highlight(inspecting ? hoveredFiberId : null);
            lastInspecting = inspecting;
            value.inspectMode = inspecting;
        });
    }, []);
    return (React.createElement(HighlightingContext.Provider, { value: value }, children));
};
export const useInspectMode = () => {
    const { inspectMode, startInspect, stopInspect, toggleInspect, subscribeToInspectMode, } = useHighlightingContext();
    const [state, setState] = React.useState(inspectMode);
    useSubscription(() => subscribeToInspectMode(setState), []);
    return {
        inspectMode: state,
        startInspect,
        stopInspect,
        toggleInspect,
    };
};
export const useHighlightingState = (id) => {
    const { highlightedId, subscribeToFiberState, startHighlight, stopHighlight, } = useHighlightingContext();
    const [state, setState] = React.useState(id === highlightedId);
    const startHighlightFiber = React.useCallback(() => startHighlight(id), [id]);
    useSubscription(() => subscribeToFiberState(id, setState), [id]);
    return {
        highlighted: state,
        startHighlight: startHighlightFiber,
        stopHighlight,
    };
};
export const useHighlightedId = () => {
    const { highlightedId, highlight, subscribeToHighlightedId } = useHighlightingContext();
    const [state, setState] = React.useState(highlightedId);
    useSubscription(() => subscribeToHighlightedId(setState));
    return {
        highlightedId: state,
        highlight,
    };
};
