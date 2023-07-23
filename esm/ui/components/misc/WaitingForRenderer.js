import * as React from "react";
import { useReactRenderers } from "../../utils/react-renderers";
export default function WaitingForRenderer({ children, }) {
    const { selected: selectedReactInstance, unsupportedRenderers } = useReactRenderers();
    if (selectedReactInstance) {
        return children;
    }
    return (React.createElement("div", { className: "waiting-for-renderer" },
        "Waiting for a supported React renderer to be connected...",
        !unsupportedRenderers.length ? null : (React.createElement("div", { className: "unsupported-renderers" },
            React.createElement("div", null, "Detected unsupported renderers:"),
            React.createElement("ul", { className: "unsupported-renderers__list" }, unsupportedRenderers.map(info => (React.createElement("li", { key: info.id },
                React.createElement("b", null,
                    info.name,
                    " v",
                    info.version),
                " – ",
                info.reason))))))));
}
