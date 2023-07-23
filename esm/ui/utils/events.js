import * as React from "react";
import * as ReactDOM from "react-dom";
import { stringifyInfo } from "@discoveryjs/json-ext";
import { remoteSubscriber } from "../rempl-subscriber";
import { useFiberMaps } from "./fiber-maps";
import { useDebouncedComputeSubscription } from "./subscription";
import { flushNotify, subscribeSubtree, processEvents } from "../../data";
const noop = () => undefined;
const createEventsContextValue = () => ({
    allEvents: [],
    events: [],
    loadingStartOffset: 0,
    loadedEventsCount: 0,
    totalEventsCount: 0,
    bytesReceived: 0,
    mountCount: 0,
    unmountCount: 0,
    updateCount: 0,
    clearAllEvents: noop,
    paused: true,
    setPaused: noop,
});
const EventsContext = React.createContext(createEventsContextValue());
export const useEventsContext = () => React.useContext(EventsContext);
export function EventsContextProvider({ channelId, children, }) {
    const [state, setState] = React.useState(createEventsContextValue);
    const { allEvents } = state;
    const eventsSince = React.useRef(0);
    const [paused, setStatePaused] = React.useState(false);
    const setEffectPaused = React.useRef(noop);
    const setPaused = React.useCallback((paused) => {
        setStatePaused(paused);
        setEffectPaused.current(paused);
    }, []);
    const maps = useFiberMaps();
    const { fiberById, parentTreeIncludeUnmounted, ownerTreeIncludeUnmounted, leakedFibers, } = maps;
    const clearAllEvents = React.useCallback(() => {
        for (const [id, fiber] of fiberById) {
            if (fiber.events.length > 0) {
                fiberById.set(id, {
                    ...fiber,
                    events: [],
                    leaked: 0,
                    warnings: 0,
                    updatesCount: 0,
                    updatesBailoutCount: 0,
                    updatesBailoutStateCount: 0,
                    totalTime: 0,
                    selfTime: 0,
                });
            }
            if (!fiber.mounted) {
                parentTreeIncludeUnmounted.delete(fiber.id);
                ownerTreeIncludeUnmounted.delete(fiber.id);
            }
            if (fiber.leaked) {
                leakedFibers.delete(fiber.id);
            }
        }
        setState(state => {
            eventsSince.current += state.events.length;
            return {
                ...state,
                events: [],
                loadingStartOffset: 0,
                loadedEventsCount: 0,
                totalEventsCount: state.totalEventsCount - state.events.length,
                bytesReceived: 0,
                mountCount: 0,
                unmountCount: 0,
                updateCount: 0,
            };
        });
        flushNotify();
    }, [fiberById, parentTreeIncludeUnmounted, ownerTreeIncludeUnmounted]);
    const value = React.useMemo(() => ({
        ...state,
        paused,
        setPaused,
        clearAllEvents,
    }), [state, paused, setPaused, clearAllEvents]);
    React.useEffect(() => {
        const channel = remoteSubscriber.ns(channelId);
        const remoteLoadEvents = channel.getRemoteMethod("getEvents");
        const EVENT_COUNT = 512;
        let loadingStartOffset = 0;
        let lastLoadedOffset = 0;
        let totalEventsCount = 0;
        let loading = false;
        let paused = false;
        let pendingEventsChunk = null;
        setEffectPaused.current = (newPaused) => {
            if (newPaused !== paused) {
                paused = newPaused;
                if (!paused) {
                    applyEventsChunk();
                    loadEvents();
                }
                else {
                    setTimeout(() => flushUpdatedMaps(), 16);
                }
            }
        };
        const applyEventsChunk = () => {
            if (paused || pendingEventsChunk === null) {
                return;
            }
            const eventsChunk = pendingEventsChunk;
            pendingEventsChunk = null;
            lastLoadedOffset += eventsChunk.length;
            loading = false;
            loadEvents(); // call load events to make sure there are no more events
            const { minLength: bytesReceived } = stringifyInfo(eventsChunk);
            const { mountCount, unmountCount, updateCount } = processEvents(eventsChunk, allEvents, maps);
            setState(state => {
                state.events.push(...eventsChunk);
                return {
                    ...state,
                    loadedEventsCount: state.loadedEventsCount + eventsChunk.length,
                    totalEventsCount: totalEventsCount - eventsSince.current,
                    bytesReceived: state.bytesReceived + bytesReceived,
                    mountCount: state.mountCount + mountCount,
                    unmountCount: state.unmountCount + unmountCount,
                    updateCount: state.updateCount + updateCount,
                };
            });
        };
        const loadEvents = () => {
            if (loading || !remoteLoadEvents.available) {
                return;
            }
            if (lastLoadedOffset < eventsSince.current) {
                loadingStartOffset = eventsSince.current;
                lastLoadedOffset = eventsSince.current;
            }
            if (lastLoadedOffset >= totalEventsCount) {
                loadingStartOffset = totalEventsCount;
                // flush updates async
                setTimeout(() => flushUpdatedMaps(), 16);
                return;
            }
            if (paused) {
                return;
            }
            loading = true;
            remoteLoadEvents(lastLoadedOffset, Math.min(totalEventsCount - lastLoadedOffset, EVENT_COUNT)).then((eventsChunk) => {
                pendingEventsChunk = eventsChunk;
                applyEventsChunk();
            });
        };
        channel.onRemoteMethodsChanged(methods => {
            if (methods.includes("getEvents")) {
                loadEvents();
            }
        });
        return channel.subscribe(data => {
            const { count } = data || { count: 0 };
            if (count !== totalEventsCount) {
                totalEventsCount = count;
                setState(state => ({
                    ...state,
                    loadingStartOffset: loadingStartOffset - eventsSince.current,
                    totalEventsCount: totalEventsCount - eventsSince.current,
                }));
                loadEvents();
            }
        });
    }, [maps]);
    return (React.createElement(EventsContext.Provider, { value: value }, children));
}
function flushUpdatedMaps() {
    ReactDOM.unstable_batchedUpdates(() => {
        flushNotify();
    });
}
export function useEventLog(fiberId, groupByParent, includeUnmounted, includeSubtree) {
    const { fiberById, selectTree } = useFiberMaps();
    const tree = selectTree(groupByParent, includeUnmounted);
    const subtree = React.useMemo(() => new Map(), [fiberId, includeSubtree, fiberById, tree]);
    const compute = React.useCallback(() => {
        const commitIds = new Set();
        const events = [];
        for (const id of subtree.keys()) {
            const fiber = fiberById.get(id);
            if (fiber) {
                for (const linkedEvent of fiber.events) {
                    commitIds.add(linkedEvent.event.commitId);
                    events.push(linkedEvent);
                }
            }
        }
        return events.sort((a, b) => a.event.id - b.event.id);
    }, [subtree, fiberById]);
    const subscribe = React.useCallback(requestRecompute => {
        // subtree
        if (includeSubtree) {
            return subscribeSubtree(fiberId, tree, (added, removed) => {
                for (const id of added) {
                    if (!subtree.has(id)) {
                        subtree.set(id, fiberById.subscribe(id, requestRecompute));
                    }
                }
                for (const id of removed) {
                    const unsubscribe = subtree.get(id);
                    if (typeof unsubscribe === "function") {
                        unsubscribe();
                        subtree.delete(id);
                    }
                }
                requestRecompute();
            });
        }
        // single fiber
        subtree.set(fiberId, fiberById.subscribe(fiberId, requestRecompute));
        return () => {
            const unsubscribe = subtree.get(fiberId);
            if (typeof unsubscribe === "function") {
                unsubscribe(); // unsubscribe
                subtree.delete(fiberId);
            }
        };
    }, [fiberId, includeSubtree, subtree]);
    return useDebouncedComputeSubscription(compute, subscribe, 50);
}
