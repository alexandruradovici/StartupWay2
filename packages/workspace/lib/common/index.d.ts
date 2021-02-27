export declare type ToolbarButtonActionFunction = () => void;
export declare type ToolbarButtonVisibleFunction = () => boolean;
export declare type ToolbarButtonEnabledFunction = () => boolean;
export declare enum ToolbarButtonPosition {
    LEFT = 0,
    RIGHT = 1
}
export interface ToolbarButtonOptions {
    priority?: number;
    position?: ToolbarButtonPosition;
    action?: ToolbarButtonActionFunction | undefined;
    visible?: ToolbarButtonVisibleFunction;
    enabled?: ToolbarButtonEnabledFunction;
}
export interface ToolbarButton {
    view: string;
    priority: number;
    position: ToolbarButtonPosition;
    action: ToolbarButtonActionFunction | undefined;
    visible: ToolbarButtonVisibleFunction;
    enabled: ToolbarButtonEnabledFunction;
}
//# sourceMappingURL=index.d.ts.map