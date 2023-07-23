import * as React from "react";
export interface TreeLeafProps {
    fiberId: number;
    depth?: number;
}
declare const TreeLeaf: React.MemoExoticComponent<({ fiberId, depth }: TreeLeafProps) => React.JSX.Element | null>;
export default TreeLeaf;
