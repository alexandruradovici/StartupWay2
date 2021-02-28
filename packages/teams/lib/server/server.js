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
exports.TeamsServer = void 0;
var express_1 = require("express");
var server_1 = require("@startupway/main/lib/server");
var server_2 = require("@startupway/database/lib/server");
var server_3 = require("@startupway/users/lib/server");
var uuid_1 = require("uuid");
var TeamsServer = /** @class */ (function () {
    function TeamsServer() {
    }
    TeamsServer.prototype.addTeam = function (team, product) {
        return __awaiter(this, void 0, void 0, function () {
            var conn, o, queryOptions, res, productResponse, teamResponse, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        conn = null;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 24, , 28]);
                        return [4 /*yield*/, server_2.getPool().getConnection()];
                    case 2:
                        conn = _a.sent();
                        if (!conn) return [3 /*break*/, 22];
                        return [4 /*yield*/, conn.beginTransaction()];
                    case 3:
                        _a.sent();
                        o = void 0;
                        queryOptions = {
                            namedPlaceholders: true,
                            sql: "INSERT INTO products (productId,startupName,businessTrack,teamType,workshopDay,mentorId,descriptionEN,descriptionRO,pendingDescriptionEN,pendingDescriptionRO,productDetails,updatedAt,lastMentorUpdate) VALUES(:productId,:startupName,:businessTrack,:teamType,:workshopDay,:mentorId,:descriptionEN,:descriptionRO,:pendingDescriptionEN,:pendingDescriptionRO,:productDetails,:updatedAt,:lastMentorUpdate)"
                        };
                        return [4 /*yield*/, conn.query(queryOptions, product)];
                    case 4:
                        res = _a.sent();
                        queryOptions.sql = " SELECT productId,startupName,businessTrack,teamType,workshopDay,mentorId,descriptionEN,descriptionRO,pendingDescriptionEN,pendingDescriptionRO,productDetails,updatedAt,lastMentorUpdate FROM products WHERE productId=:productId";
                        return [4 /*yield*/, conn.query(queryOptions, { productId: res.insertId })];
                    case 5:
                        productResponse = _a.sent();
                        console.log(res);
                        console.log(productResponse);
                        if (!(productResponse && productResponse.length > 0 && productResponse[0])) return [3 /*break*/, 18];
                        team.productId = productResponse[0].productId;
                        queryOptions.sql = "INSERT INTO teams (teamId,productId,teamName,teamDetails,location,year) VALUES(:teamId,:productId,:teamName,:teamDetails,:location,:year)";
                        return [4 /*yield*/, conn.query(queryOptions, team)];
                    case 6:
                        res = _a.sent();
                        queryOptions.sql = "SELECT teamId,productId,teamName,teamDetails,location,year FROM teams WHERE teamId=:teamId";
                        return [4 /*yield*/, conn.query(queryOptions, { teamId: res.insertId })];
                    case 7:
                        teamResponse = _a.sent();
                        console.log(res);
                        console.log(teamResponse);
                        if (!(teamResponse && teamResponse.length > 0 && teamResponse[0])) return [3 /*break*/, 14];
                        team = teamResponse[0];
                        product = productResponse[0];
                        o = {
                            teamId: team.teamId,
                            teamName: team.teamName,
                            productId: team.productId,
                            mentorId: product.mentorId,
                            year: team.year,
                            location: team.location,
                            startupName: product.startupName,
                            businessTrack: product.businessTrack,
                            teamType: product.teamType,
                            workshopDay: product.workshopDay,
                            descriptionRO: product.descriptionRO,
                            descriptionEN: product.descriptionEN,
                            pendingDescriptionRO: product.pendingDescriptionRO,
                            pendingDescriptionEN: product.pendingDescriptionEN,
                            teamDetails: team.teamDetails,
                            productDetails: product.productDetails,
                            updatedAt: product.updatedAt,
                            lastMentorUpdate: product.lastMentorUpdate
                        };
                        if (!o) return [3 /*break*/, 10];
                        return [4 /*yield*/, conn.commit()];
                    case 8:
                        _a.sent();
                        return [4 /*yield*/, conn.end()];
                    case 9:
                        _a.sent();
                        return [2 /*return*/, o];
                    case 10: return [4 /*yield*/, conn.rollback()];
                    case 11:
                        _a.sent();
                        return [4 /*yield*/, conn.end()];
                    case 12:
                        _a.sent();
                        return [2 /*return*/, null];
                    case 13: return [3 /*break*/, 17];
                    case 14: return [4 /*yield*/, conn.rollback()];
                    case 15:
                        _a.sent();
                        return [4 /*yield*/, conn.end()];
                    case 16:
                        _a.sent();
                        return [2 /*return*/, null];
                    case 17: return [3 /*break*/, 21];
                    case 18: return [4 /*yield*/, conn.rollback()];
                    case 19:
                        _a.sent();
                        return [4 /*yield*/, conn.end()];
                    case 20:
                        _a.sent();
                        return [2 /*return*/, null];
                    case 21: return [3 /*break*/, 23];
                    case 22: return [2 /*return*/, null];
                    case 23: return [3 /*break*/, 28];
                    case 24:
                        error_1 = _a.sent();
                        if (!conn) return [3 /*break*/, 27];
                        return [4 /*yield*/, conn.rollback()];
                    case 25:
                        _a.sent();
                        return [4 /*yield*/, conn.end()];
                    case 26:
                        _a.sent();
                        _a.label = 27;
                    case 27: return [2 /*return*/, null];
                    case 28: return [2 /*return*/];
                }
            });
        });
    };
    TeamsServer.prototype.deleteTeam = function (team) {
        return __awaiter(this, void 0, void 0, function () {
            var conn, queryOptions, deleteUT, deleteT, deleteP, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        conn = null;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 17, , 21]);
                        return [4 /*yield*/, server_2.getPool().getConnection()];
                    case 2:
                        conn = _a.sent();
                        if (!conn) return [3 /*break*/, 15];
                        return [4 /*yield*/, conn.beginTransaction()];
                    case 3:
                        _a.sent();
                        queryOptions = {
                            namedPlaceholders: true,
                            sql: "DELETE FROM userTeams WHERE userTeams.teamId=:teamId"
                        };
                        return [4 /*yield*/, conn.query(queryOptions, { teamId: team.teamId })];
                    case 4:
                        _a.sent();
                        queryOptions.sql = "SELECT teamId as deleted_id FROM userTeams WHERE teamId=:teamId";
                        return [4 /*yield*/, conn.query(queryOptions, { teamId: team.teamId })];
                    case 5:
                        deleteUT = _a.sent();
                        if (!(deleteUT && deleteUT.length === 0)) return [3 /*break*/, 12];
                        queryOptions.sql = "DELETE FROM teams WHERE teams.teamId=:teamId";
                        return [4 /*yield*/, conn.query(queryOptions, { teamId: team.teamId })];
                    case 6:
                        _a.sent();
                        queryOptions.sql = "SELECT teamId as deleted_id FROM teams WHERE teamId=:teamId";
                        return [4 /*yield*/, conn.query(queryOptions, { teamId: team.teamId })];
                    case 7:
                        deleteT = _a.sent();
                        if (!(deleteT && deleteT.length === 0)) return [3 /*break*/, 12];
                        queryOptions.sql = "DELETE FROM products WHERE product.productId=:productId";
                        return [4 /*yield*/, conn.query(queryOptions, { teamId: team.teamId })];
                    case 8:
                        _a.sent();
                        queryOptions.sql = "SELECT productId as deleted_id FROM products WHERE productId=:productId";
                        return [4 /*yield*/, conn.query(queryOptions, { productId: team.productId })];
                    case 9:
                        deleteP = _a.sent();
                        if (!(deleteP && deleteP.length === 0)) return [3 /*break*/, 12];
                        return [4 /*yield*/, conn.commit()];
                    case 10:
                        _a.sent();
                        return [4 /*yield*/, conn.end()];
                    case 11:
                        _a.sent();
                        return [2 /*return*/, true];
                    case 12: return [4 /*yield*/, conn.rollback()];
                    case 13:
                        _a.sent();
                        return [4 /*yield*/, conn.end()];
                    case 14:
                        _a.sent();
                        return [2 /*return*/, true];
                    case 15: return [2 /*return*/, false];
                    case 16: return [3 /*break*/, 21];
                    case 17:
                        error_2 = _a.sent();
                        console.error(error_2);
                        if (!conn) return [3 /*break*/, 20];
                        return [4 /*yield*/, conn.rollback()];
                    case 18:
                        _a.sent();
                        return [4 /*yield*/, conn.end()];
                    case 19:
                        _a.sent();
                        _a.label = 20;
                    case 20: return [2 /*return*/, false];
                    case 21: return [2 /*return*/];
                }
            });
        });
    };
    TeamsServer.prototype.modifyTeam = function (team) {
        return __awaiter(this, void 0, void 0, function () {
            var conn, queryOptions, teamResponse, error_3;
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
                        return [4 /*yield*/, conn.beginTransaction()];
                    case 3:
                        _a.sent();
                        queryOptions = {
                            namedPlaceholders: true,
                            sql: "UPDATE teams SET productId=:productId, teamName=:teamName, teamDetails=:teamDetails, location=:location, year=:year WHERE teamId=:teamId"
                        };
                        return [4 /*yield*/, conn.query(queryOptions, team)];
                    case 4:
                        _a.sent();
                        queryOptions.sql = "SELECT teamId,productId,teamName,teamDetails,location,year FROM teams WHERE teamId=:teamId";
                        return [4 /*yield*/, conn.query(queryOptions, team)];
                    case 5:
                        teamResponse = _a.sent();
                        if (!(teamResponse && teamResponse.length > 0 && teamResponse[0])) return [3 /*break*/, 8];
                        return [4 /*yield*/, conn.commit()];
                    case 6:
                        _a.sent();
                        return [4 /*yield*/, conn.end()];
                    case 7:
                        _a.sent();
                        return [2 /*return*/, teamResponse[0]];
                    case 8: return [4 /*yield*/, conn.end()];
                    case 9:
                        _a.sent();
                        return [2 /*return*/, null];
                    case 10: return [3 /*break*/, 12];
                    case 11: return [2 /*return*/, null];
                    case 12: return [3 /*break*/, 17];
                    case 13:
                        error_3 = _a.sent();
                        console.error(error_3);
                        if (!conn) return [3 /*break*/, 16];
                        return [4 /*yield*/, conn.rollback()];
                    case 14:
                        _a.sent();
                        return [4 /*yield*/, conn.end()];
                    case 15:
                        _a.sent();
                        _a.label = 16;
                    case 16: return [2 /*return*/, null];
                    case 17: return [2 /*return*/];
                }
            });
        });
    };
    TeamsServer.prototype.addUserToTeam = function (user, team, role) {
        return __awaiter(this, void 0, void 0, function () {
            var conn, queryOptions, userProductId, res, userInTeam, e_1;
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
                            sql: "INSERT INTO userTeams (userProductId,userId,teamId,role) VALUES(:userProductId,:userId,:teamId,:role)"
                        };
                        userProductId = uuid_1.v4();
                        return [4 /*yield*/, conn.query(queryOptions, { userProductId: userProductId, userId: user.userId, teamId: team.teamId, role: role })];
                    case 4:
                        res = _a.sent();
                        queryOptions.sql = "SELECT userProductId,userId,teamId,role FROM userTeams WHERE userProductId=:userProductId";
                        return [4 /*yield*/, conn.query(queryOptions, { userProductId: res.insertId })];
                    case 5:
                        userInTeam = _a.sent();
                        if (!(userInTeam && userInTeam.length > 0 && userInTeam[0])) return [3 /*break*/, 8];
                        return [4 /*yield*/, conn.commit()];
                    case 6:
                        _a.sent();
                        return [4 /*yield*/, conn.end()];
                    case 7:
                        _a.sent();
                        return [2 /*return*/, userInTeam[0]];
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
                        e_1 = _a.sent();
                        console.error(e_1);
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
    TeamsServer.prototype.deleteUserFromTeam = function (user, team) {
        return __awaiter(this, void 0, void 0, function () {
            var conn, queryOptions, response, e_2;
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
                            sql: "DELETE FROM userTeams WHERE userTeams.userId=:userId AND teamId=:teamId"
                        };
                        return [4 /*yield*/, conn.query(queryOptions, { userId: user.userId, teamId: team.teamId })];
                    case 4:
                        _a.sent();
                        queryOptions.sql = "SELECT userProductId as deleted_id FROM userTeams WHERE userTeams.userId=:userId AND teamId=:teamId";
                        return [4 /*yield*/, conn.query(queryOptions, { userId: user.userId, teamId: team.teamId })];
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
                        e_2 = _a.sent();
                        console.error(e_2);
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
    // changed param from User to number, (userId)
    TeamsServer.prototype.getUserTeams = function (userId) {
        return __awaiter(this, void 0, void 0, function () {
            var conn, queryOptions, teamsReponse, e_3;
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
                            sql: "SELECT teams.*, userTeams.userProductId, userTeams.role, userTeams.userId FROM teams INNER JOIN userTeams ON userTeams.teamId = teams.teamId WHERE userTeams.userId=:userId"
                        };
                        return [4 /*yield*/, conn.query(queryOptions, { userId: userId })];
                    case 3:
                        teamsReponse = _a.sent();
                        if (!(teamsReponse && teamsReponse.length > 0)) return [3 /*break*/, 5];
                        return [4 /*yield*/, conn.end()];
                    case 4:
                        _a.sent();
                        return [2 /*return*/, teamsReponse];
                    case 5: return [4 /*yield*/, conn.end()];
                    case 6:
                        _a.sent();
                        return [2 /*return*/, []];
                    case 7: return [3 /*break*/, 9];
                    case 8: return [2 /*return*/, []];
                    case 9: return [3 /*break*/, 13];
                    case 10:
                        e_3 = _a.sent();
                        console.error(e_3);
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
    TeamsServer.prototype.getTeams = function () {
        return __awaiter(this, void 0, void 0, function () {
            var conn, queryOptions, teamsReponse, e_4;
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
                            sql: "SELECT teams.teamId, teams.teamName, teams.teamDetails, teams.location, teams.year, products.* FROM teams INNER JOIN products ON teams.productId = products.productId"
                        };
                        return [4 /*yield*/, conn.query(queryOptions)];
                    case 3:
                        teamsReponse = _a.sent();
                        if (!(teamsReponse && teamsReponse.length > 0)) return [3 /*break*/, 5];
                        return [4 /*yield*/, conn.end()];
                    case 4:
                        _a.sent();
                        return [2 /*return*/, teamsReponse];
                    case 5: return [4 /*yield*/, conn.end()];
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
    TeamsServer.prototype.getTeamsByLocation = function (location) {
        return __awaiter(this, void 0, void 0, function () {
            var conn, queryOptions, teamsReponse, e_5;
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
                            sql: "SELECT teams.teamId, teams.teamName, teams.teamDetails, teams.location, teams.year, products.* FROM teams INNER JOIN products ON teams.productId = products.productId and teams.location=:location"
                        };
                        return [4 /*yield*/, conn.query(queryOptions, { location: location })];
                    case 3:
                        teamsReponse = _a.sent();
                        if (!(teamsReponse && teamsReponse.length > 0)) return [3 /*break*/, 5];
                        return [4 /*yield*/, conn.end()];
                    case 4:
                        _a.sent();
                        return [2 /*return*/, teamsReponse];
                    case 5: return [4 /*yield*/, conn.end()];
                    case 6:
                        _a.sent();
                        return [2 /*return*/, []];
                    case 7: return [3 /*break*/, 9];
                    case 8: return [2 /*return*/, []];
                    case 9: return [3 /*break*/, 13];
                    case 10:
                        e_5 = _a.sent();
                        console.error(e_5);
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
    TeamsServer.prototype.getTeamById = function (teamId) {
        return __awaiter(this, void 0, void 0, function () {
            var conn, queryOptions, teamsReponse, e_6;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        conn = null;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 13, , 16]);
                        return [4 /*yield*/, server_2.getPool().getConnection()];
                    case 2:
                        conn = _a.sent();
                        if (!conn) return [3 /*break*/, 11];
                        if (!(teamId && teamId !== "")) return [3 /*break*/, 8];
                        queryOptions = {
                            namedPlaceholders: true,
                            sql: "SELECT * FROM teams WHERE teams.teamId=:teamId"
                        };
                        return [4 /*yield*/, conn.query(queryOptions, { teamId: teamId })];
                    case 3:
                        teamsReponse = _a.sent();
                        if (!(teamsReponse && teamsReponse.length > 0 && teamsReponse[0])) return [3 /*break*/, 5];
                        return [4 /*yield*/, conn.end()];
                    case 4:
                        _a.sent();
                        return [2 /*return*/, teamsReponse[0]];
                    case 5: return [4 /*yield*/, conn.end()];
                    case 6:
                        _a.sent();
                        return [2 /*return*/, null];
                    case 7: return [3 /*break*/, 10];
                    case 8: return [4 /*yield*/, conn.end()];
                    case 9:
                        _a.sent();
                        return [2 /*return*/, null];
                    case 10: return [3 /*break*/, 12];
                    case 11: return [2 /*return*/, null];
                    case 12: return [3 /*break*/, 16];
                    case 13:
                        e_6 = _a.sent();
                        console.log("GetTeamByID");
                        console.error(e_6);
                        if (!conn) return [3 /*break*/, 15];
                        return [4 /*yield*/, conn.end()];
                    case 14:
                        _a.sent();
                        _a.label = 15;
                    case 15: return [2 /*return*/, null];
                    case 16: return [2 /*return*/];
                }
            });
        });
    };
    TeamsServer.prototype.getTeamByProductId = function (productId) {
        return __awaiter(this, void 0, void 0, function () {
            var conn, queryOptions, teamsReponse, e_7;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        conn = null;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 13, , 16]);
                        return [4 /*yield*/, server_2.getPool().getConnection()];
                    case 2:
                        conn = _a.sent();
                        if (!conn) return [3 /*break*/, 11];
                        if (!(productId && productId !== "")) return [3 /*break*/, 8];
                        queryOptions = {
                            namedPlaceholders: true,
                            sql: "SELECT * FROM teams WHERE teams.productId=:productId"
                        };
                        return [4 /*yield*/, conn.query(queryOptions, { productId: productId })];
                    case 3:
                        teamsReponse = _a.sent();
                        if (!(teamsReponse && teamsReponse.length > 0 && teamsReponse[0])) return [3 /*break*/, 5];
                        return [4 /*yield*/, conn.end()];
                    case 4:
                        _a.sent();
                        return [2 /*return*/, teamsReponse[0]];
                    case 5: return [4 /*yield*/, conn.end()];
                    case 6:
                        _a.sent();
                        return [2 /*return*/, null];
                    case 7: return [3 /*break*/, 10];
                    case 8: return [4 /*yield*/, conn.end()];
                    case 9:
                        _a.sent();
                        return [2 /*return*/, null];
                    case 10: return [3 /*break*/, 12];
                    case 11: return [2 /*return*/, null];
                    case 12: return [3 /*break*/, 16];
                    case 13:
                        e_7 = _a.sent();
                        console.error(e_7);
                        if (!conn) return [3 /*break*/, 15];
                        return [4 /*yield*/, conn.end()];
                    case 14:
                        _a.sent();
                        _a.label = 15;
                    case 15: return [2 /*return*/, null];
                    case 16: return [2 /*return*/];
                }
            });
        });
    };
    TeamsServer.prototype.getTeamsByIdList = function (list) {
        return __awaiter(this, void 0, void 0, function () {
            var conn, queryOptions, teamsReponse, e_8;
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
                            sql: "SELECT * FROM teams WHERE teams.teamId IN (:...list)"
                        };
                        return [4 /*yield*/, conn.query(queryOptions, { list: list })];
                    case 3:
                        teamsReponse = _a.sent();
                        if (!(teamsReponse && teamsReponse.length > 0 && teamsReponse[0])) return [3 /*break*/, 5];
                        return [4 /*yield*/, conn.end()];
                    case 4:
                        _a.sent();
                        return [2 /*return*/, teamsReponse];
                    case 5: return [4 /*yield*/, conn.end()];
                    case 6:
                        _a.sent();
                        return [2 /*return*/, []];
                    case 7: return [3 /*break*/, 9];
                    case 8: return [2 /*return*/, []];
                    case 9: return [3 /*break*/, 13];
                    case 10:
                        e_8 = _a.sent();
                        console.error(e_8);
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
    /**
        OGOR 28 49
        iccguard 35 56
        PacketCloud 36 57
        Rungutan 105 127
        Exigo 32 53
        LEDD 40 61
        Synovius 101 123
        Vatis Tech 34 55
        actevanzarimasini 26 47
        ESENCA 15 34
        ParkingWizzard 67 88
        Themis 25 46
        KidsFinance 21 42
        HereItIs 106 128
        PolyMore 89 111
        Tire2Tire 18 37
    */
    TeamsServer.prototype.tempF = function () {
        return __awaiter(this, void 0, void 0, function () {
            var conn, tList, queryOptions, teamsList, teamsList_1, teamsList_1_1, t, e_9;
            var e_10, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        conn = null;
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 10, , 13]);
                        return [4 /*yield*/, server_2.getPool().getConnection()];
                    case 2:
                        conn = _b.sent();
                        if (!conn) return [3 /*break*/, 8];
                        tList = [];
                        queryOptions = {
                            namedPlaceholders: true,
                            sql: "SELECT teamId FROM teams WHERE teams.teamId IN (:...list)"
                        };
                        return [4 /*yield*/, conn.query(queryOptions, { list: [28, 35, 36, 105, 32, 40, 101, 34, 26, 15, 67, 25, 21, 106, 89, 18] })];
                    case 3:
                        teamsList = _b.sent();
                        if (!(teamsList && teamsList.length > 0)) return [3 /*break*/, 5];
                        try {
                            for (teamsList_1 = __values(teamsList), teamsList_1_1 = teamsList_1.next(); !teamsList_1_1.done; teamsList_1_1 = teamsList_1.next()) {
                                t = teamsList_1_1.value;
                                tList.push(t.teamId);
                            }
                        }
                        catch (e_10_1) { e_10 = { error: e_10_1 }; }
                        finally {
                            try {
                                if (teamsList_1_1 && !teamsList_1_1.done && (_a = teamsList_1.return)) _a.call(teamsList_1);
                            }
                            finally { if (e_10) throw e_10.error; }
                        }
                        return [4 /*yield*/, conn.end()];
                    case 4:
                        _b.sent();
                        return [2 /*return*/, tList];
                    case 5: return [4 /*yield*/, conn.end()];
                    case 6:
                        _b.sent();
                        return [2 /*return*/, []];
                    case 7: return [3 /*break*/, 9];
                    case 8: return [2 /*return*/, []];
                    case 9: return [3 /*break*/, 13];
                    case 10:
                        e_9 = _b.sent();
                        console.error(e_9);
                        if (!conn) return [3 /*break*/, 12];
                        return [4 /*yield*/, conn.end()];
                    case 11:
                        _b.sent();
                        _b.label = 12;
                    case 12: return [2 /*return*/, []];
                    case 13: return [2 /*return*/];
                }
            });
        });
    };
    TeamsServer.prototype.getProductById = function (productId) {
        return __awaiter(this, void 0, void 0, function () {
            var conn, queryOptions, productResponse, e_11;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        conn = null;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 13, , 16]);
                        return [4 /*yield*/, server_2.getPool().getConnection()];
                    case 2:
                        conn = _a.sent();
                        if (!conn) return [3 /*break*/, 11];
                        if (!(productId && productId !== "")) return [3 /*break*/, 8];
                        queryOptions = {
                            namedPlaceholders: true,
                            sql: "SELECT * FROM products WHERE products.productId=:productId"
                        };
                        return [4 /*yield*/, conn.query(queryOptions, { productId: productId })];
                    case 3:
                        productResponse = _a.sent();
                        if (!(productResponse && productResponse.length > 0 && productResponse[0])) return [3 /*break*/, 5];
                        return [4 /*yield*/, conn.end()];
                    case 4:
                        _a.sent();
                        return [2 /*return*/, productResponse[0]];
                    case 5: return [4 /*yield*/, conn.end()];
                    case 6:
                        _a.sent();
                        return [2 /*return*/, null];
                    case 7:
                        ;
                        return [3 /*break*/, 10];
                    case 8: return [4 /*yield*/, conn.end()];
                    case 9:
                        _a.sent();
                        return [2 /*return*/, null];
                    case 10: return [3 /*break*/, 12];
                    case 11: return [2 /*return*/, null];
                    case 12: return [3 /*break*/, 16];
                    case 13:
                        e_11 = _a.sent();
                        console.error(e_11);
                        if (!conn) return [3 /*break*/, 15];
                        return [4 /*yield*/, conn.end()];
                    case 14:
                        _a.sent();
                        _a.label = 15;
                    case 15: return [2 /*return*/, null];
                    case 16: return [2 /*return*/];
                }
            });
        });
    };
    TeamsServer.prototype.getUserInTeam = function (userId, teamId) {
        return __awaiter(this, void 0, void 0, function () {
            var conn, queryOptions, userTeamsResponse, e_12;
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
                            sql: "SELECT * FROM userTeams WHERE userTeams.userId=:userId AND userTeams.teamId=:teamId"
                        };
                        return [4 /*yield*/, conn.query(queryOptions, { teamId: teamId, userId: userId })];
                    case 3:
                        userTeamsResponse = _a.sent();
                        if (!(userTeamsResponse && userTeamsResponse.length > 0 && userTeamsResponse[0])) return [3 /*break*/, 5];
                        return [4 /*yield*/, conn.end()];
                    case 4:
                        _a.sent();
                        return [2 /*return*/, userTeamsResponse[0]];
                    case 5: return [4 /*yield*/, conn.end()];
                    case 6:
                        _a.sent();
                        return [2 /*return*/, null];
                    case 7: return [3 /*break*/, 9];
                    case 8: return [2 /*return*/, null];
                    case 9: return [3 /*break*/, 13];
                    case 10:
                        e_12 = _a.sent();
                        console.error(e_12);
                        if (!conn) return [3 /*break*/, 12];
                        return [4 /*yield*/, conn.end()];
                    case 11:
                        _a.sent();
                        _a.label = 12;
                    case 12: return [2 /*return*/, null];
                    case 13: return [2 /*return*/];
                }
            });
        });
    };
    TeamsServer.prototype.getTimestampProduct = function (productId) {
        return __awaiter(this, void 0, void 0, function () {
            var conn, queryOptions, productResponse, e_13;
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
                            sql: "SELECT products.timestamp FROM products WHERE products.productId=:productId"
                        };
                        return [4 /*yield*/, conn.query(queryOptions, { productId: productId })];
                    case 3:
                        productResponse = _a.sent();
                        if (!(productResponse && productResponse.length > 0 && productResponse[0])) return [3 /*break*/, 5];
                        return [4 /*yield*/, conn.end()];
                    case 4:
                        _a.sent();
                        return [2 /*return*/, productResponse[0]];
                    case 5: return [4 /*yield*/, conn.end()];
                    case 6:
                        _a.sent();
                        return [2 /*return*/, null];
                    case 7: return [3 /*break*/, 9];
                    case 8: return [2 /*return*/, null];
                    case 9: return [3 /*break*/, 13];
                    case 10:
                        e_13 = _a.sent();
                        console.error(e_13);
                        if (!conn) return [3 /*break*/, 12];
                        return [4 /*yield*/, conn.end()];
                    case 11:
                        _a.sent();
                        _a.label = 12;
                    case 12: return [2 /*return*/, null];
                    case 13: return [2 /*return*/];
                }
            });
        });
    };
    TeamsServer.prototype.getTeamByYearAndLocation = function (year, location, teamName) {
        return __awaiter(this, void 0, void 0, function () {
            var conn, queryOptions, teamResponse, e_14;
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
                            sql: "SELECT * FROM teams WHERE teams.year=:year AND teams.location=:location AND teams.teamName=:teamName"
                        };
                        return [4 /*yield*/, conn.query(queryOptions, { year: year, location: location, teamName: teamName })];
                    case 3:
                        teamResponse = _a.sent();
                        if (!(teamResponse && teamResponse.length > 0 && teamResponse[0])) return [3 /*break*/, 5];
                        return [4 /*yield*/, conn.end()];
                    case 4:
                        _a.sent();
                        return [2 /*return*/, teamResponse[0]];
                    case 5: return [4 /*yield*/, conn.end()];
                    case 6:
                        _a.sent();
                        return [2 /*return*/, null];
                    case 7: return [3 /*break*/, 9];
                    case 8: return [2 /*return*/, null];
                    case 9: return [3 /*break*/, 13];
                    case 10:
                        e_14 = _a.sent();
                        console.error(e_14);
                        if (!conn) return [3 /*break*/, 12];
                        return [4 /*yield*/, conn.end()];
                    case 11:
                        _a.sent();
                        _a.label = 12;
                    case 12: return [2 /*return*/, null];
                    case 13: return [2 /*return*/];
                }
            });
        });
    };
    TeamsServer.prototype.isTeamInDate = function (date, productId) {
        return __awaiter(this, void 0, void 0, function () {
            var conn, queryOptions, response, e_15;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        conn = null;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 17, , 20]);
                        return [4 /*yield*/, server_2.getPool().getConnection()];
                    case 2:
                        conn = _a.sent();
                        if (!conn) return [3 /*break*/, 15];
                        queryOptions = {
                            namedPlaceholders: true,
                            sql: ""
                        };
                        response = void 0;
                        if (!(date === "may")) return [3 /*break*/, 4];
                        queryOptions.sql = "SELECT * FROM products WHERE products.productId=:productId JSON_EXTRACT(productDetails,'$.assessment20May') = 'Yes'";
                        return [4 /*yield*/, conn.query(queryOptions, { productId: productId })];
                    case 3:
                        response = _a.sent();
                        return [3 /*break*/, 10];
                    case 4:
                        if (!(date === "oct")) return [3 /*break*/, 6];
                        queryOptions.sql = "SELECT * FROM products WHERE products.productId=:productId JSON_EXTRACT(productDetails,'$.assessment20May') = 'Yes' AND JSON_EXTRACT(productDetails,'$.assessment12Oct') = 'Yes'";
                        return [4 /*yield*/, conn.query(queryOptions, { productId: productId })];
                    case 5:
                        response = _a.sent();
                        return [3 /*break*/, 10];
                    case 6:
                        if (!(date === "none")) return [3 /*break*/, 8];
                        return [4 /*yield*/, conn.end()];
                    case 7:
                        _a.sent();
                        return [2 /*return*/, true];
                    case 8: return [4 /*yield*/, conn.end()];
                    case 9:
                        _a.sent();
                        return [2 /*return*/, false];
                    case 10:
                        if (!(response && response.length > 0 && response[0])) return [3 /*break*/, 12];
                        return [4 /*yield*/, conn.end()];
                    case 11:
                        _a.sent();
                        return [2 /*return*/, true];
                    case 12: return [4 /*yield*/, conn.end()];
                    case 13:
                        _a.sent();
                        return [2 /*return*/, false];
                    case 14: return [3 /*break*/, 16];
                    case 15: return [2 /*return*/, false];
                    case 16: return [3 /*break*/, 20];
                    case 17:
                        e_15 = _a.sent();
                        console.error(e_15);
                        if (!conn) return [3 /*break*/, 19];
                        return [4 /*yield*/, conn.end()];
                    case 18:
                        _a.sent();
                        _a.label = 19;
                    case 19: return [2 /*return*/, false];
                    case 20: return [2 /*return*/];
                }
            });
        });
    };
    TeamsServer.prototype.getUsersByTeamId = function (teamId) {
        return __awaiter(this, void 0, void 0, function () {
            var conn, queryOptions, teamResponse, e_16;
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
                            sql: "SELECT userTeams.userProductId, userTeams.teamId, users.* FROM userTeams INNER JOIN users ON users.userId=userTeams.userId WHERE userTeams.teamId=:teamId"
                        };
                        return [4 /*yield*/, conn.query(queryOptions, { teamId: teamId })];
                    case 3:
                        teamResponse = _a.sent();
                        if (!(teamResponse && teamResponse.length > 0)) return [3 /*break*/, 5];
                        return [4 /*yield*/, conn.end()];
                    case 4:
                        _a.sent();
                        return [2 /*return*/, teamResponse];
                    case 5: return [4 /*yield*/, conn.end()];
                    case 6:
                        _a.sent();
                        return [2 /*return*/, []];
                    case 7: return [3 /*break*/, 9];
                    case 8: return [2 /*return*/, []];
                    case 9: return [3 /*break*/, 13];
                    case 10:
                        e_16 = _a.sent();
                        console.error(e_16);
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
    TeamsServer.prototype.getProductByTeamId = function (teamId) {
        return __awaiter(this, void 0, void 0, function () {
            var conn, teamById, queryOptions, teamResponse, e_17;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        conn = null;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 13, , 16]);
                        return [4 /*yield*/, server_2.getPool().getConnection()];
                    case 2:
                        conn = _a.sent();
                        if (!conn) return [3 /*break*/, 11];
                        return [4 /*yield*/, this.getTeamById(teamId)];
                    case 3:
                        teamById = _a.sent();
                        if (!teamById) return [3 /*break*/, 9];
                        queryOptions = {
                            namedPlaceholders: true,
                            sql: "SELECT * FROM products WHERE products.productId=:productId"
                        };
                        return [4 /*yield*/, conn.query(queryOptions, { productId: teamById.productId })];
                    case 4:
                        teamResponse = _a.sent();
                        if (!(teamResponse && teamResponse.length > 0 && teamResponse[0])) return [3 /*break*/, 6];
                        return [4 /*yield*/, conn.end()];
                    case 5:
                        _a.sent();
                        return [2 /*return*/, teamResponse[0]];
                    case 6: return [4 /*yield*/, conn.end()];
                    case 7:
                        _a.sent();
                        return [2 /*return*/, null];
                    case 8: return [3 /*break*/, 10];
                    case 9: return [2 /*return*/, null];
                    case 10: return [3 /*break*/, 12];
                    case 11: return [2 /*return*/, null];
                    case 12: return [3 /*break*/, 16];
                    case 13:
                        e_17 = _a.sent();
                        console.log("getProductByTeamId");
                        console.error(e_17);
                        if (!conn) return [3 /*break*/, 15];
                        return [4 /*yield*/, conn.end()];
                    case 14:
                        _a.sent();
                        _a.label = 15;
                    case 15: return [2 /*return*/, null];
                    case 16: return [2 /*return*/];
                }
            });
        });
    };
    TeamsServer.prototype.getTeamAndProductByMentorId = function (mentorId) {
        return __awaiter(this, void 0, void 0, function () {
            var conn, queryOptions, teamResponse, error_4;
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
                            sql: "SELECT teams.teamId, teams.teamName, teams.teamDetails, teams.location, teams.year, products.* FROM teams INNER JOIN products ON teams.productId=products.productId AND products.mentorId=:mentorId"
                        };
                        return [4 /*yield*/, conn.query(queryOptions, { mentorId: mentorId })];
                    case 3:
                        teamResponse = _a.sent();
                        if (!(teamResponse && teamResponse.length > 0)) return [3 /*break*/, 5];
                        return [4 /*yield*/, conn.end()];
                    case 4:
                        _a.sent();
                        return [2 /*return*/, teamResponse];
                    case 5: return [4 /*yield*/, conn.end()];
                    case 6:
                        _a.sent();
                        return [2 /*return*/, []];
                    case 7: return [3 /*break*/, 9];
                    case 8: return [2 /*return*/, []];
                    case 9: return [3 /*break*/, 13];
                    case 10:
                        error_4 = _a.sent();
                        console.error(error_4);
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
    TeamsServer.prototype.getTeamByMentorId = function (mentorId) {
        return __awaiter(this, void 0, void 0, function () {
            var conn, queryOptions, teamResponse, error_5;
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
                            sql: "SELECT teams.* FROM teams INNER JOIN products ON products.productId=teams.productId WHERE products.mentorId=:mentorId"
                        };
                        return [4 /*yield*/, conn.query(queryOptions, { mentorId: mentorId })];
                    case 3:
                        teamResponse = _a.sent();
                        if (!(teamResponse && teamResponse.length > 0)) return [3 /*break*/, 5];
                        return [4 /*yield*/, conn.end()];
                    case 4:
                        _a.sent();
                        return [2 /*return*/, teamResponse];
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
    TeamsServer.prototype.getProductByMentorId = function (mentorId) {
        return __awaiter(this, void 0, void 0, function () {
            var conn, queryOptions, productResponse, error_6;
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
                            sql: "SELECT * FROM products WHERE mentorId=:mentorId"
                        };
                        return [4 /*yield*/, conn.query(queryOptions, { mentorId: mentorId })];
                    case 3:
                        productResponse = _a.sent();
                        if (!(productResponse && productResponse.length > 0)) return [3 /*break*/, 5];
                        return [4 /*yield*/, conn.end()];
                    case 4:
                        _a.sent();
                        return [2 /*return*/, productResponse];
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
    TeamsServer.prototype.updateProduct = function (product) {
        return __awaiter(this, void 0, void 0, function () {
            var conn, queryOptions, teamResponse, error_7;
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
                            sql: "UPDATE products SET startupName=:startupName, businessTrack=:businessTrack, teamType=:teamType, workshopDay=:workshopDay, mentorId=:mentorId, descriptionEN=:descriptionEN, descriptionRO=:descriptionRO, pendingDescriptionEN=:pendingDescriptionEN, pendingDescriptionRO=:pendingDescriptionRO, productDetails=:productDetails, updatedAt=:updatedAt, lastMentorUpdate=:lastMentorUpdate WHERE productId=:productId"
                        };
                        return [4 /*yield*/, conn.query(queryOptions, product)];
                    case 4:
                        _a.sent();
                        queryOptions.sql = "SELECT productId, startupName, businessTrack, teamType, workshopDay, mentorId, descriptionEN, descriptionRO, pendingDescriptionEN, pendingDescriptionRO, productDetails, updatedAt, lastMentorUpdate FROM products WHERE productId=:productId";
                        return [4 /*yield*/, conn.query(queryOptions, product)];
                    case 5:
                        teamResponse = _a.sent();
                        if (!(teamResponse && teamResponse.length > 0 && teamResponse[0])) return [3 /*break*/, 8];
                        return [4 /*yield*/, conn.commit()];
                    case 6:
                        _a.sent();
                        return [4 /*yield*/, conn.end()];
                    case 7:
                        _a.sent();
                        return [2 /*return*/, teamResponse[0]];
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
                        error_7 = _a.sent();
                        console.error(error_7);
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
    TeamsServer.prototype.updateTeam = function (team) {
        return __awaiter(this, void 0, void 0, function () {
            var conn, queryOptions, teamResponse, error_8;
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
                            sql: "UPDATE teams SET productId=:productId, teamName=:teamName, teamDetails=:teamDetails, location=:location, year=:year WHERE teamId=:teamId"
                        };
                        return [4 /*yield*/, conn.query(queryOptions, team)];
                    case 4:
                        _a.sent();
                        queryOptions.sql = "SELECT teamId,productId,teamName,teamDetails,location,year FROM teams WHERE teamId=:teamId";
                        return [4 /*yield*/, conn.query(queryOptions, team)];
                    case 5:
                        teamResponse = _a.sent();
                        if (!(teamResponse && teamResponse.length > 0 && teamResponse[0])) return [3 /*break*/, 8];
                        return [4 /*yield*/, conn.commit()];
                    case 6:
                        _a.sent();
                        return [4 /*yield*/, conn.end()];
                    case 7:
                        _a.sent();
                        return [2 /*return*/, teamResponse[0]];
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
                        error_8 = _a.sent();
                        console.error(error_8);
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
    TeamsServer.prototype.approveDescription = function (product) {
        return __awaiter(this, void 0, void 0, function () {
            var productResponse, error_9;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        if (product.pendingDescriptionEN !== "")
                            product.descriptionEN = product.pendingDescriptionEN;
                        if (product.pendingDescriptionRO !== "")
                            product.descriptionRO = product.pendingDescriptionRO;
                        product.pendingDescriptionEN = "";
                        product.pendingDescriptionRO = "";
                        product.updatedAt = new Date();
                        return [4 /*yield*/, this.updateProduct(product)];
                    case 1:
                        productResponse = _a.sent();
                        if (productResponse)
                            return [2 /*return*/, productResponse];
                        else
                            return [2 /*return*/, null];
                        return [3 /*break*/, 3];
                    case 2:
                        error_9 = _a.sent();
                        console.error(error_9);
                        return [2 /*return*/, null];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    TeamsServer.prototype.getUserActivity = function (userId, teamId) {
        return __awaiter(this, void 0, void 0, function () {
            var conn, queryOptions, teamResponse, error_10;
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
                            sql: "SELECT * FROM userActivities WHERE userActivities.userId=:userId AND userActivities.teamId=:teamId"
                        };
                        return [4 /*yield*/, conn.query(queryOptions, { userId: userId, teamId: teamId })];
                    case 3:
                        teamResponse = _a.sent();
                        if (!(teamResponse && teamResponse.length > 0)) return [3 /*break*/, 5];
                        return [4 /*yield*/, conn.end()];
                    case 4:
                        _a.sent();
                        return [2 /*return*/, teamResponse];
                    case 5: return [4 /*yield*/, conn.end()];
                    case 6:
                        _a.sent();
                        return [2 /*return*/, []];
                    case 7: return [3 /*break*/, 9];
                    case 8: return [2 /*return*/, []];
                    case 9: return [3 /*break*/, 13];
                    case 10:
                        error_10 = _a.sent();
                        console.error(error_10);
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
    TeamsServer.prototype.addActivityForUser = function (userActivity) {
        return __awaiter(this, void 0, void 0, function () {
            var conn, queryOptions, activityResponse, res, activity, error_11;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        conn = null;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 18, , 22]);
                        return [4 /*yield*/, server_2.getPool().getConnection()];
                    case 2:
                        conn = _a.sent();
                        if (!conn) return [3 /*break*/, 16];
                        return [4 /*yield*/, conn.beginTransaction()];
                    case 3:
                        _a.sent();
                        queryOptions = {
                            namedPlaceholders: true,
                            sql: "SELECT * FROM userActivities WHERE userId=:userId AND teamId=:teamId AND (WEEK(date, 7)=WEEK(CURDATE(), 7) OR WEEK(date, 7)=(WEEK(CURDATE(), 7)-1)) AND WEEK(date, 7)=WEEK(:date, 7)"
                        };
                        return [4 /*yield*/, conn.query(queryOptions, userActivity)];
                    case 4:
                        activityResponse = _a.sent();
                        if (!(activityResponse && activityResponse.length > 0 && activityResponse[0])) return [3 /*break*/, 7];
                        return [4 /*yield*/, conn.rollback()];
                    case 5:
                        _a.sent();
                        return [4 /*yield*/, conn.end()];
                    case 6:
                        _a.sent();
                        return [2 /*return*/, null];
                    case 7:
                        queryOptions.sql = "INSERT INTO userActivities (activityId,userId,teamId,noOfHours,date,description) VALUES(:activityId,:userId,:teamId,:noOfHours,:date,:description)";
                        return [4 /*yield*/, conn.query(queryOptions, userActivity)];
                    case 8:
                        res = _a.sent();
                        queryOptions.sql = "SELECT activityId,userId,teamId,noOfHours,date,description FROM userActivities WHERE activityId=:activityId";
                        return [4 /*yield*/, conn.query(queryOptions, { activityId: res.insertId })];
                    case 9:
                        activity = _a.sent();
                        if (!(activity && activity.length > 0 && activity[0])) return [3 /*break*/, 12];
                        return [4 /*yield*/, conn.commit()];
                    case 10:
                        _a.sent();
                        return [4 /*yield*/, conn.end()];
                    case 11:
                        _a.sent();
                        return [2 /*return*/, activity[0]];
                    case 12: return [4 /*yield*/, conn.rollback()];
                    case 13:
                        _a.sent();
                        return [4 /*yield*/, conn.end()];
                    case 14:
                        _a.sent();
                        return [2 /*return*/, null];
                    case 15: return [3 /*break*/, 17];
                    case 16: return [2 /*return*/, null];
                    case 17: return [3 /*break*/, 22];
                    case 18:
                        error_11 = _a.sent();
                        console.error(error_11);
                        if (!conn) return [3 /*break*/, 21];
                        return [4 /*yield*/, conn.rollback()];
                    case 19:
                        _a.sent();
                        return [4 /*yield*/, conn.end()];
                    case 20:
                        _a.sent();
                        _a.label = 21;
                    case 21: return [2 /*return*/, null];
                    case 22: return [2 /*return*/];
                }
            });
        });
    };
    TeamsServer.prototype.modifyActivityForUser = function (userActivity) {
        return __awaiter(this, void 0, void 0, function () {
            var conn, queryOptions, activityResponse, activity, error_12;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        conn = null;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 19, , 23]);
                        return [4 /*yield*/, server_2.getPool().getConnection()];
                    case 2:
                        conn = _a.sent();
                        if (!conn) return [3 /*break*/, 17];
                        return [4 /*yield*/, conn.beginTransaction()];
                    case 3:
                        _a.sent();
                        queryOptions = {
                            namedPlaceholders: true,
                            sql: "SELECT * FROM userActivities WHERE userId=:userId AND teamId=:teamId AND (WEEK(date, 7)=WEEK(CURDATE(), 7) OR WEEK(date, 7)=(WEEK(CURDATE(), 7)-1)) AND WEEK(date, 7)=WEEK(:date, 7)"
                        };
                        return [4 /*yield*/, conn.query(queryOptions, userActivity)];
                    case 4:
                        activityResponse = _a.sent();
                        if (!(activityResponse && activityResponse.length > 0 && activityResponse[0])) return [3 /*break*/, 13];
                        queryOptions.sql = "UPDATE userActivities SET userId=:userId, teamId=:teamId, noOfHours=:noOfHours, date=:date, description=:description";
                        return [4 /*yield*/, conn.query(queryOptions, userActivity)];
                    case 5:
                        _a.sent();
                        queryOptions.sql = "SELECT activityId,userId,teamId,noOfHours,date,description FROM userActivities WHERE activityId=:activityId";
                        return [4 /*yield*/, conn.query(queryOptions, userActivity)];
                    case 6:
                        activity = _a.sent();
                        if (!(activity && activity.length > 0 && activity[0])) return [3 /*break*/, 9];
                        return [4 /*yield*/, conn.commit()];
                    case 7:
                        _a.sent();
                        return [4 /*yield*/, conn.end()];
                    case 8:
                        _a.sent();
                        return [2 /*return*/, activity[0]];
                    case 9: return [4 /*yield*/, conn.rollback()];
                    case 10:
                        _a.sent();
                        return [4 /*yield*/, conn.end()];
                    case 11:
                        _a.sent();
                        return [2 /*return*/, null];
                    case 12: return [3 /*break*/, 16];
                    case 13: return [4 /*yield*/, conn.rollback()];
                    case 14:
                        _a.sent();
                        return [4 /*yield*/, conn.end()];
                    case 15:
                        _a.sent();
                        return [2 /*return*/, null];
                    case 16: return [3 /*break*/, 18];
                    case 17: return [2 /*return*/, null];
                    case 18: return [3 /*break*/, 23];
                    case 19:
                        error_12 = _a.sent();
                        console.error(error_12);
                        if (!conn) return [3 /*break*/, 22];
                        return [4 /*yield*/, conn.rollback()];
                    case 20:
                        _a.sent();
                        return [4 /*yield*/, conn.end()];
                    case 21:
                        _a.sent();
                        _a.label = 22;
                    case 22: return [2 /*return*/, null];
                    case 23: return [2 /*return*/];
                }
            });
        });
    };
    TeamsServer.prototype.updateActivity = function (userActivity) {
        return __awaiter(this, void 0, void 0, function () {
            var conn, queryOptions, activity, e_18;
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
                            sql: "UPDATE userActivities SET userId=:userId, teamId=:teamId, noOfHours=:noOfHours, date=:date, description=:description WHERE activityId=:activityId"
                        };
                        return [4 /*yield*/, conn.query(queryOptions, userActivity)];
                    case 4:
                        _a.sent();
                        queryOptions.sql = "SELECT activityId,userId,teamId,noOfHours,date,description FROM userActivities WHERE activityId=:activityId";
                        return [4 /*yield*/, conn.query(queryOptions, userActivity)];
                    case 5:
                        activity = _a.sent();
                        if (!(activity && activity.length > 0 && activity[0])) return [3 /*break*/, 8];
                        return [4 /*yield*/, conn.commit()];
                    case 6:
                        _a.sent();
                        return [4 /*yield*/, conn.end()];
                    case 7:
                        _a.sent();
                        return [2 /*return*/, activity[0]];
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
                        e_18 = _a.sent();
                        console.error(e_18);
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
    TeamsServer.prototype.updateUserTeamDetails = function (userTeam) {
        return __awaiter(this, void 0, void 0, function () {
            var conn, queryOptions, activity, e_19;
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
                            sql: "UPDATE userTeams SET userId=:userId, teamId=:teamId, role=:role WHERE userId=:userId and teamId=:teamId"
                        };
                        return [4 /*yield*/, conn.query(queryOptions, userTeam)];
                    case 4:
                        _a.sent();
                        queryOptions.sql = "SELECT userProductId,teamId,userId,role FROM userTeams WHERE teamId=:teamId AND userId=:userId";
                        return [4 /*yield*/, conn.query(queryOptions, userTeam)];
                    case 5:
                        activity = _a.sent();
                        if (!(activity && activity.length > 0 && activity[0])) return [3 /*break*/, 8];
                        return [4 /*yield*/, conn.commit()];
                    case 6:
                        _a.sent();
                        return [4 /*yield*/, conn.end()];
                    case 7:
                        _a.sent();
                        return [2 /*return*/, activity[0]];
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
                        e_19 = _a.sent();
                        console.error(e_19);
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
    TeamsServer.getInstance = function () {
        if (!this.INSTANCE) {
            this.INSTANCE = new TeamsServer();
        }
        return this.INSTANCE;
    };
    return TeamsServer;
}());
exports.TeamsServer = TeamsServer;
var router = express_1.Router();
var teams = TeamsServer.getInstance();
var authFunct = server_3.getAuthorizationFunction();
if (authFunct)
    router.use(authFunct);
// Bypass params dictionary and send authorization Function
router.get("/teams:userId", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var all_teams, all_teams_1, all_teams_1_1, team, e_20;
    var e_21, _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                return [4 /*yield*/, teams.getUserTeams(req.params.userId)];
            case 1:
                all_teams = _b.sent();
                try {
                    for (all_teams_1 = __values(all_teams), all_teams_1_1 = all_teams_1.next(); !all_teams_1_1.done; all_teams_1_1 = all_teams_1.next()) {
                        team = all_teams_1_1.value;
                        team.teamDetails = JSON.parse(team.teamDetails);
                    }
                }
                catch (e_21_1) { e_21 = { error: e_21_1 }; }
                finally {
                    try {
                        if (all_teams_1_1 && !all_teams_1_1.done && (_a = all_teams_1.return)) _a.call(all_teams_1);
                    }
                    finally { if (e_21) throw e_21.error; }
                }
                if (all_teams)
                    res.send(all_teams);
                else
                    res.status(204).send({ err: 204, data: [] });
                return [3 /*break*/, 3];
            case 2:
                e_20 = _b.sent();
                console.error(e_20);
                res.status(500).send({ err: 500, data: [] });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// List all teams
router.get("/mentor/teamsAndProduct/:mentorId", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var allTeams, allTeams_1, allTeams_1_1, team, e_22;
    var e_23, _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                return [4 /*yield*/, teams.getTeamAndProductByMentorId(req.params.mentorId)];
            case 1:
                allTeams = _b.sent();
                try {
                    for (allTeams_1 = __values(allTeams), allTeams_1_1 = allTeams_1.next(); !allTeams_1_1.done; allTeams_1_1 = allTeams_1.next()) {
                        team = allTeams_1_1.value;
                        team.productDetails = JSON.parse(team.productDetails);
                        team.teamDetails = JSON.parse(team.teamDetails);
                    }
                }
                catch (e_23_1) { e_23 = { error: e_23_1 }; }
                finally {
                    try {
                        if (allTeams_1_1 && !allTeams_1_1.done && (_a = allTeams_1.return)) _a.call(allTeams_1);
                    }
                    finally { if (e_23) throw e_23.error; }
                }
                if (allTeams)
                    res.status(200).send(allTeams);
                else
                    res.status(204).send([]);
                return [3 /*break*/, 3];
            case 2:
                e_22 = _b.sent();
                console.error(e_22);
                res.status(500).send({ err: 500, data: [] });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
router.get("/mentor/teams/:mentorId", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var allTeams, allTeams_2, allTeams_2_1, team, e_24;
    var e_25, _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                return [4 /*yield*/, teams.getTeamByMentorId(req.params.mentorId)];
            case 1:
                allTeams = _b.sent();
                try {
                    for (allTeams_2 = __values(allTeams), allTeams_2_1 = allTeams_2.next(); !allTeams_2_1.done; allTeams_2_1 = allTeams_2.next()) {
                        team = allTeams_2_1.value;
                        team.teamDetails = JSON.parse(team.teamDetails);
                    }
                }
                catch (e_25_1) { e_25 = { error: e_25_1 }; }
                finally {
                    try {
                        if (allTeams_2_1 && !allTeams_2_1.done && (_a = allTeams_2.return)) _a.call(allTeams_2);
                    }
                    finally { if (e_25) throw e_25.error; }
                }
                if (allTeams)
                    res.status(200).send(allTeams);
                else
                    res.status(204).send([]);
                return [3 /*break*/, 3];
            case 2:
                e_24 = _b.sent();
                console.error(e_24);
                res.status(500).send({ err: 500, data: [] });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
router.get("/teams/demoDay", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var demoDayTeams, e_26;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, teams.tempF()];
            case 1:
                demoDayTeams = _a.sent();
                if (demoDayTeams)
                    res.status(200).send(demoDayTeams);
                else
                    res.status(204).send([]);
                return [3 /*break*/, 3];
            case 2:
                e_26 = _a.sent();
                console.error(e_26);
                res.status(500).send({ err: 500, data: [] });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
router.get("/team/:teamId", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var team, e_27;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, teams.getTeamById(req.params.teamId)];
            case 1:
                team = _a.sent();
                if (team)
                    res.status(200).send(team);
                else
                    res.status(204).send(null);
                return [3 /*break*/, 3];
            case 2:
                e_27 = _a.sent();
                console.error(e_27);
                res.status(500).send({ err: 500, data: null });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
router.get("/team/users/:teamId", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var users, users_1, users_1_1, user, e_28;
    var e_29, _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                return [4 /*yield*/, teams.getUsersByTeamId(req.params.teamId)];
            case 1:
                users = _b.sent();
                if (users) {
                    try {
                        for (users_1 = __values(users), users_1_1 = users_1.next(); !users_1_1.done; users_1_1 = users_1.next()) {
                            user = users_1_1.value;
                            user.socialMedia = JSON.parse(user.socialMedia);
                            user.userDetails = JSON.parse(user.userDetails);
                        }
                    }
                    catch (e_29_1) { e_29 = { error: e_29_1 }; }
                    finally {
                        try {
                            if (users_1_1 && !users_1_1.done && (_a = users_1.return)) _a.call(users_1);
                        }
                        finally { if (e_29) throw e_29.error; }
                    }
                    res.status(200).send(users);
                }
                else
                    res.status(204).send([]);
                return [3 /*break*/, 3];
            case 2:
                e_28 = _b.sent();
                console.error(e_28);
                res.status(500).send({ err: 500, data: [] });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
router.post("/team/activity", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var userActivities, e_30;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, teams.getUserActivity(req.body.userId, req.body.teamId)];
            case 1:
                userActivities = _a.sent();
                if (userActivities)
                    res.status(200).send(userActivities);
                else
                    res.status(204).send([]);
                return [3 /*break*/, 3];
            case 2:
                e_30 = _a.sent();
                console.error(e_30);
                res.status(500).send({ err: 500, data: [] });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
router.post("/team/activity/update", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var userActivity, e_31;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, teams.updateActivity(req.body)];
            case 1:
                userActivity = _a.sent();
                if (userActivity)
                    res.status(200).send(userActivity);
                else
                    res.status(204).send(null);
                return [3 /*break*/, 3];
            case 2:
                e_31 = _a.sent();
                console.error(e_31);
                res.status(500).send({ err: 500, data: null });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
router.post("/team/remove/users", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var toRemove, teamId, r, toRemove_1, toRemove_1_1, user, e_32_1, e_33;
    var e_32, _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 9, , 10]);
                toRemove = req.body.users;
                teamId = req.body.teamId;
                r = false;
                _b.label = 1;
            case 1:
                _b.trys.push([1, 6, 7, 8]);
                toRemove_1 = __values(toRemove), toRemove_1_1 = toRemove_1.next();
                _b.label = 2;
            case 2:
                if (!!toRemove_1_1.done) return [3 /*break*/, 5];
                user = toRemove_1_1.value;
                if (user && !user.userId)
                    user.userId = user.teamId;
                return [4 /*yield*/, teams.deleteUserFromTeam(user, { teamId: teamId })];
            case 3:
                r = _b.sent();
                if (!r) {
                    return [3 /*break*/, 5];
                }
                _b.label = 4;
            case 4:
                toRemove_1_1 = toRemove_1.next();
                return [3 /*break*/, 2];
            case 5: return [3 /*break*/, 8];
            case 6:
                e_32_1 = _b.sent();
                e_32 = { error: e_32_1 };
                return [3 /*break*/, 8];
            case 7:
                try {
                    if (toRemove_1_1 && !toRemove_1_1.done && (_a = toRemove_1.return)) _a.call(toRemove_1);
                }
                finally { if (e_32) throw e_32.error; }
                return [7 /*endfinally*/];
            case 8:
                if (r)
                    res.status(200).send(true);
                else
                    res.status(204).send(false);
                return [3 /*break*/, 10];
            case 9:
                e_33 = _b.sent();
                console.error(e_33);
                res.status(500).send({ err: 500, data: false });
                return [3 /*break*/, 10];
            case 10: return [2 /*return*/];
        }
    });
}); });
router.post("/team/add/users", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var toAdd, teamId, userTeam, toAdd_1, toAdd_1_1, user, e_34_1, e_35;
    var e_34, _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 9, , 10]);
                toAdd = req.body.users;
                teamId = req.body.teamId;
                userTeam = null;
                _b.label = 1;
            case 1:
                _b.trys.push([1, 6, 7, 8]);
                toAdd_1 = __values(toAdd), toAdd_1_1 = toAdd_1.next();
                _b.label = 2;
            case 2:
                if (!!toAdd_1_1.done) return [3 /*break*/, 5];
                user = toAdd_1_1.value;
                if (user.userId === undefined)
                    user.userId = user.userId;
                return [4 /*yield*/, teams.addUserToTeam(user, { teamId: teamId }, "")];
            case 3:
                userTeam = _b.sent();
                if (userTeam === null) {
                    return [3 /*break*/, 5];
                }
                _b.label = 4;
            case 4:
                toAdd_1_1 = toAdd_1.next();
                return [3 /*break*/, 2];
            case 5: return [3 /*break*/, 8];
            case 6:
                e_34_1 = _b.sent();
                e_34 = { error: e_34_1 };
                return [3 /*break*/, 8];
            case 7:
                try {
                    if (toAdd_1_1 && !toAdd_1_1.done && (_a = toAdd_1.return)) _a.call(toAdd_1);
                }
                finally { if (e_34) throw e_34.error; }
                return [7 /*endfinally*/];
            case 8:
                if (userTeam)
                    res.status(200).send(true);
                else
                    res.status(204).send(false);
                return [3 /*break*/, 10];
            case 9:
                e_35 = _b.sent();
                console.error(e_35);
                res.status(500).send({ err: 500, data: false });
                return [3 /*break*/, 10];
            case 10: return [2 /*return*/];
        }
    });
}); });
router.post("/product", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var newProduct, e_36;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, teams.addTeam(req.body.team, req.body.product)];
            case 1:
                newProduct = _a.sent();
                if (newProduct)
                    res.status(200).send(newProduct);
                else
                    res.status(204).send(null);
                return [3 /*break*/, 3];
            case 2:
                e_36 = _a.sent();
                console.error(e_36);
                res.status(500).send({ err: 500, data: null });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
