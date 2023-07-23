import * as React from "react";
import { ReactRendererInfo } from "common-types";
import { LinkedEvent, Message } from "../types";
interface EventsContext {
    allEvents: Message[];
    events: Message[];
    loadingStartOffset: number;
    loadedEventsCount: number;
    totalEventsCount: number;
    bytesReceived: number;
    mountCount: number;
    unmountCount: number;
    updateCount: number;
    clearAllEvents: () => void;
    paused: boolean;
    setPaused: (paused: boolean) => void;
}
declare const EventsContext: React.Context<EventsContext>;
export declare const useEventsContext: () => EventsContext;
export declare function EventsContextProvider({ channelId, children, }: {
    channelId: ReactRendererInfo["channelId"];
    children: React.ReactNode;
}): React.JSX.Element;
export declare function useEventLog(fiberId: number, groupByParent: boolean, includeUnmounted: boolean, includeSubtree: boolean): LinkedEvent[];
export {};
