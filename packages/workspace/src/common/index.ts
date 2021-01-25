export type ToolbarButtonActionFunction = () => void;
export type ToolbarButtonVisibleFunction = () => boolean;
export type ToolbarButtonEnabledFunction = () => boolean;

export enum ToolbarButtonPosition {
	LEFT,
	RIGHT
}

export interface ToolbarButtonOptions {
	priority?: number;
	position?: ToolbarButtonPosition,
	action?: ToolbarButtonActionFunction | undefined;
	visible?: ToolbarButtonVisibleFunction;
	enabled?: ToolbarButtonEnabledFunction;
}

export interface ToolbarButton {
	view: string,
	priority: number;
	position: ToolbarButtonPosition,
	action: ToolbarButtonActionFunction | undefined;
	visible: ToolbarButtonVisibleFunction;
	enabled: ToolbarButtonEnabledFunction;
}