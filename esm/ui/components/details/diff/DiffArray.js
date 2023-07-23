import * as React from "react";
import { DiffSimple } from "./DiffSimple";
export function DiffArray({ diff, values, }) {
    const restChanges = diff.eqLeft > 0 || diff.eqRight > 0
        ? `${diff.eqLeft > 0 ? `first ${diff.eqLeft}` : ""}${diff.eqLeft > 0 && diff.eqRight > 0 ? " and " : ""}${diff.eqRight > 0 ? `last ${diff.eqRight}` : ""}${diff.eqLeft + diff.eqRight === 1 ? " element is" : " elements are"} equal`
        : "";
    return (React.createElement(React.Fragment, null,
        React.createElement(DiffSimple, { values: values }),
        diff.prevLength !== diff.nextLength && (React.createElement("div", { className: "diff-line" },
            React.createElement("span", { className: "key" }, "length "),
            React.createElement(DiffSimple, { values: { prev: diff.prevLength, next: diff.nextLength } }))),
        restChanges && React.createElement("span", { className: "diff-rest" }, restChanges)));
}
