export * from "../../data/subscription";
export declare function useSubscription(subscribe: () => () => void, deps?: any[]): void;
export declare function useComputeSubscription<T>(compute: () => T, subscribe: (requestRecompute: () => void, accept: boolean) => () => void): T;
export declare function useDebouncedComputeSubscription<T>(compute: () => T, subscribe: (requestRecompute: () => void) => () => void, debounced: number): T;
