import { Message } from "common-types";
export declare function getEvents(offset?: number, limit?: number): Promise<Message[]>;
export declare function subscribeNewEvents(callback: (newEvents: Message[]) => void, offset?: number): () => void;
export declare function getEventCount(): Promise<number>;
export declare function isConnected(): boolean;
export declare function subscribeConnected(fn: (value: boolean) => void): () => void;
export declare function isReady(): Promise<void>;
