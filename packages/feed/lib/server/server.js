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
exports.FeedServer = void 0;
var express_1 = require("express");
var server_1 = require("@startupway/main/lib/server");
var server_2 = require("@startupway/database/lib/server");
var server_3 = require("@startupway/users/lib/server");
// import { v4 as uiidv4 } from 'uuid';
var FeedServer = /** @class */ (function () {
    function FeedServer() {
    }
    FeedServer.prototype.addFeed = function (feedParam) {
        return __awaiter(this, void 0, void 0, function () {
            var conn, queryOptions, values, feeds, resp, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        conn = null;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 21, , 25]);
                        return [4 /*yield*/, server_2.getPool().getConnection()];
                    case 2:
                        conn = _a.sent();
                        if (!conn) return [3 /*break*/, 19];
                        conn.beginTransaction();
                        queryOptions = {
                            namedPlaceholders: true,
                            sql: "SELECT feeds.* FROM feeds WHERE feeds.teamId=:teamId AND DATE(feeds.date)=DATE(NOW())",
                        };
                        values = {
                            teamId: feedParam.teamId
                        };
                        return [4 /*yield*/, conn.query(queryOptions, values)];
                    case 3:
                        feeds = _a.sent();
                        if (!feeds) return [3 /*break*/, 15];
                        if (!(feeds.length > 3)) return [3 /*break*/, 6];
                        return [4 /*yield*/, conn.commit()];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, conn.release()];
                    case 5:
                        _a.sent();
                        return [2 /*return*/, null];
                    case 6:
                        queryOptions.sql = "INSERT INTO feeds (feedId, teamId, feedType, text, date) VALUES(:feedId,:teamId,:feedType,:text,:date)";
                        return [4 /*yield*/, conn.query(queryOptions, feedParam)];
                    case 7:
                        _a.sent();
                        queryOptions.sql = "SELECT feedId, teamId, feedType, text, date FROM feeds WHERE feedId=:feedId";
                        return [4 /*yield*/, conn.query(queryOptions, { feedId: feedParam.feedId })];
                    case 8:
                        resp = _a.sent();
                        if (!(resp && resp.length > 0 && resp[0])) return [3 /*break*/, 11];
                        return [4 /*yield*/, conn.commit()];
                    case 9:
                        _a.sent();
                        return [4 /*yield*/, conn.release()];
                    case 10:
                        _a.sent();
                        return [2 /*return*/, resp[0]];
                    case 11: return [4 /*yield*/, conn.rollback()];
                    case 12:
                        _a.sent();
                        return [4 /*yield*/, conn.release()];
                    case 13:
                        _a.sent();
                        return [2 /*return*/, null];
                    case 14: return [3 /*break*/, 18];
                    case 15: return [4 /*yield*/, conn.rollback()];
                    case 16:
                        _a.sent();
                        return [4 /*yield*/, conn.release()];
                    case 17:
                        _a.sent();
                        return [2 /*return*/, null];
                    case 18: return [3 /*break*/, 20];
                    case 19: return [2 /*return*/, null];
                    case 20: return [3 /*break*/, 25];
                    case 21:
                        e_1 = _a.sent();
                        console.error(e_1);
                        if (!conn) return [3 /*break*/, 24];
                        return [4 /*yield*/, conn.rollback()];
                    case 22:
                        _a.sent();
                        return [4 /*yield*/, conn.release()];
                    case 23:
                        _a.sent();
                        _a.label = 24;
                    case 24: return [2 /*return*/, null];
                    case 25: return [2 /*return*/];
                }
            });
        });
    };
    FeedServer.prototype.updateFeed = function (feedParam) {
        return __awaiter(this, void 0, void 0, function () {
            var conn, queryOptions, resp, e_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        conn = null;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 13, , 17]);
                        return [4 /*yield*/, server_2.getPool().getConnection()];
                    case 2:
                        conn = _a.sent();
                        if (!conn) return [3 /*break*/, 11];
                        conn.beginTransaction();
                        queryOptions = {
                            namedPlaceholders: true,
                            sql: "UPDATE feeds set teamId=:teamId, feedType=:feedType, text=:text, date=:date WHERE feeds.feedId=:feedId",
                        };
                        return [4 /*yield*/, conn.query(queryOptions, feedParam)];
                    case 3:
                        _a.sent();
                        queryOptions.sql = "SELECT feedId, teamId, feedType, text, date FROM feeds WHERE feedId=:feedId";
                        return [4 /*yield*/, conn.query(queryOptions, feedParam)];
                    case 4:
                        resp = _a.sent();
                        if (!(resp && resp.length > 0 && resp[0])) return [3 /*break*/, 7];
                        return [4 /*yield*/, conn.commit()];
                    case 5:
                        _a.sent();
                        return [4 /*yield*/, conn.release()];
                    case 6:
                        _a.sent();
                        return [2 /*return*/, resp[0]];
                    case 7: return [4 /*yield*/, conn.rollback()];
                    case 8:
                        _a.sent();
                        return [4 /*yield*/, conn.release()];
                    case 9:
                        _a.sent();
                        return [2 /*return*/, null];
                    case 10: return [3 /*break*/, 12];
                    case 11: return [2 /*return*/, null];
                    case 12: return [3 /*break*/, 17];
                    case 13:
                        e_2 = _a.sent();
                        console.error(e_2);
                        if (!conn) return [3 /*break*/, 16];
                        return [4 /*yield*/, conn.rollback()];
                    case 14:
                        _a.sent();
                        return [4 /*yield*/, conn.release()];
                    case 15:
                        _a.sent();
                        _a.label = 16;
                    case 16: return [2 /*return*/, null];
                    case 17: return [2 /*return*/];
                }
            });
        });
    };
    FeedServer.prototype.deleteFeed = function (feedParam) {
        return __awaiter(this, void 0, void 0, function () {
            var conn, queryOptions, response, e_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        conn = null;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 13, , 17]);
                        return [4 /*yield*/, server_2.getPool().getConnection()];
                    case 2:
                        conn = _a.sent();
                        if (!conn) return [3 /*break*/, 11];
                        conn.beginTransaction();
                        queryOptions = {
                            namedPlaceholders: true,
                            sql: "DELETE FROM feeds WHERE feed.feedId=:feedId",
                        };
                        return [4 /*yield*/, conn.query(queryOptions, { feedId: feedParam.feedId })];
                    case 3:
                        _a.sent();
                        queryOptions.sql = "SELECT feedId as deleted_id FROM feeds where feedId=:feedId";
                        return [4 /*yield*/, conn.query(queryOptions, { feedId: feedParam.feedId })];
                    case 4:
                        response = _a.sent();
                        if (!(response && response.length === 0)) return [3 /*break*/, 7];
                        return [4 /*yield*/, conn.commit()];
                    case 5:
                        _a.sent();
                        return [4 /*yield*/, conn.release()];
                    case 6:
                        _a.sent();
                        return [2 /*return*/, true];
                    case 7: return [4 /*yield*/, conn.rollback()];
                    case 8:
                        _a.sent();
                        return [4 /*yield*/, conn.release()];
                    case 9:
                        _a.sent();
                        return [2 /*return*/, false];
                    case 10: return [3 /*break*/, 12];
                    case 11: return [2 /*return*/, false];
                    case 12: return [3 /*break*/, 17];
                    case 13:
                        e_3 = _a.sent();
                        console.error(e_3);
                        if (!conn) return [3 /*break*/, 16];
                        return [4 /*yield*/, conn.rollback()];
                    case 14:
                        _a.sent();
                        return [4 /*yield*/, conn.release()];
                    case 15:
                        _a.sent();
                        _a.label = 16;
                    case 16: return [2 /*return*/, false];
                    case 17: return [2 /*return*/];
                }
            });
        });
    };
    FeedServer.prototype.getFeedByTeamId = function (teamId) {
        return __awaiter(this, void 0, void 0, function () {
            var conn, queryOptions, feeds, e_4;
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
                            sql: "SELECT feeds.* FROM feeds WHERE feeds.teamId=:teamId ORDER BY feeds.date",
                        };
                        return [4 /*yield*/, conn.query(queryOptions, { teamId: teamId })];
                    case 3:
                        feeds = _a.sent();
                        if (!(feeds && feeds.length > 0)) return [3 /*break*/, 5];
                        return [4 /*yield*/, conn.release()];
                    case 4:
                        _a.sent();
                        return [2 /*return*/, feeds];
                    case 5: return [4 /*yield*/, conn.release()];
                    case 6:
                        _a.sent();
                        return [2 /*return*/, []];
                    case 7: return [3 /*break*/, 9];
                    case 8: return [2 /*return*/, []];
                    case 9: return [3 /*break*/, 13];
                    case 10:
                        e_4 = _a.sent();
                        console.error(e_4);
                        if (!conn) return [3 /*break*/, 12];
                        return [4 /*yield*/, conn.release()];
                    case 11:
                        _a.sent();
                        _a.label = 12;
                    case 12: return [2 /*return*/, []];
                    case 13: return [2 /*return*/];
                }
            });
        });
    };
    FeedServer.getInstance = function () {
        if (!this.INSTANCE) {
            this.INSTANCE = new FeedServer();
        }
        return this.INSTANCE;
    };
    return FeedServer;
}());
exports.FeedServer = FeedServer;
var router = express_1.Router();
var feed = FeedServer.getInstance();
router.use(function (req, res, next) {
    req.feed = [];
    next();
});
var authFunct = server_3.getAuthorizationFunction();
if (authFunct)
    router.use(authFunct);
