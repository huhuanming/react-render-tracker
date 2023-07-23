import * as React from "react";
import { DiffSimple } from "./DiffSimple";
function plural(value, one, many) {
    return value === 1 ? `${value} ${one}` : `${value} ${many}`;
}
export function DiffObject({ diff }) {
    const sampleSize = diff.sample.length;
    const restKeys = diff.keys - sampleSize;
    const restNotes = restKeys === 0
        ? false
        : diff.diffKeys <= sampleSize
            ? `… all the rest ${plural(restKeys, "entry has", "entries have")} not changed`
            : diff.keys === diff.diffKeys
                ? `… all the rest ${plural(restKeys, "entry is", "entries are")} also changed`
                : `… ${diff.diffKeys - sampleSize} of the rest ${plural(restKeys, "entry", "entries")} ${diff.diffKeys - sampleSize === 1 ? "is" : "are"} also changed`;
    return (React.createElement(React.Fragment, null,
        React.createElement("span", { className: "diff-bracket" }, "{"),
        diff.sample.map(values => {
            const key = React.createElement("span", { className: "key" }, `${values.name}: `);
            if ("prev" in values === false) {
                return (React.createElement("div", { key: values.name, className: "diff-line added" },
                    key,
                    React.createElement("code", { className: "diff-value" }, values.next)));
            }
            if ("next" in values === false) {
                return (React.createElement("div", { key: values.name, className: "diff-line removed" },
                    key,
                    React.createElement("code", { className: "diff-value removed" }, values.prev)));
            }
            return (React.createElement("div", { key: values.name, className: "diff-line" },
                key,
                React.createElement(DiffSimple, { values: values })));
        }),
        restNotes && React.createElement("span", { className: "diff-rest" }, restNotes),
        React.createElement("span", { className: "diff-bracket" }, "}")));
}
