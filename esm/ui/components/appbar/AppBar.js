import * as React from "react";
import { Renderer } from "./Renderer";
import { useInspectMode } from "../../utils/highlighting";
const renderer = React.createElement(Renderer, null);
const AppBar = ({ pages, page, setPage, }) => {
    const { inspectMode, toggleInspect } = useInspectMode();
    return (React.createElement("div", { className: "app-bar" },
        React.createElement("div", { className: "app-bar__prelude" },
            React.createElement("button", { className: `app-bar__pick-component${inspectMode ? " active" : ""}`, onClick: toggleInspect, title: "Select a component in the page to inspect it" }, "\u00A0")),
        Object.values(pages).map(({ id, title, disabled, badge: Badge }) => disabled ? (React.createElement(React.Fragment, { key: id })) : (React.createElement("div", { key: id, className: "app-bar__tab" + (page === id ? " selected" : ""), onClick: () => setPage(id) },
            title,
            Badge ? (React.createElement("span", { className: "app-bar__tab-badge" },
                React.createElement(Badge, null))) : null))),
        renderer));
};
const AppbarMemo = React.memo(AppBar);
AppbarMemo.displayName = "AppBar";
export default AppbarMemo;
