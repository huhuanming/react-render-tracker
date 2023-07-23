import * as React from "react";
import { TransferChangeDiff } from "../../../types";
declare type UpdateChangesRow = {
    num: number;
    main: JSX.Element | string;
    values: Array<null | {
        prev: string;
        next: string;
        diff?: TransferChangeDiff;
    }> | null;
};
export declare function ChangesMatrix({ mainHeader, headers, data, }: {
    mainHeader: string;
    headers: string[];
    data: UpdateChangesRow[];
}): React.JSX.Element;
export {};
