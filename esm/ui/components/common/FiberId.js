import * as React from "react";
const FiberId = ({ id }) => {
    return React.createElement("span", { className: "fiber-id" },
        "#",
        id);
};
export default FiberId;
