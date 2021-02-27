"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkspaceServer = void 0;
var WorkspaceServer = /** @class */ (function () {
    function WorkspaceServer() {
    }
    WorkspaceServer.getInstance = function () {
        if (!this.INSTANCE) {
            this.INSTANCE = new WorkspaceServer();
        }
        return this.INSTANCE;
    };
    return WorkspaceServer;
}());
exports.WorkspaceServer = WorkspaceServer;
//# sourceMappingURL=server.js.map