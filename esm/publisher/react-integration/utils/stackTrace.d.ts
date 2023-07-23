declare type LineParseResult = null | {
    name: string;
    loc: string | null;
};
export declare function extractCallLoc(depth: number): string | null;
/**
 * This parses the different stack traces and puts them into one format
 * This borrows heavily from TraceKit (https://github.com/csnover/TraceKit)
 */
export declare function parseStackTrace(stackString: string): LineParseResult[];
export declare function parseStackTraceLine(line: string): LineParseResult;
export {};
