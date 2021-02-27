import { Request, Response } from "express";
import { ServerError, IServerErrorData } from "./error";
export declare type ApiResponse<T> = _ApiResponse<T> | _ApiErrorResponse;
export interface ApiRequest<T> extends Request {
    body: T;
}
export interface _ApiResponse<T> extends Response {
    err: ServerError.NO_ERROR;
    data: T;
}
export interface _ApiErrorResponse extends Response {
    err: Exclude<ServerError, ServerError.NO_ERROR>;
    data: IServerErrorData;
}
//# sourceMappingURL=index.d.ts.map