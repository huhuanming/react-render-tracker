import * as React from "react";
declare type BooleanToggle = (fn: (state: boolean) => boolean) => void;
interface ToolbarProps {
    onGroupingChange: BooleanToggle;
    groupByParent: boolean;
    onShowUnmounted: BooleanToggle;
    showUnmounted: boolean;
    onShowTimings: BooleanToggle;
    showTimings: boolean;
}
declare const ToolbarMemo: React.MemoExoticComponent<({ onGroupingChange, groupByParent, onShowUnmounted, showUnmounted, onShowTimings, showTimings, }: ToolbarProps) => React.JSX.Element>;
export default ToolbarMemo;
