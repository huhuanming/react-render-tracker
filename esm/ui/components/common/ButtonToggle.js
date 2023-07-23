import * as React from "react";
const ButtonToggle = ({ icon, isActive = false, isDisabled = false, onChange, tooltip, className, }) => {
    const handleClick = React.useCallback((event) => {
        event.stopPropagation();
        onChange((prev) => !prev);
    }, [onChange]);
    return (React.createElement("button", { className: `button-toggle${isActive ? " active" : ""}${className ? " " + className : ""}`, disabled: isDisabled, onClick: handleClick, title: tooltip }, icon));
};
export default ButtonToggle;
