"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Server = void 0;
var express_1 = __importDefault(require("express"));
var http_1 = require("http");
var os_1 = require("os");
var Server = /** @class */ (function () {
    function Server() {
        this.app = express_1.default();
        this.apiv1 = express_1.default.Router();
    }
    Server.prototype.registerRouterUI = function (router, prefix) {
        if (prefix === undefined) {
            this.app.use(router);
        }
        else {
            this.app.use(prefix, router);
        }
    };
    Server.prototype.registerRouterAPI = function (version, router, prefix) {
        if (version === 1) {
            if (prefix === undefined) {
                this.apiv1.use(router);
            }
            else {
                this.apiv1.use(prefix, router);
            }
        }
    };
    Server.prototype.start = function (port) {
        if (port === void 0) { port = 8080; }
        return __awaiter(this, void 0, void 0, function () {
            var server, serverListener;
            return __generator(this, function (_a) {
                this.app.use('/api/v1', express_1.default.json({ limit: 314572800 }));
                this.app.use('/api/v1', this.apiv1);
                server = http_1.createServer(this.app);
                serverListener = server.listen(process.env.port || port, function () {
                    var e_1, _a;
                    var n = 0;
                    var networks = os_1.networkInterfaces();
                    for (var network in networks) {
                        try {
                            // if (network.hasOwnProperty(network))
                            // {
                            for (var _b = (e_1 = void 0, __values(networks[network])), _c = _b.next(); !_c.done; _c = _b.next()) {
                                var networkAddress = _c.value;
                                if (networkAddress.family === "IPv4" && !networkAddress.address.startsWith("127")) {
                                    n = n + 1;
                                    console.log("StartupWay running at http://" + networkAddress.address + ":" + serverListener.address().port);
                                }
                            }
                        }
                        catch (e_1_1) { e_1 = { error: e_1_1 }; }
                        finally {
                            try {
                                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                            }
                            finally { if (e_1) throw e_1.error; }
                        }
                        // }
                    }
                    if (n === 0) {
                        console.log("StartupWay running at http://127.0.0.1:" + serverListener.address().port);
                    }
                });
                serverListener.on("error", function (err) {
                    console.error(err);
                });
                return [2 /*return*/];
            });
        });
    };
    Server.getInstance = function () {
        if (!this.INSTANCE) {
            this.INSTANCE = new Server();
        }
        return this.INSTANCE;
    };
    return Server;
}());
exports.Server = Server;
//# sourceMappingURL=server.js.map