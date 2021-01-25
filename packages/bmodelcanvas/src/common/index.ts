export interface CanvasField
{
    [key: string]: any;
}

export interface BModelCanvas {
	modelId:number,
	productId:number,
	date: Date,
	fields:CanvasField

}

export const NO_MODEL_CANVAS: BModelCanvas = {
	modelId: 0,
	productId: 0,
	date: new Date(),
	fields: {}
};