// Bypass params dictionary and send authorization Function
router.get("/:teamId", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var userFeed, userFeed_1, userFeed_1_1, uF, error_1;
    var e_5, _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                return [4 /*yield*/, feed.getFeedByTeamId(req.params.teamId)];
            case 1:
                userFeed = _b.sent();
                if (userFeed) {
                    try {
                        for (userFeed_1 = __values(userFeed), userFeed_1_1 = userFeed_1.next(); !userFeed_1_1.done; userFeed_1_1 = userFeed_1.next()) {
                            uF = userFeed_1_1.value;
                            uF.text = JSON.parse(uF.text);
                        }
                    }
                    catch (e_5_1) { e_5 = { error: e_5_1 }; }
                    finally {
                        try {
                            if (userFeed_1_1 && !userFeed_1_1.done && (_a = userFeed_1.return)) _a.call(userFeed_1);
                        }
                        finally { if (e_5) throw e_5.error; }
                    }
                    res.send(userFeed);
                }
                else
                    res.status(401).send({ err: 401, data: [] });
                return [3 /*break*/, 3];
            case 2:
                error_1 = _b.sent();
                res.status(500).send({ err: 500, data: [] });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
router.post("/add", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var response, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, feed.addFeed(req.body)];
            case 1:
                response = _a.sent();
                if (response)
                    res.send(response);
                else
                    res.status(401).send({ err: 401, data: null });
                return [3 /*break*/, 3];
            case 2:
                error_2 = _a.sent();
                res.status(500).send({ err: 500, data: null });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
router.post("/update", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var feedResp, e_6;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, feed.updateFeed(req.body)];
            case 1:
                feedResp = _a.sent();
                if (feedResp)
                    res.status(200).send(feedResp);
                else
                    res.status(204).send(null);
                return [3 /*break*/, 3];
            case 2:
                e_6 = _a.sent();
                console.error(e_6);
                res.status(500).send({ err: 500, data: null });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
router.post("/delete", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var toRemove, resp, e_7;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                toRemove = req.body;
                if (!toRemove) return [3 /*break*/, 2];
                return [4 /*yield*/, feed.deleteFeed(toRemove)];
            case 1:
                resp = _a.sent();
                if (resp)
                    res.status(200).send(true);
                else
                    res.status(204).send(false);
                _a.label = 2;
            case 2: return [3 /*break*/, 4];
            case 3:
                e_7 = _a.sent();
                console.error(e_7);
                res.status(500).send({ err: 500, data: false });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
var server = server_1.Server.getInstance();
server.registerRouterAPI(1, router, "/feed");
//# sourceMappingURL=server.js.map