"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MenuServer = void 0;
var MenuServer = /** @class */ (function () {
    function MenuServer() {
    }
    MenuServer.getInstance = function () {
        if (!this.INSTANCE) {
            this.INSTANCE = new MenuServer();
        }
        return this.INSTANCE;
    };
    return MenuServer;
}());
exports.MenuServer = MenuServer;
//# sourceMappingURL=server.js.map