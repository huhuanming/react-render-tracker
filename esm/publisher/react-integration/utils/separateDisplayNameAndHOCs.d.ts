import { FiberType } from "../../types";
export declare function separateDisplayNameAndHOCs(displayName: string | null, type: FiberType): {
    displayName: string | null;
    hocDisplayNames: string[] | null;
};
