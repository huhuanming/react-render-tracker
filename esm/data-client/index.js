import { getSelfSubscriber, } from "rempl";
import { ToolId } from "../common/constants";
const subscriber = getSelfSubscriber(ToolId);
let getEventsMethod = null;
let getEventsStateMethod = null;
const cachedEvents = [];
const newEventListeners = [];
let totalEventsCount = 0;
let syncing = false;
let selectedRendererChannel = null;
const rendererReady = new Promise(resolve => subscriber.ns("react-renderers").subscribe(({ renderers }) => {
    if (selectedRendererChannel === null && renderers.length > 0) {
        selectedRendererChannel = subscriber.ns(renderers[0].channelId);
        getEventsMethod = selectedRendererChannel.getRemoteMethod("getEvents");
        getEventsStateMethod =
            selectedRendererChannel.getRemoteMethod("getEventsState");
        resolve(selectedRendererChannel);
    }
}));
async function syncEvents() {
    if (syncing) {
        return;
    }
    try {
        let hasNewEvents = false;
        syncing = true;
        while (cachedEvents.length < totalEventsCount) {
            if (!getEventsMethod?.available) {
                break;
            }
            const chunk = await getEventsMethod(cachedEvents.length, 1000);
            cachedEvents.push(...chunk);
            if (!chunk.length) {
                break;
            }
            hasNewEvents = true;
        }
        if (hasNewEvents) {
            for (const listener of newEventListeners) {
                listener();
            }
        }
    }
    finally {
        syncing = false;
    }
}
export async function getEvents(offset = 0, limit = Infinity) {
    await getEventCount();
    await syncEvents();
    return cachedEvents.slice(offset, offset + limit);
}
export function subscribeNewEvents(callback, offset = cachedEvents.length) {
    const callbackWrapper = () => {
        try {
            callback(cachedEvents.slice(offset));
            offset = cachedEvents.length;
        }
        catch { }
    };
    newEventListeners.push(callbackWrapper);
    if (offset < cachedEvents.length) {
        callback(cachedEvents.slice(offset));
    }
    offset = cachedEvents.length;
    if (!newEventListeners.subscribed) {
        rendererReady.then(channel => {
            channel.subscribe(state => {
                totalEventsCount = Math.max(totalEventsCount, state?.count || 0);
                syncEvents();
            });
        });
        newEventListeners.subscribed = true;
    }
    return () => {
        const idx = newEventListeners.indexOf(callbackWrapper);
        if (idx !== -1) {
            newEventListeners.splice(idx, 1);
        }
    };
}
export async function getEventCount() {
    if (!getEventsStateMethod?.available) {
        return 0;
    }
    totalEventsCount = (await getEventsStateMethod())?.count || 0;
    return totalEventsCount;
}
export function isConnected() {
    return subscriber.connected.value;
}
export function subscribeConnected(fn) {
    subscriber.connected.link(fn);
    return () => subscriber.connected.off(fn);
}
export function isReady() {
    return new Promise(resolve => {
        let methods = [];
        let connected = subscriber.connected.value;
        const check = () => {
            if (connected && methods.includes("getEvents")) {
                subscriber.connected.off(onConnected);
                unsubscribeRemoteMethodsChanged();
                resolve();
            }
        };
        const onConnected = (newConnected) => {
            connected = newConnected;
            check();
        };
        subscriber.connected.on(onConnected);
        let unsubscribeRemoteMethodsChanged = () => undefined;
        rendererReady.then(channel => {
            unsubscribeRemoteMethodsChanged = channel.onRemoteMethodsChanged(newMethods => {
                methods = newMethods;
                check();
            });
        });
        check();
    });
}
