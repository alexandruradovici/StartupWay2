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
exports.getAuthorizationFunction = exports.UsersServer = void 0;
var server_1 = require("@startupway/main/lib/server");
var server_2 = require("@startupway/database/lib/server");
var express_1 = require("express");
var crypto_1 = require("crypto");
var randomstring_1 = require("randomstring");
var tables_1 = require("./tables");
var uuid_1 = require("uuid");
var UsersServer = /** @class */ (function () {
    function UsersServer() {
    }
    UsersServer.passwordGenerator = function (password) {
        var hash = crypto_1.createHash('sha256');
        hash.update(password);
        return hash.digest('hex');
    };
    UsersServer.prototype.addUser = function (user) {
        return __awaiter(this, void 0, void 0, function () {
            var conn, queryOptions, response, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        conn = null;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 12, 15, 16]);
                        return [4 /*yield*/, server_2.getPool().getConnection()];
                    case 2:
                        conn = _a.sent();
                        if (!conn) return [3 /*break*/, 10];
                        return [4 /*yield*/, conn.beginTransaction()];
                    case 3:
                        _a.sent();
                        user.password = UsersServer.passwordGenerator(user.password);
                        queryOptions = {
                            namedPlaceholders: true,
                            sql: "INSERT INTO " + tables_1.TABLE_USERS + " (userId,firstName,lastName,username,password,email,phone,birthDate,avatarUu,socialMedia,userDetails,role,lastLogin) VALUES(:userId,:firstName,:lastName,:username,:password,:email,:phone,:birthDate,:avatarUu,:socialMedia,:userDetails,:role,:lastLogin)"
                        };
                        return [4 /*yield*/, conn.query(queryOptions, user)];
                    case 4:
                        _a.sent();
                        queryOptions.sql = "SELECT userId,firstName,lastName,username,email,phone,birthDate,avatarUu,socialMedia,userDetails,role,lastLogin FROM " + tables_1.TABLE_USERS + " WHERE userId=:userId";
                        return [4 /*yield*/, conn.query(queryOptions, { userId: user.userId })];
                    case 5:
                        response = _a.sent();
                        if (!(response && response.length > 0 && response[0])) return [3 /*break*/, 7];
                        return [4 /*yield*/, conn.commit()];
                    case 6:
                        _a.sent();
                        return [2 /*return*/, response[0]];
                    case 7: return [4 /*yield*/, conn.rollback()];
                    case 8:
                        _a.sent();
                        return [2 /*return*/, null];
                    case 9: return [3 /*break*/, 11];
                    case 10: return [2 /*return*/, null];
                    case 11: return [3 /*break*/, 16];
                    case 12:
                        error_1 = _a.sent();
                        console.error(error_1);
                        if (!conn) return [3 /*break*/, 14];
                        return [4 /*yield*/, conn.rollback()];
                    case 13:
                        _a.sent();
                        _a.label = 14;
                    case 14: return [2 /*return*/, null];
                    case 15:
                        if (conn)
                            conn.release();
                        return [7 /*endfinally*/];
                    case 16: return [2 /*return*/];
                }
            });
        });
    };
    UsersServer.prototype.getAllUserTeams = function () {
        return __awaiter(this, void 0, void 0, function () {
            var conn, queryOptions, allUserTeams, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        conn = null;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 4, 5, 8]);
                        return [4 /*yield*/, server_2.getPool().getConnection()];
                    case 2:
                        conn = _a.sent();
                        queryOptions = {
                            sql: "SELECT users.*, userTeams.teamId, userTeams.role FROM users INNER JOIN userTeams ON user.userId!=:userTeams.userId"
                        };
                        return [4 /*yield*/, conn.query(queryOptions)];
                    case 3:
                        allUserTeams = _a.sent();
                        if (allUserTeams && allUserTeams.length > 0) {
                            return [2 /*return*/, allUserTeams];
                        }
                        else {
                            return [2 /*return*/, []];
                        }
                        return [3 /*break*/, 8];
                    case 4:
                        error_2 = _a.sent();
                        console.error(error_2);
                        return [2 /*return*/, []];
                    case 5:
                        if (!conn) return [3 /*break*/, 7];
                        return [4 /*yield*/, conn.release()];
                    case 6:
                        _a.sent();
                        _a.label = 7;
                    case 7: return [7 /*endfinally*/];
                    case 8: return [2 /*return*/];
                }
            });
        });
    };
    UsersServer.prototype.deleteUser = function (user) {
        return __awaiter(this, void 0, void 0, function () {
            var conn, queryOptions, response, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        conn = null;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 11, 14, 15]);
                        return [4 /*yield*/, server_2.getPool().getConnection()];
                    case 2:
                        conn = _a.sent();
                        if (!conn) return [3 /*break*/, 9];
                        return [4 /*yield*/, conn.beginTransaction()];
                    case 3:
                        _a.sent();
                        queryOptions = {
                            namedPlaceholders: true,
                            sql: "DELETE FROM users WHERE userId=:userId"
                        };
                        return [4 /*yield*/, conn.query(queryOptions, user)];
                    case 4:
                        _a.sent();
                        queryOptions.sql = "SELECT userId as deleted_id FROM users WHERE userId=:userId";
                        return [4 /*yield*/, conn.query(queryOptions, user)];
                    case 5:
                        response = _a.sent();
                        if (!(response && response.length === 0)) return [3 /*break*/, 7];
                        return [4 /*yield*/, conn.commit()];
                    case 6:
                        _a.sent();
                        return [2 /*return*/, true];
                    case 7: return [2 /*return*/, false];
                    case 8: return [3 /*break*/, 10];
                    case 9: return [2 /*return*/, false];
                    case 10: return [3 /*break*/, 15];
                    case 11:
                        error_3 = _a.sent();
                        console.error(error_3);
                        if (!conn) return [3 /*break*/, 13];
                        return [4 /*yield*/, conn.rollback()];
                    case 12:
                        _a.sent();
                        _a.label = 13;
                    case 13: return [2 /*return*/, false];
                    case 14:
                        if (conn)
                            conn.release();
                        return [7 /*endfinally*/];
                    case 15: return [2 /*return*/];
                }
            });
        });
    };
    UsersServer.prototype.createSession = function (username, password) {
        return __awaiter(this, void 0, void 0, function () {
            var conn, queryOptions, resUsername, user, sessionId, userId, token, resSession, error_4, errorSession, e_1, errorSession;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        password = UsersServer.passwordGenerator(password);
                        conn = null;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 19, 20, 21]);
                        return [4 /*yield*/, server_2.getPool().getConnection()];
                    case 2:
                        conn = _a.sent();
                        queryOptions = {
                            namedPlaceholders: true,
                            sql: "SELECT username FROM users WHERE username=:username"
                        };
                        return [4 /*yield*/, conn.query(queryOptions, { username: username })];
                    case 3:
                        resUsername = _a.sent();
                        if (!(resUsername && resUsername.length > 0 && resUsername[0])) return [3 /*break*/, 17];
                        queryOptions = {
                            namedPlaceholders: true,
                            sql: "SELECT * FROM users WHERE username=:username AND password=:password"
                        };
                        return [4 /*yield*/, conn.query(queryOptions, { username: username, password: password })];
                    case 4:
                        user = _a.sent();
                        if (!(user && user.length > 0 && user[0])) return [3 /*break*/, 15];
                        _a.label = 5;
                    case 5:
                        _a.trys.push([5, 11, , 14]);
                        return [4 /*yield*/, conn.beginTransaction()];
                    case 6:
                        _a.sent();
                        sessionId = uuid_1.v4();
                        userId = user[0].userId;
                        token = randomstring_1.generate({ length: 100 });
                        queryOptions = {
                            namedPlaceholders: true,
                            sql: "INSERT INTO sessions (sessionId, userId, token) VALUES(:sessionId,:userId,:token)"
                        };
                        return [4 /*yield*/, conn.query(queryOptions, { sessionId: sessionId, userId: userId, token: token })];
                    case 7:
                        _a.sent();
                        queryOptions.sql = "SELECT sessionId, userId, token FROM sessions WHERE sessionId=:sessionId";
                        return [4 /*yield*/, conn.query(queryOptions, { sessionId: sessionId })];
                    case 8:
                        resSession = _a.sent();
                        if (!(resSession && resSession.length > 0 && resSession[0])) return [3 /*break*/, 10];
                        return [4 /*yield*/, conn.commit()];
                    case 9:
                        _a.sent();
                        return [2 /*return*/, resSession[0]];
                    case 10: return [3 /*break*/, 14];
                    case 11:
                        error_4 = _a.sent();
                        console.error(error_4);
                        errorSession = {
                            sessionId: "",
                            token: "",
                            userId: "",
                            createdAt: new Date(),
                        };
                        errorSession.token = "error";
                        if (!conn) return [3 /*break*/, 13];
                        return [4 /*yield*/, conn.rollback()];
                    case 12:
                        _a.sent();
                        return [2 /*return*/, errorSession];
                    case 13: return [3 /*break*/, 14];
                    case 14: return [3 /*break*/, 16];
                    case 15: return [2 /*return*/, { sessionId: "", token: "cred", userId: "", createdAt: new Date(0) }];
                    case 16: return [3 /*break*/, 18];
                    case 17: return [2 /*return*/, { sessionId: "", token: "cred", userId: "", createdAt: new Date(0) }];
                    case 18: return [3 /*break*/, 21];
                    case 19:
                        e_1 = _a.sent();
                        console.error(e_1);
                        errorSession = {
                            sessionId: "",
                            token: "",
                            userId: "",
                            createdAt: new Date(),
                        };
                        errorSession.token = "error";
                        return [2 /*return*/, errorSession];
                    case 20:
                        if (conn)
                            conn.release();
                        return [7 /*endfinally*/];
                    case 21: return [2 /*return*/, null];
                }
            });
        });
    };
    UsersServer.prototype.modifyUser = function (user, changedPass) {
        return __awaiter(this, void 0, void 0, function () {
            var conn, queryOptions, resp, error_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        conn = null;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 8, 11, 12]);
                        return [4 /*yield*/, server_2.getPool().getConnection()];
                    case 2:
                        conn = _a.sent();
                        if (!conn) return [3 /*break*/, 7];
                        return [4 /*yield*/, conn.beginTransaction()];
                    case 3:
                        _a.sent();
                        queryOptions = {
                            namedPlaceholders: true,
                            sql: "UPDATE users SET firstName=:firstName, lastName=:lastName, username=:username, email=:email, phone=:phone, socialMedia=:socialMedia, birthDate=:birthDate, userDetails=:userDetails, role=:role, avatarUu=:avatarUu, lastLogin=:lastLogin WHERE userId=:userId"
                        };
                        if (changedPass) {
                            user.password = UsersServer.passwordGenerator(user.password);
                            queryOptions.sql = "UPDATE users SET firstName=:firstName, lastName=:lastName, username=:username, password=:password, email=:email, phone=:phone, socialMedia=:socialMedia, birthDate=:birthDate, userDetails=:userDetails, role=:role, avatarUu=:avatarUu, lastLogin=:lastLogin WHERE userId=:userId";
                        }
                        return [4 /*yield*/, conn.query(queryOptions, user)];
                    case 4:
                        _a.sent();
                        queryOptions.sql = "SELECT userId,firstName,lastName,username,email,phone,birthDate,avatarUu,socialMedia,userDetails,role,lastLogin FROM users WHERE userId=:userId";
                        return [4 /*yield*/, conn.query(queryOptions, user)];
                    case 5:
                        resp = _a.sent();
                        if (!(resp && resp.length > 0 && resp[0])) return [3 /*break*/, 7];
                        return [4 /*yield*/, conn.commit()];
                    case 6:
                        _a.sent();
                        return [2 /*return*/, true];
                    case 7: return [3 /*break*/, 12];
                    case 8:
                        error_5 = _a.sent();
                        console.error(error_5);
                        if (!conn) return [3 /*break*/, 10];
                        return [4 /*yield*/, conn.rollback()];
                    case 9:
                        _a.sent();
                        _a.label = 10;
                    case 10: return [2 /*return*/, false];
                    case 11:
                        if (conn)
                            conn.release();
                        return [7 /*endfinally*/];
                    case 12: return [2 /*return*/, false];
                }
            });
        });
    };
    UsersServer.prototype.getUserByUsername = function (username) {
        return __awaiter(this, void 0, void 0, function () {
            var conn, queryOptions, user, error_6;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        conn = null;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 4, 5, 8]);
                        return [4 /*yield*/, server_2.getPool().getConnection()];
                    case 2:
                        conn = _a.sent();
                        queryOptions = {
                            namedPlaceholders: true,
                            sql: "SELECT * FROM users WHERE username=:username"
                        };
                        return [4 /*yield*/, conn.query(queryOptions, { username: username })];
                    case 3:
                        user = _a.sent();
                        if (user && user.length > 0 && user[0]) {
                            if (user[0]) {
                                return [2 /*return*/, user[0]];
                            }
                        }
                        return [3 /*break*/, 8];
                    case 4:
                        error_6 = _a.sent();
                        console.error(error_6);
                        return [3 /*break*/, 8];
                    case 5:
                        if (!conn) return [3 /*break*/, 7];
                        return [4 /*yield*/, conn.release()];
                    case 6:
                        _a.sent();
                        _a.label = 7;
                    case 7: return [7 /*endfinally*/];
                    case 8: return [2 /*return*/, null];
                }
            });
        });
    };
    UsersServer.prototype.getUserByEmail = function (email) {
        return __awaiter(this, void 0, void 0, function () {
            var conn, queryOptions, user, error_7;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        conn = null;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 4, 5, 6]);
                        return [4 /*yield*/, server_2.getPool().getConnection()];
                    case 2:
                        conn = _a.sent();
                        queryOptions = {
                            namedPlaceholders: true,
                            sql: "SELECT * FROM users WHERE email=:email"
                        };
                        return [4 /*yield*/, conn.query(queryOptions, { email: email })];
                    case 3:
                        user = _a.sent();
                        if (user && user.length > 0 && user[0]) {
                            if (user[0]) {
                                return [2 /*return*/, user[0]];
                            }
                        }
                        return [3 /*break*/, 6];
                    case 4:
                        error_7 = _a.sent();
                        console.error(error_7);
                        return [3 /*break*/, 6];
                    case 5:
                        if (conn)
                            conn.release();
                        return [7 /*endfinally*/];
                    case 6: return [2 /*return*/, null];
                }
            });
        });
    };
    UsersServer.prototype.getUserById = function (userId) {
        return __awaiter(this, void 0, void 0, function () {
            var conn, queryOptions, user, error_8;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        conn = null;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 4, 5, 6]);
                        return [4 /*yield*/, server_2.getPool().getConnection()];
                    case 2:
                        conn = _a.sent();
                        queryOptions = {
                            namedPlaceholders: true,
                            sql: "SELECT * FROM users WHERE userId=:userId"
                        };
                        return [4 /*yield*/, conn.query(queryOptions, { userId: userId })];
                    case 3:
                        user = _a.sent();
                        if (user && user.length > 0 && user[0]) {
                            if (user[0]) {
                                return [2 /*return*/, user[0]];
                            }
                        }
                        return [3 /*break*/, 6];
                    case 4:
                        error_8 = _a.sent();
                        console.error(error_8);
                        return [3 /*break*/, 6];
                    case 5:
                        if (conn)
                            conn.release();
                        return [7 /*endfinally*/];
                    case 6: return [2 /*return*/, null];
                }
            });
        });
    };
    UsersServer.prototype.deleteSession = function (token, sessionId) {
        return __awaiter(this, void 0, void 0, function () {
            var conn, queryOptions, values, response, error_9;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        conn = null;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 10, 13, 14]);
                        return [4 /*yield*/, server_2.getPool().getConnection()];
                    case 2:
                        conn = _a.sent();
                        if (!conn) return [3 /*break*/, 8];
                        return [4 /*yield*/, conn.beginTransaction()];
                    case 3:
                        _a.sent();
                        queryOptions = {
                            namedPlaceholders: true,
                            sql: ""
                        };
                        values = {};
                        if (sessionId) {
                            queryOptions.sql = "DELETE FROM sessions WHERE sessions.token=:token AND sessions.sessionId=:sessionId";
                            values = {
                                token: token,
                                sessionId: sessionId
                            };
                        }
                        else {
                            queryOptions.sql = "DELETE FROM sessions WHERE sessions.token=:token";
                            values = {
                                token: token,
                            };
                        }
                        return [4 /*yield*/, conn.query(queryOptions, values)];
                    case 4:
                        _a.sent();
                        queryOptions.sql = "SELECT sessionId as deleted_id FROM sessions WHERE token=:token";
                        return [4 /*yield*/, conn.query(queryOptions, values)];
                    case 5:
                        response = _a.sent();
                        if (!(response && response.length === 0)) return [3 /*break*/, 7];
                        return [4 /*yield*/, conn.commit()];
                    case 6:
                        _a.sent();
                        return [2 /*return*/, true];
                    case 7: return [3 /*break*/, 9];
                    case 8: return [2 /*return*/, false];
                    case 9: return [3 /*break*/, 14];
                    case 10:
                        error_9 = _a.sent();
                        console.error(error_9);
                        if (!conn) return [3 /*break*/, 12];
                        return [4 /*yield*/, conn.rollback()];
                    case 11:
                        _a.sent();
                        _a.label = 12;
                    case 12: return [2 /*return*/, false];
                    case 13:
                        if (conn)
                            conn.release();
                        return [7 /*endfinally*/];
                    case 14: return [2 /*return*/, false];
                }
            });
        });
    };
    UsersServer.prototype.getUserLastSession = function (userId) {
        return __awaiter(this, void 0, void 0, function () {
            var conn, queryOptions, session, error_10;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        conn = null;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 4, 5, 6]);
                        return [4 /*yield*/, server_2.getPool().getConnection()];
                    case 2:
                        conn = _a.sent();
                        queryOptions = {
                            namedPlaceholders: true,
                            sql: "SELECT * FROM session where userId=:userId"
                        };
                        return [4 /*yield*/, conn.query(queryOptions, { userId: userId })];
                    case 3:
                        session = _a.sent();
                        if (session && session.length > 0 && session[0]) {
                            return [2 /*return*/, session[0]];
                        }
                        return [3 /*break*/, 6];
                    case 4:
                        error_10 = _a.sent();
                        console.error(error_10);
                        return [3 /*break*/, 6];
                    case 5:
                        if (conn)
                            conn.release();
                        return [7 /*endfinally*/];
                    case 6: return [2 /*return*/, null];
                }
            });
        });
    };
    UsersServer.prototype.getUsers = function () {
        return __awaiter(this, void 0, void 0, function () {
            var conn, queryOptions, users, users_1, users_1_1, u, error_11;
            var e_2, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        conn = null;
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 4, 5, 6]);
                        return [4 /*yield*/, server_2.getPool().getConnection()];
                    case 2:
                        conn = _b.sent();
                        queryOptions = {
                            sql: "SELECT * FROM users WHERE role!='Mentor' AND role!='Admin'"
                        };
                        return [4 /*yield*/, conn.query(queryOptions)];
                    case 3:
                        users = _b.sent();
                        if (users && users.length > 0) {
                            try {
                                for (users_1 = __values(users), users_1_1 = users_1.next(); !users_1_1.done; users_1_1 = users_1.next()) {
                                    u = users_1_1.value;
                                    if (u.socialMedia)
                                        u.socialMedia = JSON.parse(u.socialMedia);
                                    if (u.userDetails)
                                        u.userDetails = JSON.parse(u.userDetails);
                                }
                            }
                            catch (e_2_1) { e_2 = { error: e_2_1 }; }
                            finally {
                                try {
                                    if (users_1_1 && !users_1_1.done && (_a = users_1.return)) _a.call(users_1);
                                }
                                finally { if (e_2) throw e_2.error; }
                            }
                            return [2 /*return*/, users];
                        }
                        return [3 /*break*/, 6];
                    case 4:
                        error_11 = _b.sent();
                        console.error(error_11);
                        return [3 /*break*/, 6];
                    case 5:
                        if (conn)
                            conn.release();
                        return [7 /*endfinally*/];
                    case 6: return [2 /*return*/, []];
                }
            });
        });
    };
    UsersServer.prototype.getAllUsers = function () {
        return __awaiter(this, void 0, void 0, function () {
            var conn, queryOptions, users, error_12;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        conn = null;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 4, 5, 6]);
                        return [4 /*yield*/, server_2.getPool().getConnection()];
                    case 2:
                        conn = _a.sent();
                        queryOptions = {
                            sql: "SELECT * FROM users"
                        };
                        return [4 /*yield*/, conn.query(queryOptions)];
                    case 3:
                        users = _a.sent();
                        if (users && users.length > 0) {
                            return [2 /*return*/, users];
                        }
                        return [3 /*break*/, 6];
                    case 4:
                        error_12 = _a.sent();
                        console.error(error_12);
                        return [3 /*break*/, 6];
                    case 5:
                        if (conn)
                            conn.release();
                        return [7 /*endfinally*/];
                    case 6: return [2 /*return*/, []];
                }
            });
        });
    };
    UsersServer.prototype.getSessionUser = function (token) {
        return __awaiter(this, void 0, void 0, function () {
            var conn, queryOptions, session, user, error_13;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        conn = null;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 6, 7, 8]);
                        return [4 /*yield*/, server_2.getPool().getConnection()];
                    case 2:
                        conn = _a.sent();
                        queryOptions = {
                            namedPlaceholders: true,
                            sql: "SELECT userId FROM sessions where token=:token"
                        };
                        return [4 /*yield*/, conn.query(queryOptions, { token: token })];
                    case 3:
                        session = _a.sent();
                        if (!(session && session.length > 0 && session[0])) return [3 /*break*/, 5];
                        queryOptions = {
                            namedPlaceholders: true,
                            sql: "SELECT * FROM users WHERE userId=:userId"
                        };
                        return [4 /*yield*/, conn.query(queryOptions, { userId: session[0].userId })];
                    case 4:
                        user = _a.sent();
                        if (user && user.length > 0 && user[0]) {
                            return [2 /*return*/, user[0]];
                        }
                        _a.label = 5;
                    case 5: return [3 /*break*/, 8];
                    case 6:
                        error_13 = _a.sent();
                        console.error(error_13);
                        return [3 /*break*/, 8];
                    case 7:
                        if (conn)
                            conn.release();
                        return [7 /*endfinally*/];
                    case 8: return [2 /*return*/, null];
                }
            });
        });
    };
    UsersServer.getInstance = function () {
        if (!this.INSTANCE) {
            this.INSTANCE = new UsersServer();
        }
        return this.INSTANCE;
    };
    return UsersServer;
}());
exports.UsersServer = UsersServer;
var server = server_1.Server.getInstance();
var usersServer = UsersServer.getInstance();
var router = express_1.Router();
router.use(function (req, res, next) {
    req.user = null;
    req.token = "";
    next();
});
router.post("/login", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var session, user, resp, e_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 5, , 6]);
                return [4 /*yield*/, usersServer.createSession(req.body.username, req.body.password)];
            case 1:
                session = _a.sent();
                return [4 /*yield*/, usersServer.getUserByUsername(req.body.username)];
            case 2:
                user = _a.sent();
                if (!user) return [3 /*break*/, 4];
                user.lastLogin = req.body.lastLogin;
                return [4 /*yield*/, usersServer.modifyUser(user)];
            case 3:
                resp = _a.sent();
                if (resp) {
                    if (session === null) {
                        res.send(null);
                    }
                    else if (session.token === "error") {
                        res.status(500).send({ err: 500, data: null });
                    }
                    else {
                        res.send(session);
                    }
                }
                else {
                    res.send(null);
                }
                _a.label = 4;
            case 4: return [3 /*break*/, 6];
            case 5:
                e_3 = _a.sent();
                console.error(e_3);
                res.status(500).send({ err: 500, data: null });
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); });
router.get("/verify/:email", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var email, user, e_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                email = req.params.email;
                return [4 /*yield*/, usersServer.getUserByEmail(email)];
            case 1:
                user = _a.sent();
                if (user) {
                    res.status(200).send({ accept: "Yes" });
                }
                else {
                    res.status(404).send({ err: 404, data: { accept: "No" } });
                }
                return [3 /*break*/, 3];
            case 2:
                e_4 = _a.sent();
                console.error(e_4);
                res.status(500).send({ err: 500, data: { accept: "No" } });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
var authFunct = getAuthorizationFunction();
if (authFunct)
    router.use(authFunct);
router.get("/user", function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var u;
    return __generator(this, function (_a) {
        if (req.user) {
            u = req.user;
            if (u) {
                u.socialMedia = JSON.parse(u.socialMedia);
                u.userDetails = JSON.parse(u.userDetails);
            }
            res.send(u);
        }
        else {
            res.send(null);
        }
        return [2 /*return*/];
    });
}); });
router.post("/user/update", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var user, changedPass, resp, error_14;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 4, , 5]);
                user = req.body.newUser;
                changedPass = req.body.changedPass;
                console.log("Changed" + changedPass);
                if (!user) return [3 /*break*/, 2];
                return [4 /*yield*/, usersServer.modifyUser(user, changedPass)];
            case 1:
                resp = _a.sent();
                if (resp) {
                    res.status(200).send(resp);
                }
                else {
                    res.status(201).send(false);
                }
                return [3 /*break*/, 3];
            case 2:
                res.status(401).send({ err: 401, data: false });
                _a.label = 3;
            case 3: return [3 /*break*/, 5];
            case 4:
                error_14 = _a.sent();
                console.error(error_14);
                res.status(500).send({ err: 500, data: false });
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); });
router.get("/user/:email", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var email, user;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                email = req.params.email;
                return [4 /*yield*/, usersServer.getUserByEmail(email)];
            case 1:
                user = _a.sent();
                if (user) {
                    res.send(user);
                }
                else {
                    res.status(401).send({ err: 401, data: null });
                }
                return [2 /*return*/];
        }
    });
}); });
router.get("/users", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var usersList, e_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, usersServer.getUsers()];
            case 1:
                usersList = _a.sent();
                if (usersList) {
                    // for(let user of usersList) {
                    // 	console.log(user.socialMedia);
                    // 	console.log(typeof user.socialMedia);
                    // 	if(typeof user.socialMedia === "string") {
                    // 		user.socialMedia = JSON.parse((user.socialMedia as any) as string);
                    // 	}
                    // 	if(typeof user.userDetails === "string") {
                    // 		user.userDetails = JSON.parse((user.userDetails as any) as string);
                    // 	}
                    // }
                    res.status(200).send(usersList);
                }
                else {
                    res.status(204).send([]);
                }
                return [3 /*break*/, 3];
            case 2:
                e_5 = _a.sent();
                console.error(e_5);
                res.status(500).send({ err: 500, data: [] });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
