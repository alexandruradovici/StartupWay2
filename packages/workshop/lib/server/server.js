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
exports.WorkshopServer = void 0;
var server_1 = require("@startupway/main/lib/server");
var server_2 = require("@startupway/database/lib/server");
var server_3 = require("@startupway/users/lib/server");
var express_1 = require("express");
var lodash_1 = __importDefault(require("lodash"));
// import { User } from "@startupway/users/lib/server";
var WorkshopServer = /** @class */ (function () {
    function WorkshopServer() {
    }
    WorkshopServer.prototype.addWorkshop = function (workshopParam) {
        return __awaiter(this, void 0, void 0, function () {
            var conn, queryOptions, response, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        conn = null;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 14, , 18]);
                        return [4 /*yield*/, server_2.getPool().getConnection()];
                    case 2:
                        conn = _a.sent();
                        if (!conn) return [3 /*break*/, 12];
                        return [4 /*yield*/, conn.beginTransaction()];
                    case 3:
                        _a.sent();
                        queryOptions = {
                            namedPlaceholders: true,
                            sql: "INSERT INTO workshops (workshopId, workshopName) VALUES(:workshopId,:workshopName)",
                        };
                        return [4 /*yield*/, conn.query(queryOptions, workshopParam)];
                    case 4:
                        _a.sent();
                        queryOptions.sql = "SELECT workshopId, workshopName FROM workshops WHERE workshopId=:workshopId";
                        return [4 /*yield*/, conn.query(queryOptions, workshopParam)];
                    case 5:
                        response = _a.sent();
                        if (!(response && response.length > 0 && response[0])) return [3 /*break*/, 8];
                        return [4 /*yield*/, conn.commit()];
                    case 6:
                        _a.sent();
                        return [4 /*yield*/, conn.end()];
                    case 7:
                        _a.sent();
                        return [2 /*return*/, response[0]];
                    case 8: return [4 /*yield*/, conn.rollback()];
                    case 9:
                        _a.sent();
                        return [4 /*yield*/, conn.end()];
                    case 10:
                        _a.sent();
                        return [2 /*return*/, null];
                    case 11: return [3 /*break*/, 13];
                    case 12: return [2 /*return*/, null];
                    case 13: return [3 /*break*/, 18];
                    case 14:
                        error_1 = _a.sent();
                        console.error(error_1);
                        if (!conn) return [3 /*break*/, 17];
                        return [4 /*yield*/, conn.rollback()];
                    case 15:
                        _a.sent();
                        return [4 /*yield*/, conn.end()];
                    case 16:
                        _a.sent();
                        _a.label = 17;
                    case 17: return [2 /*return*/, null];
                    case 18: return [2 /*return*/];
                }
            });
        });
    };
    WorkshopServer.prototype.addWorkshopInstance = function (workshopInstance) {
        return __awaiter(this, void 0, void 0, function () {
            var conn, queryOptions, response, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        conn = null;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 14, , 18]);
                        return [4 /*yield*/, server_2.getPool().getConnection()];
                    case 2:
                        conn = _a.sent();
                        if (!conn) return [3 /*break*/, 12];
                        return [4 /*yield*/, conn.beginTransaction()];
                    case 3:
                        _a.sent();
                        queryOptions = {
                            namedPlaceholders: true,
                            sql: "INSERT INTO workshopInstances (workshopInstanceId,workshopId,teamId,trainerName,workshopDate,workshopDetails) VALUES(:workshopInstanceId,:workshopId,:teamId,:trainerName,:workshopDate,:workshopDetails)",
                        };
                        return [4 /*yield*/, conn.query(queryOptions, workshopInstance)];
                    case 4:
                        _a.sent();
                        queryOptions.sql = "SELECT workshopInstanceId,workshopId,teamId,trainerName,workshopDate,workshopDetails FROM workshopInstances WHERE workshopInstanceId=:workshopInstanceId";
                        return [4 /*yield*/, conn.query(queryOptions, workshopInstance)];
                    case 5:
                        response = _a.sent();
                        if (!(response && response.length > 0 && response[0])) return [3 /*break*/, 8];
                        return [4 /*yield*/, conn.commit()];
                    case 6:
                        _a.sent();
                        return [4 /*yield*/, conn.end()];
                    case 7:
                        _a.sent();
                        return [2 /*return*/, response[0]];
                    case 8: return [4 /*yield*/, conn.rollback()];
                    case 9:
                        _a.sent();
                        return [4 /*yield*/, conn.end()];
                    case 10:
                        _a.sent();
                        return [2 /*return*/, null];
                    case 11: return [3 /*break*/, 13];
                    case 12: return [2 /*return*/, null];
                    case 13: return [3 /*break*/, 18];
                    case 14:
                        error_2 = _a.sent();
                        console.error(error_2);
                        if (!conn) return [3 /*break*/, 17];
                        return [4 /*yield*/, conn.rollback()];
                    case 15:
                        _a.sent();
                        return [4 /*yield*/, conn.end()];
                    case 16:
                        _a.sent();
                        _a.label = 17;
                    case 17: return [2 /*return*/, null];
                    case 18: return [2 /*return*/];
                }
            });
        });
    };
    WorkshopServer.prototype.addWorkshopAttendance = function (workshopAttendance) {
        return __awaiter(this, void 0, void 0, function () {
            var conn, queryOptions, response, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        conn = null;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 14, , 18]);
                        return [4 /*yield*/, server_2.getPool().getConnection()];
                    case 2:
                        conn = _a.sent();
                        if (!conn) return [3 /*break*/, 12];
                        return [4 /*yield*/, conn.beginTransaction()];
                    case 3:
                        _a.sent();
                        queryOptions = {
                            namedPlaceholders: true,
                            sql: "INSERT INTO workshopAttendances (attendanceId,attendanceDate,userId,workshopInstanceId) VALUES(:attendanceId,:attendanceDate,:userId,:workshopInstanceId)",
                        };
                        return [4 /*yield*/, conn.query(queryOptions, workshopAttendance)];
                    case 4:
                        _a.sent();
                        queryOptions.sql = "SELECT attendanceId,attendanceDate,userId,workshopInstanceId FROM workshopAttendances WHERE attendanceId=:attendanceId";
                        return [4 /*yield*/, conn.query(queryOptions, workshopAttendance)];
                    case 5:
                        response = _a.sent();
                        if (!(response && response.length > 0 && response[0])) return [3 /*break*/, 8];
                        return [4 /*yield*/, conn.commit()];
                    case 6:
                        _a.sent();
                        return [4 /*yield*/, conn.end()];
                    case 7:
                        _a.sent();
                        return [2 /*return*/, response[0]];
                    case 8: return [4 /*yield*/, conn.rollback()];
                    case 9:
                        _a.sent();
                        return [4 /*yield*/, conn.end()];
                    case 10:
                        _a.sent();
                        return [2 /*return*/, null];
                    case 11: return [3 /*break*/, 13];
                    case 12: return [2 /*return*/, null];
                    case 13: return [3 /*break*/, 18];
                    case 14:
                        error_3 = _a.sent();
                        console.error(error_3);
                        if (!conn) return [3 /*break*/, 17];
                        return [4 /*yield*/, conn.rollback()];
                    case 15:
                        _a.sent();
                        return [4 /*yield*/, conn.end()];
                    case 16:
                        _a.sent();
                        _a.label = 17;
                    case 17: return [2 /*return*/, null];
                    case 18: return [2 /*return*/];
                }
            });
        });
    };
    WorkshopServer.prototype.deleteWorkshopAttendance = function (attendanceId) {
        return __awaiter(this, void 0, void 0, function () {
            var conn, queryOptions, response, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        conn = null;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 14, , 18]);
                        return [4 /*yield*/, server_2.getPool().getConnection()];
                    case 2:
                        conn = _a.sent();
                        if (!conn) return [3 /*break*/, 12];
                        return [4 /*yield*/, conn.beginTransaction()];
                    case 3:
                        _a.sent();
                        queryOptions = {
                            namedPlaceholders: true,
                            sql: "DELETE FROM workshopAttendances WHERE attendanceId=:attendanceId"
                        };
                        return [4 /*yield*/, conn.query(queryOptions, { attendanceId: attendanceId })];
                    case 4:
                        _a.sent();
                        queryOptions.sql = "SELECT attendanceId as deleted_id FROM workshopAttendances WHERE attendanceId=:attendanceId";
                        return [4 /*yield*/, conn.query(queryOptions, { attendanceId: attendanceId })];
                    case 5:
                        response = _a.sent();
                        if (!(response && response.length === 0)) return [3 /*break*/, 8];
                        return [4 /*yield*/, conn.commit()];
                    case 6:
                        _a.sent();
                        return [4 /*yield*/, conn.end()];
                    case 7:
                        _a.sent();
                        return [2 /*return*/, true];
                    case 8: return [4 /*yield*/, conn.rollback()];
                    case 9:
                        _a.sent();
                        return [4 /*yield*/, conn.end()];
                    case 10:
                        _a.sent();
                        return [2 /*return*/, false];
                    case 11: return [3 /*break*/, 13];
                    case 12: return [2 /*return*/, false];
                    case 13: return [3 /*break*/, 18];
                    case 14:
                        error_4 = _a.sent();
                        console.error(error_4);
                        if (!conn) return [3 /*break*/, 17];
                        return [4 /*yield*/, conn.rollback()];
                    case 15:
                        _a.sent();
                        return [4 /*yield*/, conn.end()];
                    case 16:
                        _a.sent();
                        _a.label = 17;
                    case 17: return [2 /*return*/, false];
                    case 18: return [2 /*return*/];
                }
            });
        });
    };
    WorkshopServer.prototype.listWorkshops = function () {
        return __awaiter(this, void 0, void 0, function () {
            var conn, queryOptions, workshops, error_5;
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
                            sql: "SELECT workshops.* FROM workshops"
                        };
                        return [4 /*yield*/, conn.query(queryOptions)];
                    case 3:
                        workshops = _a.sent();
                        if (!(workshops && workshops.length > 0)) return [3 /*break*/, 5];
                        return [4 /*yield*/, conn.end()];
                    case 4:
                        _a.sent();
                        return [2 /*return*/, workshops];
                    case 5: return [4 /*yield*/, conn.end()];
                    case 6:
                        _a.sent();
                        return [2 /*return*/, []];
                    case 7: return [3 /*break*/, 9];
                    case 8: return [2 /*return*/, []];
                    case 9: return [3 /*break*/, 13];
                    case 10:
                        error_5 = _a.sent();
                        console.error(error_5);
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
    WorkshopServer.prototype.listWorkshopInstancesByTeamIds = function (teamIds) {
        return __awaiter(this, void 0, void 0, function () {
            var conn, queryOptions, workshops, error_6;
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
                            sql: "SELECT workshopInstances.* FROM workshopInstances WHERE workshopInstances.teamId IN (:teamIds)"
                        };
                        return [4 /*yield*/, conn.query(queryOptions, { teamIds: teamIds })];
                    case 3:
                        workshops = _a.sent();
                        if (!(workshops && workshops.length > 0)) return [3 /*break*/, 5];
                        return [4 /*yield*/, conn.end()];
                    case 4:
                        _a.sent();
                        return [2 /*return*/, workshops];
                    case 5: return [4 /*yield*/, conn.end()];
                    case 6:
                        _a.sent();
                        return [2 /*return*/, []];
                    case 7: return [3 /*break*/, 9];
                    case 8: return [2 /*return*/, []];
                    case 9: return [3 /*break*/, 13];
                    case 10:
                        error_6 = _a.sent();
                        console.error(error_6);
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
    WorkshopServer.prototype.listWorkshopInstancesByWorkshopId = function (workshopId) {
        return __awaiter(this, void 0, void 0, function () {
            var conn, queryOptions, workshopInstances, error_7;
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
                            sql: "SELECT workshopInstances.* FROM workshopInstances WHERE workshopInstances.workshopId=:workshopId"
                        };
                        return [4 /*yield*/, conn.query(queryOptions, { workshopId: workshopId })];
                    case 3:
                        workshopInstances = _a.sent();
                        if (!(workshopInstances && workshopInstances.length > 0)) return [3 /*break*/, 5];
                        return [4 /*yield*/, conn.end()];
                    case 4:
                        _a.sent();
                        return [2 /*return*/, workshopInstances];
                    case 5: return [4 /*yield*/, conn.end()];
                    case 6:
                        _a.sent();
                        return [2 /*return*/, []];
                    case 7: return [3 /*break*/, 9];
                    case 8: return [2 /*return*/, []];
                    case 9: return [3 /*break*/, 13];
                    case 10:
                        error_7 = _a.sent();
                        console.error(error_7);
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
    WorkshopServer.prototype.listWorkshopAttendances = function () {
        return __awaiter(this, void 0, void 0, function () {
            var conn, queryOptions, workshopAttendances, error_8;
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
                            sql: "SELECT workshopAttendances.* FROM workshopAttendances"
                        };
                        return [4 /*yield*/, conn.query(queryOptions)];
                    case 3:
                        workshopAttendances = _a.sent();
                        if (!(workshopAttendances && workshopAttendances.length > 0)) return [3 /*break*/, 5];
                        return [4 /*yield*/, conn.end()];
                    case 4:
                        _a.sent();
                        return [2 /*return*/, workshopAttendances];
                    case 5: return [4 /*yield*/, conn.end()];
                    case 6:
                        _a.sent();
                        return [2 /*return*/, []];
                    case 7: return [3 /*break*/, 9];
                    case 8: return [2 /*return*/, []];
                    case 9: return [3 /*break*/, 13];
                    case 10:
                        error_8 = _a.sent();
                        console.error(error_8);
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
    WorkshopServer.prototype.listWorkshopAttendancesByWorkshopId = function (workshopId) {
        return __awaiter(this, void 0, void 0, function () {
            var conn, queryOptions, workshopInstances, error_9;
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
                            sql: "SELECT workshopInstances.*, workshopAttendances.* FROM workshopInstances INNER JOIN ON workshopAttendances.workshopInstanceId=workshopInstances.workshopInstanceId WHERE workshopInstances.workshopId=:workshopId"
                        };
                        return [4 /*yield*/, conn.query(queryOptions, { workshopId: workshopId })];
                    case 3:
                        workshopInstances = _a.sent();
                        if (!(workshopInstances && workshopInstances.length > 0)) return [3 /*break*/, 5];
                        return [4 /*yield*/, conn.end()];
                    case 4:
                        _a.sent();
                        return [2 /*return*/, workshopInstances];
                    case 5: return [4 /*yield*/, conn.end()];
                    case 6:
                        _a.sent();
                        return [2 /*return*/, []];
                    case 7: return [3 /*break*/, 9];
                    case 8: return [2 /*return*/, []];
                    case 9: return [3 /*break*/, 13];
                    case 10:
                        error_9 = _a.sent();
                        console.error(error_9);
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
    WorkshopServer.getInstance = function () {
        if (!this.INSTANCE) {
            this.INSTANCE = new WorkshopServer();
        }
        return this.INSTANCE;
    };
    return WorkshopServer;
}());
exports.WorkshopServer = WorkshopServer;
var router = express_1.Router();
var workshop = WorkshopServer.getInstance();
var authFunct = server_3.getAuthorizationFunction();
if (authFunct)
    router.use(authFunct);
// Bypass params dictionary and send authorization Function
router.get("/workshops", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var workshopsList, error_10;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, workshop.listWorkshops()];
            case 1:
                workshopsList = _a.sent();
                if (workshopsList.length > 0) {
                    res.status(200).send(workshopsList);
                }
                else {
                    res.status(201).send([]);
                }
                return [3 /*break*/, 3];
            case 2:
                error_10 = _a.sent();
                console.error(error_10);
                res.status(500).send({ err: 500, data: [] });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
router.get("/attendance/:workshopId", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var attendanceList, error_11;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, workshop.listWorkshopAttendancesByWorkshopId(req.params.workshopId)];
            case 1:
                attendanceList = _a.sent();
                if (attendanceList) {
                    res.status(200).send(attendanceList);
                }
                else {
                    res.status(201).send([]);
                }
                return [3 /*break*/, 3];
            case 2:
                error_11 = _a.sent();
                console.error(error_11);
                res.status(500).send({ err: 500, data: [] });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
router.post("/attendance", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var workshopId, attendance, currentAtteandance, toAdd, toRemove, workshopsList, toRemove_1, toRemove_1_1, attended, response, e_1_1, toAdd_1, toAdd_1_1, attended, res_1, e_2_1, error_12;
    var e_1, _a, e_2, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _c.trys.push([0, 17, , 18]);
                workshopId = req.body.workshopId;
                attendance = req.body.attendance;
                return [4 /*yield*/, workshop.listWorkshopAttendancesByWorkshopId(workshopId)];
            case 1:
                currentAtteandance = _c.sent();
                toAdd = lodash_1.default.difference(attendance, currentAtteandance);
                toRemove = lodash_1.default.difference(currentAtteandance, attendance);
                workshopsList = [];
                _c.label = 2;
            case 2:
                _c.trys.push([2, 7, 8, 9]);
                toRemove_1 = __values(toRemove), toRemove_1_1 = toRemove_1.next();
                _c.label = 3;
            case 3:
                if (!!toRemove_1_1.done) return [3 /*break*/, 6];
                attended = toRemove_1_1.value;
                return [4 /*yield*/, workshop.deleteWorkshopAttendance(attended.attendanceId)];
            case 4:
                response = _c.sent();
                if (response)
                    workshopsList = currentAtteandance;
                _c.label = 5;
            case 5:
                toRemove_1_1 = toRemove_1.next();
                return [3 /*break*/, 3];
            case 6: return [3 /*break*/, 9];
            case 7:
                e_1_1 = _c.sent();
                e_1 = { error: e_1_1 };
                return [3 /*break*/, 9];
            case 8:
                try {
                    if (toRemove_1_1 && !toRemove_1_1.done && (_a = toRemove_1.return)) _a.call(toRemove_1);
                }
                finally { if (e_1) throw e_1.error; }
                return [7 /*endfinally*/];
            case 9:
                _c.trys.push([9, 14, 15, 16]);
                toAdd_1 = __values(toAdd), toAdd_1_1 = toAdd_1.next();
                _c.label = 10;
            case 10:
                if (!!toAdd_1_1.done) return [3 /*break*/, 13];
                attended = toAdd_1_1.value;
                return [4 /*yield*/, workshop.addWorkshopAttendance(attended)];
            case 11:
                res_1 = _c.sent();
                if (res_1)
                    workshopsList.push(res_1);
                _c.label = 12;
            case 12:
                toAdd_1_1 = toAdd_1.next();
                return [3 /*break*/, 10];
            case 13: return [3 /*break*/, 16];
            case 14:
                e_2_1 = _c.sent();
                e_2 = { error: e_2_1 };
                return [3 /*break*/, 16];
            case 15:
                try {
                    if (toAdd_1_1 && !toAdd_1_1.done && (_b = toAdd_1.return)) _b.call(toAdd_1);
                }
                finally { if (e_2) throw e_2.error; }
                return [7 /*endfinally*/];
            case 16:
                if (workshopsList) {
                    res.status(200).send(workshopsList);
                }
                else {
                    res.status(201).send([]);
                }
                return [3 /*break*/, 18];
            case 17:
                error_12 = _c.sent();
                console.error(error_12);
                res.status(500).send({ err: 500, data: [] });
                return [3 /*break*/, 18];
            case 18: return [2 /*return*/];
        }
    });
}); });
router.get("/mentor/instances/:workshopId", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var workshopInstancesList, newArray, error_13;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, workshop.listWorkshopInstancesByWorkshopId(req.params.workshopId)];
            case 1:
                workshopInstancesList = _a.sent();
                newArray = lodash_1.default.groupBy(workshopInstancesList, "workshopDate");
                if (newArray) {
                    res.status(200).send(newArray);
                }
                else {
                    res.status(201).send([]);
                }
                return [3 /*break*/, 3];
            case 2:
                error_13 = _a.sent();
                console.error(error_13);
                res.status(500).send({ err: 500, data: [] });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
router.post("/add", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var newWorkshop, error_14;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, workshop.addWorkshop(req.body)];
            case 1:
                newWorkshop = _a.sent();
                if (newWorkshop)
                    res.send(newWorkshop);
                else
                    res.status(401).send({ err: 401, data: null });
                return [3 /*break*/, 3];
            case 2:
                error_14 = _a.sent();
                console.error(error_14);
                res.status(500).send({ err: 500, data: null });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
router.post("/add/instance", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var workshopId, teamIds, date, details, trainer, workshopInstances, teamIds_1, teamIds_1_1, team, workshopInstance, e_3_1, error_15;
    var e_3, _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 9, , 10]);
                workshopId = req.body.workshopId;
                teamIds = req.body.teamIds;
                date = req.body.date;
                details = req.body.details;
                trainer = req.body.trainer;
                workshopInstances = [];
                _b.label = 1;
            case 1:
                _b.trys.push([1, 6, 7, 8]);
                teamIds_1 = __values(teamIds), teamIds_1_1 = teamIds_1.next();
                _b.label = 2;
            case 2:
                if (!!teamIds_1_1.done) return [3 /*break*/, 5];
                team = teamIds_1_1.value;
                return [4 /*yield*/, workshop.addWorkshopInstance({
                        workshopId: workshopId,
                        teamId: team,
                        trainerName: trainer,
                        workshopDate: date,
                        workshopDetails: details,
                    })];
            case 3:
                workshopInstance = _b.sent();
                if (workshopInstance)
                    workshopInstances.push(workshopInstance);
                _b.label = 4;
            case 4:
                teamIds_1_1 = teamIds_1.next();
                return [3 /*break*/, 2];
            case 5: return [3 /*break*/, 8];
            case 6:
                e_3_1 = _b.sent();
                e_3 = { error: e_3_1 };
                return [3 /*break*/, 8];
            case 7:
                try {
                    if (teamIds_1_1 && !teamIds_1_1.done && (_a = teamIds_1.return)) _a.call(teamIds_1);
                }
                finally { if (e_3) throw e_3.error; }
                return [7 /*endfinally*/];
            case 8:
                if (workshopInstances)
                    res.send(workshopInstances);
                else
                    res.status(401).send({ err: 401, data: [] });
                return [3 /*break*/, 10];
            case 9:
                error_15 = _b.sent();
                console.error(error_15);
                res.status(500).send({ err: 500, data: [] });
                return [3 /*break*/, 10];
            case 10: return [2 /*return*/];
        }
    });
}); });
var server = server_1.Server.getInstance();
server.registerRouterAPI(1, router, "/workshop");
//# sourceMappingURL=server.js.map