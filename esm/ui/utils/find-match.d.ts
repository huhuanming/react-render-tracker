import * as React from "react";
declare type MatchResult = [offset: number, length: number] | null;
declare type MatchChangedHandler = (match: MatchResult) => void;
interface MatchContextValue {
    setPattern(pattern: string): void;
    match(value: string | null): MatchResult;
    subscribe(value: string | null, fn: MatchChangedHandler): () => void;
}
export declare const useFindMatchContext: () => MatchContextValue;
export declare const FindMatchContextProvider: ({ children, }: {
    children: React.ReactNode;
}) => React.JSX.Element;
export declare const useFindMatch: (value: string | null) => MatchResult;
export {};
