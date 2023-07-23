const EmptySet = new Set();
export function subscribeById(map, id, fn) {
    let subscriptions = map.get(id);
    if (typeof subscriptions === "undefined") {
        subscriptions = new Set();
        map.set(id, subscriptions);
    }
    return subscribe(subscriptions, fn);
}
export function subscribe(subscriptions, fn) {
    let entry = { fn };
    subscriptions.add(entry);
    return () => {
        subscriptions.delete(entry);
        entry = undefined;
    };
}
export function notifyById(map, id, ...args) {
    return notify(map.get(id) || EmptySet, ...args);
}
export function notify(subscriptions, ...args) {
    for (const { fn } of subscriptions) {
        fn(...args);
    }
}
export class SubscribeMap extends Map {
    constructor() {
        super(...arguments);
        this.subscriptionsMap = new Map();
        this.awaitingNotify = new Set();
        this.valuesSubscriptions = new Set();
    }
    hasSubscriptions(id) {
        const subscriptions = this.subscriptionsMap.get(id);
        return subscriptions !== undefined && subscriptions.size > 0;
    }
    subscribe(id, fn) {
        return subscribeById(this.subscriptionsMap, id, fn);
    }
    subscribeValues(fn) {
        return subscribe(this.valuesSubscriptions, fn);
    }
    notify() {
        for (const id of this.awaitingNotify) {
            notifyById(this.subscriptionsMap, id, this.get(id) || null);
        }
        if (this.valuesSubscriptions.size) {
            notify(this.valuesSubscriptions, []);
        }
    }
    set(key, value) {
        this.awaitingNotify.add(key);
        awaitNotify(this);
        return super.set(key, value);
    }
    delete(key) {
        this.awaitingNotify.delete(key);
        awaitNotify(this);
        return super.delete(key);
    }
    clear() {
        this.awaitingNotify.clear();
        awaitNotify(this);
        return super.clear();
    }
}
export class Subset extends Set {
    constructor() {
        super(...arguments);
        this.subscriptions = new Set();
        this.value = [];
    }
    subscribe(fn) {
        return subscribe(this.subscriptions, fn);
    }
    notify() {
        this.value = [...this.values()];
        if (this.subscriptions.size === 0) {
            return;
        }
        notify(this.subscriptions, this.value);
    }
    add(value) {
        awaitNotify(this);
        return super.add(value);
    }
    delete(value) {
        awaitNotify(this);
        return super.delete(value);
    }
    clear() {
        awaitNotify(this);
        return super.clear();
    }
}
export class SubsetSplit extends Map {
    constructor() {
        super(...arguments);
        this.awaitingNotify = new Set();
    }
    subscribe(id, fn) {
        return this.get(id).subscribe(fn);
    }
    notify(id) {
        return this.get(id).notify();
    }
    get(id) {
        let subset = super.get(id);
        if (subset === undefined) {
            this.set(id, (subset = new Subset()));
        }
        return subset;
    }
    add(key, value) {
        const subset = this.get(key);
        subset.add(value);
        return this;
    }
    remove(key, value) {
        const subset = this.get(key);
        if (subset !== undefined) {
            subset.delete(value);
        }
        return this.delete(key);
    }
}
const awaitingNotify = new Set();
export function awaitNotify(subject) {
    awaitingNotify.add(subject);
}
export function stopAwatingNotify(subject) {
    awaitingNotify.delete(subject);
}
export function flushNotify(subject) {
    if (subject) {
        if (awaitingNotify.has(subject)) {
            subject.notify();
            awaitingNotify.delete(subject);
        }
        return;
    }
    for (const subject of awaitingNotify) {
        subject.notify();
    }
    awaitingNotify.clear();
}
