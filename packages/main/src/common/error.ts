export enum ServerError {
    NO_ERROR = 0,
    UNAUTHORISED = 401,
    BAD_REQUEST = 400,
    CONFLICT = 409,
    CONNECTION_TIMEOUT = 440,
    INTERNAL_SERVER_ERROR = 500
}

export interface IServerErrorData {
    message: string
}
