import * as React from "react";
interface ButtonToggleProps {
    icon: JSX.Element;
    isActive?: boolean;
    isDisabled?: boolean;
    onChange: (fn: (state: boolean) => boolean) => void;
    tooltip: string;
    className?: string;
}
declare const ButtonToggle: ({ icon, isActive, isDisabled, onChange, tooltip, className, }: ButtonToggleProps) => React.JSX.Element;
export default ButtonToggle;
