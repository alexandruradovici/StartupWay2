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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DaemonServer = void 0;
var server_1 = require("@startupway/database/lib/server");
var nodemailer_1 = require("nodemailer");
var aws_sdk_1 = __importDefault(require("aws-sdk"));
var DaemonServer = /** @class */ (function () {
    function DaemonServer() {
    }
    /**
     * Function that creates an AWS.SES mail transport used to automatically send emails
     * @returns {Transporter} an AWS.SES transporter
     */
    DaemonServer.prototype.createMailTransporter = function () {
        try {
            aws_sdk_1.default.config.update({
                region: process.env.REGION,
                accessKeyId: process.env.AKEY,
                secretAccessKey: process.env.ASECRETKEY
            });
            var transporter = nodemailer_1.createTransport({
                SES: new aws_sdk_1.default.SES({
                    apiVersion: '2010-12-01'
                }),
                sendingRate: 10
            });
            return transporter;
        }
        catch (error) {
            console.log("Error in function \"createMailTransporter()\"|\"admin\"");
            console.error(error);
            return null;
        }
    };
    /**
     * Function that sends a mail via the AWS.SES transporter
     * @param transporter the AWS.SES transporter object
     * @param mailOptions an instance of type SendMailOptions in which information about where to send the email is found
     * @returns {boolean} true if mail was sent, false otherwise
     */
    DaemonServer.prototype.sendMail = function (transporter, mailOptions) {
        try {
            var response_1 = {};
            // Documented as any
            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    console.log("Error in function \"sendMail(transporter, mailOptions)\"|\"admin\"");
                    console.error(error);
                }
                else {
                    console.log('Email sent to ' + mailOptions.to + ' : ' + info.response);
                    response_1 = info.response;
                }
            });
            if (response_1 !== {})
                return true;
            else
                return false;
        }
        catch (error) {
            console.log("Error in function \"sendMail(transporter, mailOptions)\"|\"admin\"");
            console.error(error);
            return false;
        }
    };
    /**
     * Function that creates an object of type SendMailOptions for the AWS.SES transporter
     * @param from - sending email address
     * @param to - receiving email address
     * @param subject - subject of email
     * @param text - email text
     * @returns {SendMailOptions} - the mail options
     */
    DaemonServer.prototype.createMailOptions = function (from, to, subject, text) {
        var mailOptions = {
            from: from,
            to: to,
            subject: subject,
            text: text
        };
        return mailOptions;
    };
    DaemonServer.prototype.deleteNotification = function (notification) {
        return __awaiter(this, void 0, void 0, function () {
            var conn, queryOptions, deletedNotifies, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        conn = null;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 14, , 18]);
                        return [4 /*yield*/, server_1.getPool().getConnection()];
                    case 2:
                        conn = _a.sent();
                        if (!conn) return [3 /*break*/, 12];
                        return [4 /*yield*/, conn.beginTransaction()];
                    case 3:
                        _a.sent();
                        queryOptions = {
                            namedPlaceholders: true,
                            sql: "DELETE FROM notifications WHERE email=:email AND notifyType=:notifyType AND msgType=:msgType"
                        };
                        return [4 /*yield*/, conn.query(queryOptions, notification)];
                    case 4:
                        _a.sent();
                        queryOptions.sql = "SELECT * FROM notifications WHERE email=:email AND notifyType=:notifyType AND msgType=:msgType";
                        return [4 /*yield*/, conn.query(queryOptions, notification)];
                    case 5:
                        deletedNotifies = _a.sent();
                        if (!(deletedNotifies && deletedNotifies.length === 0)) return [3 /*break*/, 8];
                        return [4 /*yield*/, conn.commit()];
                    case 6:
                        _a.sent();
                        return [4 /*yield*/, conn.release()];
                    case 7:
                        _a.sent();
                        return [2 /*return*/, true];
                    case 8: return [4 /*yield*/, conn.rollback()];
                    case 9:
                        _a.sent();
                        return [4 /*yield*/, conn.release()];
                    case 10:
                        _a.sent();
                        return [2 /*return*/, false];
                    case 11: return [3 /*break*/, 13];
                    case 12: return [2 /*return*/, false];
                    case 13: return [3 /*break*/, 18];
                    case 14:
                        e_1 = _a.sent();
                        console.log("Error in function \"getTeamData()\"|\"admin\"");
                        console.error(e_1);
                        if (!conn) return [3 /*break*/, 17];
                        return [4 /*yield*/, conn.rollback()];
                    case 15:
                        _a.sent();
                        return [4 /*yield*/, conn.release()];
                    case 16:
                        _a.sent();
                        _a.label = 17;
                    case 17: return [2 /*return*/, false];
                    case 18: return [2 /*return*/];
                }
            });
        });
    };
    DaemonServer.prototype.updateNotificationDate = function (notification) {
        return __awaiter(this, void 0, void 0, function () {
            var conn, queryOptions, updatedNotifications, e_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        conn = null;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 14, , 18]);
                        return [4 /*yield*/, server_1.getPool().getConnection()];
                    case 2:
                        conn = _a.sent();
                        if (!conn) return [3 /*break*/, 12];
                        return [4 /*yield*/, conn.beginTransaction()];
                    case 3:
                        _a.sent();
                        queryOptions = {
                            namedPlaceholders: true,
                            sql: "UPDATE notifications SET date=:date WHERE email=:email AND notifyType=:notifyType AND msgType=:msgType"
                        };
                        return [4 /*yield*/, conn.query(queryOptions, notification)];
                    case 4:
                        _a.sent();
                        queryOptions.sql = "SELECT * FROM notifications WHERE email=:email AND notifyType=:notifyType AND msgType=:msgType";
                        return [4 /*yield*/, conn.query(queryOptions, notification)];
                    case 5:
                        updatedNotifications = _a.sent();
                        if (!(updatedNotifications && updatedNotifications.length > 0 && updatedNotifications[0])) return [3 /*break*/, 8];
                        return [4 /*yield*/, conn.commit()];
                    case 6:
                        _a.sent();
                        return [4 /*yield*/, conn.release()];
                    case 7:
                        _a.sent();
                        return [2 /*return*/, true];
                    case 8: return [4 /*yield*/, conn.rollback()];
                    case 9:
                        _a.sent();
                        return [4 /*yield*/, conn.release()];
                    case 10:
                        _a.sent();
                        return [2 /*return*/, false];
                    case 11: return [3 /*break*/, 13];
                    case 12: return [2 /*return*/, false];
                    case 13: return [3 /*break*/, 18];
                    case 14:
                        e_2 = _a.sent();
                        console.log("Error in function \"getTeamData()\"|\"admin\"");
                        console.error(e_2);
                        if (!conn) return [3 /*break*/, 17];
                        return [4 /*yield*/, conn.rollback()];
                    case 15:
                        _a.sent();
                        return [4 /*yield*/, conn.release()];
                    case 16:
                        _a.sent();
                        _a.label = 17;
                    case 17: return [2 /*return*/, false];
                    case 18: return [2 /*return*/];
                }
            });
        });
    };
    DaemonServer.prototype.addNotification = function (notification) {
        return __awaiter(this, void 0, void 0, function () {
            var conn, queryOptions, newNotifies, e_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        conn = null;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 14, , 18]);
                        return [4 /*yield*/, server_1.getPool().getConnection()];
                    case 2:
                        conn = _a.sent();
                        if (!conn) return [3 /*break*/, 12];
                        return [4 /*yield*/, conn.beginTransaction()];
                    case 3:
                        _a.sent();
                        queryOptions = {
                            namedPlaceholders: true,
                            sql: "INSERT INTO notifications values(:email,:notifyType,:msgType,:text,:date)"
                        };
                        return [4 /*yield*/, conn.query(queryOptions, notification)];
                    case 4:
                        _a.sent();
                        queryOptions.sql = "SELECT * FROM notifications WHERE email=:email AND notifyType=:notifyType AND msgType=:msgType";
                        return [4 /*yield*/, conn.query(queryOptions, notification)];
                    case 5:
                        newNotifies = _a.sent();
                        if (!(newNotifies && newNotifies.length > 0 && newNotifies[0])) return [3 /*break*/, 8];
                        return [4 /*yield*/, conn.commit()];
                    case 6:
                        _a.sent();
                        return [4 /*yield*/, conn.release()];
                    case 7:
                        _a.sent();
                        return [2 /*return*/, newNotifies[0]];
                    case 8: return [4 /*yield*/, conn.rollback()];
                    case 9:
                        _a.sent();
                        return [4 /*yield*/, conn.release()];
                    case 10:
                        _a.sent();
                        return [2 /*return*/, null];
                    case 11: return [3 /*break*/, 13];
                    case 12: return [2 /*return*/, null];
                    case 13: return [3 /*break*/, 18];
                    case 14:
                        e_3 = _a.sent();
                        console.log("Error in function \"getTeamData()\"|\"admin\"");
                        console.error(e_3);
                        if (!conn) return [3 /*break*/, 17];
                        return [4 /*yield*/, conn.rollback()];
                    case 15:
                        _a.sent();
                        return [4 /*yield*/, conn.release()];
                    case 16:
                        _a.sent();
                        _a.label = 17;
                    case 17: return [2 /*return*/, null];
                    case 18: return [2 /*return*/];
                }
            });
        });
    };
    DaemonServer.prototype.delay = function (time) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve) {
                        setTimeout(resolve, time);
                    })];
            });
        });
    };
    DaemonServer.getInstance = function () {
        if (!this.INSTANCE) {
            this.INSTANCE = new DaemonServer();
        }
        return this.INSTANCE;
    };
    return DaemonServer;
}());
exports.DaemonServer = DaemonServer;
var daemon = DaemonServer.getInstance();
function emailDaemon() {
    return __awaiter(this, void 0, void 0, function () {
        var conn, queryOptions, notify, notification, deleteResp, from, to, text, subject, mailOptions, transporter, resp, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    conn = null;
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 24, , 28]);
                    return [4 /*yield*/, server_1.getPool().getConnection()];
                case 2:
                    conn = _a.sent();
                    if (!conn) return [3 /*break*/, 22];
                    _a.label = 3;
                case 3:
                    if (!true) return [3 /*break*/, 21];
                    return [4 /*yield*/, conn.beginTransaction()];
                case 4:
                    _a.sent();
                    queryOptions = {
                        namedPlaceholders: true,
                        sql: "SELECT * FROM notifications ORDER BY date ASC LIMIT 0, 1"
                    };
                    return [4 /*yield*/, conn.query(queryOptions)];
                case 5:
                    notify = _a.sent();
                    if (!(notify && notify.length > 0 && notify[0])) return [3 /*break*/, 20];
                    notification = notify[0];
                    return [4 /*yield*/, daemon.deleteNotification(notification)];
                case 6:
                    deleteResp = _a.sent();
                    if (!deleteResp) return [3 /*break*/, 17];
                    if (!(notification.notifyType === "EMAIL")) return [3 /*break*/, 16];
                    from = process.env.MAIL_USER;
                    to = notification.email;
                    text = notification.text;
                    subject = "";
                    switch (notification.msgType) {
                        case "WELCOME":
                            subject = "Welcome to Teams Innovation Labs";
                            break;
                        case "RESETPASS":
                            subject = "Teams Innovation Labs Password Reset";
                            break;
                        case "REQUESTUSER":
                            subject = "Teams Innovation Labs User Request";
                            break;
                        default:
                            break;
                    }
                    if (!(subject !== "")) return [3 /*break*/, 16];
                    mailOptions = daemon.createMailOptions(from, to, subject, text);
                    transporter = daemon.createMailTransporter();
                    if (!(mailOptions !== null && transporter !== null)) return [3 /*break*/, 14];
                    return [4 /*yield*/, daemon.sendMail(transporter, mailOptions)];
                case 7:
                    resp = _a.sent();
                    return [4 /*yield*/, daemon.delay(2000)];
                case 8:
                    _a.sent();
                    if (!resp) return [3 /*break*/, 10];
                    return [4 /*yield*/, conn.commit()];
                case 9:
                    _a.sent();
                    return [3 /*break*/, 3];
                case 10: return [4 /*yield*/, conn.rollback()];
                case 11:
                    _a.sent();
                    notification.date = new Date();
                    return [4 /*yield*/, daemon.updateNotificationDate(notification)];
                case 12:
                    _a.sent();
                    _a.label = 13;
                case 13: return [3 /*break*/, 16];
                case 14:
                    console.error("NO MAIL OPTIONS");
                    return [4 /*yield*/, conn.rollback()];
                case 15:
                    _a.sent();
                    _a.label = 16;
                case 16: return [3 /*break*/, 20];
                case 17: return [4 /*yield*/, conn.rollback()];
                case 18:
                    _a.sent();
                    notification.date = new Date();
                    return [4 /*yield*/, daemon.updateNotificationDate(notification)];
                case 19:
                    _a.sent();
                    _a.label = 20;
                case 20: return [3 /*break*/, 3];
                case 21: return [3 /*break*/, 23];
                case 22:
                    console.error("NO CONN");
                    _a.label = 23;
                case 23: return [3 /*break*/, 28];
                case 24:
                    error_1 = _a.sent();
                    console.error(error_1);
                    if (!conn) return [3 /*break*/, 27];
                    return [4 /*yield*/, conn.rollback()];
                case 25:
                    _a.sent();
                    return [4 /*yield*/, conn.release()];
                case 26:
                    _a.sent();
                    _a.label = 27;
                case 27:
                    console.error("Daemon Failed");
                    return [3 /*break*/, 28];
                case 28: return [2 /*return*/];
            }
        });
    });
}
emailDaemon();
//# sourceMappingURL=server.js.map