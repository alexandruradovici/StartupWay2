export enum SnackBarTypes {
	ERROR="error",
	INFO="info",
	SUCCESS="success"
}

export enum SnackBarHorizontal {
	LEFT="left",
	RIGHT="right"
}

export enum SnackBarVertical {
	TOP="top",
	BOTTOM="bottom"
}
export interface SnackBarOptions {
	text: string,
	type: SnackBarTypes,
	timeout?: number,
	horizontal?: SnackBarHorizontal,
	vertical?: SnackBarVertical
}
export interface SimpleMenuOptions {
	menuName: string,
	menuIcon: string,
	menuTooltip: string,
	items: SimpleMenuItem[],
	img?:string
}
export interface SimpleMenuItem {
	id: string,
	icon: string,
	title: string,
	link?: string,
	img?: string
}