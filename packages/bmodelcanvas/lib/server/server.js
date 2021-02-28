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
Object.defineProperty(exports, "__esModule", { value: true });
exports.BModelCanvasServer = void 0;
var server_1 = require("@startupway/main/lib/server");
var server_2 = require("@startupway/database/lib/server");
var server_3 = require("@startupway/users/lib/server");
var express_1 = require("express");
// import { v4 as uiidv4 } from 'uuid';
var BModelCanvasServer = /** @class */ (function () {
    function BModelCanvasServer() {
    }
    BModelCanvasServer.prototype.addCanvas = function (canvas) {
        return __awaiter(this, void 0, void 0, function () {
            var conn, queryOptions, values, canvases, updateValues, canvasResult, result, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        conn = null;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 23, , 27]);
                        return [4 /*yield*/, server_2.getPool().getConnection()];
                    case 2:
                        conn = _a.sent();
                        if (!conn) return [3 /*break*/, 21];
                        conn.beginTransaction();
                        queryOptions = {
                            namedPlaceholders: true,
                            sql: "SELECT bModelCanvas.* FROM bModelCanvas WHERE bModelCanvas.productId=:productId AND DATE(bModelCanvas.date)=DATE(NOW())"
                        };
                        values = {
                            productId: canvas.productId
                        };
                        return [4 /*yield*/, conn.query(queryOptions, values)];
                    case 3:
                        canvases = _a.sent();
                        if (!(canvases && canvases.length > 0 && canvases[0])) return [3 /*break*/, 12];
                        queryOptions = {
                            namedPlaceholders: true,
                            sql: "UPDATE bModelCanvas SET bModelCanvas.fields=:fields, bModelCanvas.date=:date WHERE bModelCanvas.modelId=:modelId"
                        };
                        updateValues = {
                            fields: canvas.fields,
                            date: canvas.date,
                            modelId: canvas.modelId
                        };
                        return [4 /*yield*/, conn.query(queryOptions, updateValues)];
                    case 4:
                        _a.sent();
                        queryOptions.sql = "SELECT modelId,productId,date,fields from bModelCanvas WHERE bModelCanvas.modelId=:modelId";
                        return [4 /*yield*/, conn.query(queryOptions, updateValues)];
                    case 5:
                        canvasResult = _a.sent();
                        if (!(canvasResult && canvasResult.length > 0 && canvasResult[0])) return [3 /*break*/, 8];
                        return [4 /*yield*/, conn.commit()];
                    case 6:
                        _a.sent();
                        return [4 /*yield*/, conn.end()];
                    case 7:
                        _a.sent();
                        return [2 /*return*/, canvasResult[0]];
                    case 8: return [4 /*yield*/, conn.rollback()];
                    case 9:
                        _a.sent();
                        return [4 /*yield*/, conn.end()];
                    case 10:
                        _a.sent();
                        return [2 /*return*/, null];
                    case 11: return [3 /*break*/, 20];
                    case 12:
                        queryOptions = {
                            namedPlaceholders: true,
                            sql: "INSERT INTO bModelCanvas values(:modelId,:productId,:date,:fields)"
                        };
                        return [4 /*yield*/, conn.query(queryOptions, canvas)];
                    case 13:
                        _a.sent();
                        queryOptions.sql = "SELECT modelId,productId,date,fields FROM bModelCanvas WHERE modelId=:modelId";
                        return [4 /*yield*/, conn.query(queryOptions, { modelId: canvas.modelId })];
                    case 14:
                        result = _a.sent();
                        if (!(result && result.length > 0 && result[0])) return [3 /*break*/, 17];
                        return [4 /*yield*/, conn.commit()];
                    case 15:
                        _a.sent();
                        return [4 /*yield*/, conn.end()];
                    case 16:
                        _a.sent();
                        return [2 /*return*/, result[0]];
                    case 17: return [4 /*yield*/, conn.rollback()];
                    case 18:
                        _a.sent();
                        return [4 /*yield*/, conn.end()];
                    case 19:
                        _a.sent();
                        return [2 /*return*/, null];
                    case 20: return [3 /*break*/, 22];
                    case 21: return [2 /*return*/, null];
                    case 22: return [3 /*break*/, 27];
                    case 23:
                        error_1 = _a.sent();
                        console.error(error_1);
                        if (!conn) return [3 /*break*/, 26];
                        return [4 /*yield*/, conn.rollback()];
                    case 24:
                        _a.sent();
                        return [4 /*yield*/, conn.end()];
                    case 25:
                        _a.sent();
                        _a.label = 26;
                    case 26: return [2 /*return*/, null];
                    case 27: return [2 /*return*/];
                }
            });
        });
    };
    BModelCanvasServer.prototype.getCanvasesForTeam = function (teamId) {
        return __awaiter(this, void 0, void 0, function () {
            var conn, queryOptions, values, canvases, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        conn = null;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 10, , 13]);
                        return [4 /*yield*/, server_2.getPool().getConnection()];
                    case 2:
                        conn = _a.sent();
                        if (!conn) return [3 /*break*/, 8];
                        queryOptions = {
                            namedPlaceholders: true,
                            sql: "SELECT bModelCanvas.* FROM bModelCanvas INNER JOIN teams ON teams.productId=bModelCanvas.productId AND teams.teamId=:tId"
                        };
                        values = {
                            tId: teamId
                        };
                        return [4 /*yield*/, conn.query(queryOptions, values)];
                    case 3:
                        canvases = _a.sent();
                        if (!(canvases && canvases.length > 0)) return [3 /*break*/, 5];
                        return [4 /*yield*/, conn.end()];
                    case 4:
                        _a.sent();
                        return [2 /*return*/, canvases];
                    case 5: return [4 /*yield*/, conn.end()];
                    case 6:
                        _a.sent();
                        return [2 /*return*/, []];
                    case 7: return [3 /*break*/, 9];
                    case 8: return [2 /*return*/, []];
                    case 9: return [3 /*break*/, 13];
                    case 10:
                        error_2 = _a.sent();
                        console.error(error_2);
                        if (!conn) return [3 /*break*/, 12];
                        return [4 /*yield*/, conn.end()];
                    case 11:
                        _a.sent();
                        _a.label = 12;
                    case 12: return [2 /*return*/, []];
                    case 13: return [2 /*return*/];
                }
            });
        });
    };
    // async updateCanvas (canvas: BModelCanvas): Promise<BModelCanvas> {
    // 	await (await this.getBModelCanvasRepository())
    // 		.update(canvas.modelId, canvas);
    // 	let updatedCanvas = await (await this.getBModelCanvasRepository())
    // 		.findOne(canvas.modelId);
    // 	if (updatedCanvas)
    // 		return updatedCanvas;
    // 	else
    // 		return null;
    // }
    BModelCanvasServer.getInstance = function () {
        if (!this.INSTANCE) {
            this.INSTANCE = new BModelCanvasServer();
        }
        return this.INSTANCE;
    };
    return BModelCanvasServer;
}());
exports.BModelCanvasServer = BModelCanvasServer;
var server = server_1.Server.getInstance();
var bModelCanvasServer = BModelCanvasServer.getInstance();
var router = express_1.Router();
var authFunct = server_3.getAuthorizationFunction();
if (authFunct)
    router.use(authFunct);