router.get("/users/all", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var usersList, usersList_1, usersList_1_1, user, e_6;
    var e_7, _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                return [4 /*yield*/, usersServer.getAllUsers()];
            case 1:
                usersList = _b.sent();
                if (usersList) {
                    try {
                        for (usersList_1 = __values(usersList), usersList_1_1 = usersList_1.next(); !usersList_1_1.done; usersList_1_1 = usersList_1.next()) {
                            user = usersList_1_1.value;
                            user.socialMedia = JSON.parse(user.socialMedia);
                            user.userDetails = JSON.parse(user.userDetails);
                        }
                    }
                    catch (e_7_1) { e_7 = { error: e_7_1 }; }
                    finally {
                        try {
                            if (usersList_1_1 && !usersList_1_1.done && (_a = usersList_1.return)) _a.call(usersList_1);
                        }
                        finally { if (e_7) throw e_7.error; }
                    }
                    res.status(200).send(usersList);
                }
                else {
                    res.status(204).send([]);
                }
                return [3 /*break*/, 3];
            case 2:
                e_6 = _b.sent();
                console.error(e_6);
                res.status(500).send({ err: 500, data: [] });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
router.post("/logout", function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var respSession, respToken;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!req.body.sessionId) return [3 /*break*/, 2];
                return [4 /*yield*/, usersServer.deleteSession(req.token, req.body.sessionId)];
            case 1:
                respSession = _a.sent();
                if (respSession) {
                    res.status(200).send(respSession);
                }
                else {
                    res.status(201).send(false);
                }
                return [3 /*break*/, 4];
            case 2: return [4 /*yield*/, usersServer.deleteSession(req.token)];
            case 3:
                respToken = _a.sent();
                if (respToken) {
                    res.status(200).send(respToken);
                }
                else {
                    res.status(201).send(false);
                }
                _a.label = 4;
            case 4: return [2 /*return*/];
        }
    });
}); });
router.get("/session/:userId", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var session, e_8;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, usersServer.getUserLastSession(req.params.userId)];
            case 1:
                session = _a.sent();
                if (session) {
                    res.status(200).send(session);
                }
                else {
                    res.status(204).send(null);
                }
                return [3 /*break*/, 3];
            case 2:
                e_8 = _a.sent();
                console.error(e_8);
                res.status(500).send({ err: 500, data: null });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
server.registerRouterAPI(1, router, "/users");
function getAuthorizationFunction() {
    var _this = this;
    try {
        var f = function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
            var authorization, token, user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        authorization = req.header("Authorization");
                        token = null;
                        if (authorization) {
                            token = authorization.split(" ")[1];
                        }
                        if (!(token !== null)) return [3 /*break*/, 2];
                        return [4 /*yield*/, usersServer.getSessionUser(token)];
                    case 1:
                        user = _a.sent();
                        if (user === null)
                            res.status(401).send({ err: 401 });
                        else {
                            req.user = user;
                            req.token = token;
                            next();
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        res.status(401).send({ err: 401 });
                        _a.label = 3;
                    case 3: return [2 /*return*/];
                }
            });
        }); };
        return f;
    }
    catch (error) {
        console.error(error);
        return null;
    }
}
exports.getAuthorizationFunction = getAuthorizationFunction;
;
//# sourceMappingURL=server.js.map