router.get("/product/:teamId", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var product, e_37;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, teams.getProductByTeamId(req.params.teamId)];
            case 1:
                product = _a.sent();
                if (product) {
                    product.productDetails = JSON.parse(product.productDetails);
                    res.status(200).send(product);
                }
                else
                    res.status(204).send(null);
                return [3 /*break*/, 3];
            case 2:
                e_37 = _a.sent();
                console.error(e_37);
                res.status(500).send({ err: 500, data: null });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
router.post("/product/approve/description", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var product, response, e_38;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 4, , 5]);
                product = req.body;
                if (product.pendingDescriptionEN.trim() == "") {
                    product.pendingDescriptionEN = product.descriptionEN;
                }
                if (product.pendingDescriptionRO.trim() == "") {
                    product.pendingDescriptionRO = product.descriptionRO;
                }
                if (!product) return [3 /*break*/, 2];
                return [4 /*yield*/, teams.approveDescription(product)];
            case 1:
                response = _a.sent();
                if (response)
                    res.status(200).send(response);
                else
                    res.status(204).send(null);
                return [3 /*break*/, 3];
            case 2:
                res.status(204).send(null);
                _a.label = 3;
            case 3: return [3 /*break*/, 5];
            case 4:
                e_38 = _a.sent();
                console.error(e_38);
                res.status(500).send({ err: 500, data: null });
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); });
router.post("/product/update", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var product, teamId, team, newTeam, newProduct, e_39;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 10, , 11]);
                product = req.body.product;
                teamId = req.body.teamId;
                if (!req.body.product) return [3 /*break*/, 8];
                return [4 /*yield*/, teams.getTeamById(teamId)];
            case 1:
                team = _a.sent();
                if (!team) return [3 /*break*/, 6];
                team.teamName = product.startupName;
                return [4 /*yield*/, teams.updateTeam(team)];
            case 2:
                newTeam = _a.sent();
                if (!newTeam) return [3 /*break*/, 4];
                return [4 /*yield*/, teams.updateProduct(product)];
            case 3:
                newProduct = _a.sent();
                if (newProduct)
                    res.status(200).send(newProduct);
                else
                    res.status(204).send(null);
                return [3 /*break*/, 5];
            case 4:
                res.status(204).send(null);
                _a.label = 5;
            case 5: return [3 /*break*/, 7];
            case 6:
                res.status(204).send(null);
                _a.label = 7;
            case 7: return [3 /*break*/, 9];
            case 8:
                res.status(204).send(null);
                _a.label = 9;
            case 9: return [3 /*break*/, 11];
            case 10:
                e_39 = _a.sent();
                console.error(e_39);
                res.status(500).send({ err: 500, data: null });
                return [3 /*break*/, 11];
            case 11: return [2 /*return*/];
        }
    });
}); });
var server = server_1.Server.getInstance();
server.registerRouterAPI(1, router, "/teams");
//# sourceMappingURL=server.js.map