router.get("/:teamId", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var result, result_1, result_1_1, res_1, error_3;
    var e_1, _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                return [4 /*yield*/, bModelCanvasServer.getCanvasesForTeam(req.params.teamId)];
            case 1:
                result = _b.sent();
                if (result) {
                    try {
                        for (result_1 = __values(result), result_1_1 = result_1.next(); !result_1_1.done; result_1_1 = result_1.next()) {
                            res_1 = result_1_1.value;
                            res_1.fields = JSON.parse(res_1.fields);
                        }
                    }
                    catch (e_1_1) { e_1 = { error: e_1_1 }; }
                    finally {
                        try {
                            if (result_1_1 && !result_1_1.done && (_a = result_1.return)) _a.call(result_1);
                        }
                        finally { if (e_1) throw e_1.error; }
                    }
                    res.send(result);
                }
                else
                    res.status(401).send({ err: 401, data: [] });
                return [3 /*break*/, 3];
            case 2:
                error_3 = _b.sent();
                console.error(error_3);
                res.status(500).send({ err: 500, data: [] });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// TODO: add addCanvas(canvas) function
router.post("/:teamId", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var newCanvas, error_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, bModelCanvasServer.addCanvas(req.body)];
            case 1:
                newCanvas = _a.sent();
                if (newCanvas)
                    res.send(newCanvas);
                else
                    res.status(401).send({ err: 401, data: null });
                return [3 /*break*/, 3];
            case 2:
                error_4 = _a.sent();
                console.error(error_4);
                res.status(500).send({ err: 500, data: null });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
router.post("/update:teamId", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var newCanvas;
    return __generator(this, function (_a) {
        try {
            newCanvas = req.body;
            if (newCanvas)
                res.send(newCanvas);
            else
                res.status(401).send({ err: 401, data: null });
        }
        catch (error) {
            console.error(error);
            res.status(500).send({ err: 500, data: null });
        }
        return [2 /*return*/];
    });
}); });
server.registerRouterAPI(1, router, "/canvas");
//# sourceMappingURL=server.js.map