import * as React from "react";
const ButtonExpand = ({ expanded, setExpanded }) => {
    const collapsedCls = expanded ? "expanded" : "";
    const disabledCls = setExpanded ? "" : "disabled";
    const handleClick = setExpanded &&
        ((event) => {
            event.stopPropagation();
            setExpanded(!expanded);
        });
    return (React.createElement("button", { className: `button-expand ${collapsedCls} ${disabledCls}`, tabIndex: -1, onClick: handleClick }));
};
export default ButtonExpand;
