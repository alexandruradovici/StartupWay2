export interface CanvasField
{
    [key: string]: any;
}

export interface BModelCanvas {
	modelId:string,
	productId:string,
	date: string,
	fields:CanvasField

}