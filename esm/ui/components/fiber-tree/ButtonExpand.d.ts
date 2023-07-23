import * as React from "react";
interface ButtonExpandProps {
    expanded: boolean;
    setExpanded?: (value: boolean) => void;
}
declare const ButtonExpand: ({ expanded, setExpanded }: ButtonExpandProps) => React.JSX.Element;
export default ButtonExpand;
