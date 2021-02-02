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