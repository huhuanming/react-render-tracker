import * as React from "react";
declare const TreeMemo: React.MemoExoticComponent<({ rootId, groupByParent, showUnmounted, showTimings, }: {
    rootId: number;
    groupByParent?: boolean | undefined;
    showUnmounted?: boolean | undefined;
    showTimings?: boolean | undefined;
}) => React.JSX.Element>;
export default TreeMemo;
