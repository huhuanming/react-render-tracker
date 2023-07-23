import * as React from "react";
import { Diff } from "../diff/Diff";
function UpdateChangesMatrixRow({ headers, data, }) {
    const [expanded, setExpanded] = React.useState(false);
    const { values } = data;
    return (React.createElement(React.Fragment, null,
        React.createElement("tr", { className: "changes-matrix__row" +
                (!values ? " changes-matrix__row_no-details" : ""), onClick: values ? () => setExpanded(expanded => !expanded) : undefined },
            React.createElement("td", null, data.main),
            values?.map((value, index) => (React.createElement("td", { key: index, className: value !== null
                    ? value.diff === false
                        ? "shallow-equal"
                        : "has-diff"
                    : "no-diff" }))) || React.createElement("td", { colSpan: headers.length, className: "no-diff" }),
            React.createElement("td", null)),
        expanded && values && (React.createElement("tr", { className: "changes-matrix__row-details" },
            React.createElement("td", { colSpan: (data.values?.length || 0) + 2 }, values.map((change, idx) => change === null ? null : (React.createElement("div", { key: idx, className: "changes-matrix__diff-line" },
                headers[idx],
                " ",
                React.createElement(Diff, { diff: change.diff, values: change })))))))));
}
export function ChangesMatrix({ mainHeader, headers, data, }) {
    return (React.createElement("table", { className: "changes-matrix" },
        React.createElement("thead", null,
            React.createElement("tr", null,
                React.createElement("th", { className: "changes-matrix__main-header" },
                    React.createElement("div", null,
                        React.createElement("span", null, mainHeader))),
                headers.map((header, index) => (React.createElement("th", { key: index, title: header, className: "changes-matrix__value-header" },
                    React.createElement("div", { className: "changes-matrix__value-header-text-wrapper" },
                        React.createElement("div", { className: "changes-matrix__value-header-text" }, header))))),
                React.createElement("th", { className: "changes-matrix__header-spacer" }))),
        React.createElement("tbody", null, data.map(entry => (React.createElement(UpdateChangesMatrixRow, { key: entry.num, headers: headers, data: entry }))))));
}
