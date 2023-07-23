export declare type Subscriptions<T> = Set<{
    fn: T;
}>;
export declare type SubscriptionsMap<I, T> = Map<I, Subscriptions<T>>;
export declare type ValuesChangeCallback<V> = (values: V[]) => void;
export declare function subscribeById<I, T>(map: SubscriptionsMap<I, T>, id: I, fn: T): () => void;
export declare function subscribe<T>(subscriptions: Subscriptions<T>, fn: T): () => void;
export declare function notifyById<I, T extends (...args: any[]) => void>(map: SubscriptionsMap<I, T>, id: I, ...args: Parameters<T>): void;
export declare function notify<T extends (...args: any[]) => void>(subscriptions: Subscriptions<T>, ...args: Parameters<T>): void;
declare type callback<V> = (value: V) => void;
export declare class SubscribeMap<K, V> extends Map<K, V> {
    private subscriptionsMap;
    private awaitingNotify;
    private valuesSubscriptions;
    hasSubscriptions(id: K): boolean;
    subscribe(id: K, fn: callback<V>): () => void;
    subscribeValues(fn: ValuesChangeCallback<V>): () => void;
    notify(): void;
    set(key: K, value: V): this;
    delete(key: K): boolean;
    clear(): void;
}
export declare class Subset<V> extends Set<V> {
    subscriptions: Subscriptions<callback<V[]>>;
    value: V[];
    subscribe(fn: callback<V[]>): () => void;
    notify(): void;
    add(value: V): this;
    delete(value: V): boolean;
    clear(): void;
}
export declare class SubsetSplit<K, V> extends Map<K, Subset<V>> {
    private awaitingNotify;
    subscribe(id: K, fn: callback<V[]>): () => void;
    notify(id: K): void;
    get(id: K): Subset<V>;
    add(key: K, value: V): this;
    remove(key: K, value: V): boolean;
}
declare type NotifySubject = {
    notify(): void;
};
export declare function awaitNotify(subject: NotifySubject): void;
export declare function stopAwatingNotify(subject: NotifySubject): void;
export declare function flushNotify(subject?: NotifySubject): void;
export {};
