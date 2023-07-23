import { ElementTypeHostComponent, ElementTypeHostPortal, ElementTypeHostText, } from "../../common/constants";
export function isHostType(type) {
    return (type === ElementTypeHostComponent ||
        type === ElementTypeHostText ||
        type === ElementTypeHostPortal);
}
