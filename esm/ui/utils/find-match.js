import * as React from "react";
import debounce from "lodash.debounce";
import { notifyById, subscribeById } from "./subscription";
const FindMatchContext = React.createContext({
    setPattern: () => undefined,
    match: () => null,
    subscribe: () => () => undefined,
});
export const useFindMatchContext = () => React.useContext(FindMatchContext);
export const FindMatchContextProvider = ({ children, }) => {
    const applyPattern = React.useMemo(() => debounce(() => {
        for (const value of awaitingNotify) {
            notifyById(subscriptions, value, matches.get(value) || null);
        }
        awaitingNotify.clear();
    }, 75, { maxWait: 350 }), []);
    const { subscriptions, awaitingNotify, matches, matchValue, setPattern } = React.useMemo(() => {
        const subscriptions = new Map();
        const awaitingNotify = new Set();
        const matches = new Map();
        const matchValue = (value) => {
            let result = null;
            if (typeof pattern === "string" && pattern !== "") {
                const offset = value.toLowerCase().indexOf(pattern.toLowerCase());
                if (offset !== -1) {
                    result = [offset, pattern.length];
                }
            }
            matches.set(value, result);
            return result;
        };
        let pattern = "";
        const setPattern = (nextPattern) => {
            nextPattern || (nextPattern = "");
            if (nextPattern === pattern) {
                return;
            }
            pattern = nextPattern;
            for (const [value, prevMatch] of matches) {
                const nextMatch = matchValue(value);
                if (prevMatch !== nextMatch) {
                    awaitingNotify.add(value);
                }
            }
            applyPattern();
        };
        return {
            subscriptions,
            awaitingNotify,
            matches,
            matchValue,
            setPattern,
        };
    }, []);
    const value = React.useMemo(() => {
        return {
            setPattern,
            match(value) {
                if (value === null) {
                    return null;
                }
                if (matches.has(value)) {
                    return matches.get(value) || null;
                }
                return matchValue(value);
            },
            subscribe(value, fn) {
                return subscribeById(subscriptions, value, fn);
            },
        };
    }, []);
    return (React.createElement(FindMatchContext.Provider, { value: value }, children));
};
export const useFindMatch = (value) => {
    const { match, subscribe } = useFindMatchContext();
    const [state, setState] = React.useState(() => match(value));
    React.useEffect(() => subscribe(value, setState), [value]);
    return state;
};
