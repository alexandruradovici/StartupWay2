"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServerError = void 0;
var ServerError;
(function (ServerError) {
    ServerError[ServerError["NO_ERROR"] = 0] = "NO_ERROR";
    ServerError[ServerError["UNAUTHORISED"] = 401] = "UNAUTHORISED";
    ServerError[ServerError["BAD_REQUEST"] = 400] = "BAD_REQUEST";
    ServerError[ServerError["CONFLICT"] = 409] = "CONFLICT";
    ServerError[ServerError["CONNECTION_TIMEOUT"] = 440] = "CONNECTION_TIMEOUT";
    ServerError[ServerError["INTERNAL_SERVER_ERROR"] = 500] = "INTERNAL_SERVER_ERROR";
})(ServerError = exports.ServerError || (exports.ServerError = {}));
//# sourceMappingURL=error.js.map