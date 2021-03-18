"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spread = (this && this.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminServer = void 0;
var common_1 = require("../common");
var _ = __importStar(require("lodash"));
var Papa = __importStar(require("papaparse"));
var moment_1 = __importDefault(require("moment"));
var randomstring_1 = __importDefault(require("randomstring"));
var express_1 = require("express");
var server_1 = require("@startupway/main/lib/server");
var server_2 = require("@startupway/database/lib/server");
var server_3 = require("@startupway/users/lib/server");
var server_4 = require("@startupway/daemons/lib/server");
var server_5 = require("@startupway/teams/lib/server");
var uuid_1 = require("uuid");
var users = server_3.UsersServer.getInstance();
var teams = server_5.TeamsServer.getInstance();
var daemon = server_4.DaemonServer.getInstance();
function parseEnum(t, key) {
    return t[key];
}
var AdminServer = /** @class */ (function () {
    function AdminServer() {
        this.users = users;
    }
    /**
     * Internal function that parses a single line from a .CSV file
     * Params are sent via deconstruction an array ...arr
     * @param loc - location
     * @param workshopNo - workshop day
     * @param teamMentor - mentor email
     * @param teamId - teamId for database
     * @param teamTrack - team type
     * @param businessTrack - team business track
     * @param teamName - name of the team
     * @param pitcher - pitcher name
     * @param role - user role in team
     * @param firstName - user firstname
     * @param lastName - user lastname
     * @param email - user email
     * @param phone - user phonenumber
     * @param facebook - user facebook link
     * @param linkedin - user linkedin link
     * @param shortDescRO - team short description RO
     * @param shortDescEN - team short description EN
     * @param birthDate - user birthdate
     * @param faculty - user faculty
     * @param group - user group at faculty
     * @param findProgram - shot description on how the user found the program
     * @returns { teamId:string, workshop:WorkshopObj, team:{}, product:{}, user:{} } parsedCSV | null - contains all the info about the user and it's asociated team and product
     */
    //TODO import parsedCSV type -> toate datele corecte altfel nu importa usersul.
    // Toate id-urile devin string-uri cu uuidv4 dimensiune fixa 16 caractere
    AdminServer.prototype.parseCSVData = function (loc, workshopNo, teamMentor, teamId, teamTrack, businessTrack, teamName, pitcher, role, firstName, lastName, email, phone, facebook, linkedin, shortDescRO, shortDescEN, birthDate, faculty, group, findProgram) {
        try {
            if (teamMentor === undefined || firstName === undefined || lastName === undefined || email === undefined || teamId === undefined)
                return null;
            var parsedCSV = {
                teamId: parseInt(teamId)
            };
            var days = void 0;
            (function (days) {
                days[days["NONE"] = 0] = "NONE";
                days[days["MONDAY"] = 1] = "MONDAY";
                days[days["TUESDAY"] = 2] = "TUESDAY";
                days[days["WEDNESDAY"] = 3] = "WEDNESDAY";
                days[days["THURSDAY"] = 4] = "THURSDAY";
                days[days["FRIDAY"] = 5] = "FRIDAY";
                days[days["SATURDAY"] = 6] = "SATURDAY";
                days[days["SUNDAY"] = 7] = "SUNDAY";
            })(days || (days = {}));
            var productId = uuid_1.v4();
            var insertTeamId = uuid_1.v4();
            if (teamName !== undefined && loc !== undefined && teamMentor !== undefined && pitcher !== undefined) {
                parsedCSV.team = {
                    teamId: insertTeamId,
                    productId: productId,
                    teamName: teamName,
                    location: loc,
                    year: new Date().getFullYear(),
                    teamDetails: {
                        "mentor": teamMentor,
                        "pitcher": pitcher
                    },
                };
            }
            else {
                return null;
            }
            var bT = "";
            if (businessTrack !== undefined) {
                bT = businessTrack.toUpperCase().replace(/\s+/g, '');
            }
            var tT = "";
            if (teamTrack !== undefined) {
                tT = teamTrack.split("-")[0].toUpperCase();
            }
            var wD = "";
            if (workshopNo !== undefined) {
                wD = days[parseInt(workshopNo)];
            }
            var bTValue = parseEnum(server_5.BusinessTrack, bT);
            var tTValue = parseEnum(server_5.TeamType, tT);
            var wDValue = parseEnum(server_5.WorkshopDay, wD);
            var btVal = "";
            var ttVal = "";
            var wdVal = "";
            if (bTValue !== undefined) {
                btVal = bTValue;
            }
            if (tTValue !== undefined) {
                ttVal = tTValue;
            }
            if (wDValue !== undefined) {
                wdVal = wDValue;
            }
            parsedCSV.product = {
                productId: productId,
                startupName: teamName,
                mentorId: "",
                // Need to index enum based on string
                businessTrack: btVal,
                teamType: ttVal,
                workshopDay: wdVal,
                descriptionEN: "",
                descriptionRO: "",
                pendingDescriptionEN: "",
                pendingDescriptionRO: "",
                productDetails: {
                    website: "",
                    linkedin: "",
                    facebook: "",
                    mentorNotes: "",
                    adminNotes: "",
                    assesmentFinals: "",
                    assesmentSemifinals: ""
                },
                updatedAt: new Date(),
                lastMentorUpdate: new Date(),
            };
            if (parsedCSV.product && wDValue) {
                parsedCSV.product.workshopDay = wdVal;
            }
            if (parsedCSV.product && bTValue) {
                parsedCSV.product.businessTrack = btVal;
            }
            if (parsedCSV.product && tTValue) {
                parsedCSV.product.teamType = ttVal;
            }
            if (parsedCSV.product && shortDescRO) {
                parsedCSV.product.descriptionRO = shortDescRO;
            }
            if (parsedCSV.product && shortDescEN) {
                parsedCSV.product.descriptionEN = shortDescEN;
            }
            var username = "";
            if (email !== undefined)
                username = email.split("@")[0].toLowerCase();
            var aux = new Date(); // .toISOString().split('T')[0];
            try {
                if (birthDate !== undefined)
                    aux = new Date(birthDate); // .toISOString().split('T')[0];
            }
            catch (e) {
                console.error(e);
            }
            var userId = uuid_1.v4();
            parsedCSV.user = {
                userId: userId,
                firstName: firstName,
                lastName: lastName,
                username: username,
                password: "",
                email: email,
                phone: phone,
                socialMedia: {
                    "facebook": facebook,
                    "linkedin": linkedin
                },
                birthDate: aux,
                userDetails: {
                    "faculty": faculty,
                    "group": group,
                    "details": "How din you find about Innovation Labs: " + findProgram
                },
                role: role,
                avatarUu: "",
                lastLogin: new Date()
            };
            return parsedCSV;
        }
        catch (error) {
            console.error("Error in function \"_parseCSVData(...array of params)\"|\"admin\" ");
            console.error(error);
            return null;
        }
    };
    AdminServer.prototype.parseUpdateCSV = function (loc, teamName, descRO, descEN) {
        try {
            var updateCSV = null;
            if (loc !== undefined && loc !== "" && teamName !== undefined && teamName !== "") {
                updateCSV = {
                    location: loc,
                    teamName: teamName,
                    descRO: "",
                    descEN: ""
                };
                if (descRO !== undefined) {
                    updateCSV.descRO = descRO;
                }
                if (descEN !== undefined) {
                    updateCSV.descEN = descEN;
                }
                return updateCSV;
            }
            else {
                console.error("No Location or teamName");
                return null;
            }
        }
        catch (error) {
            console.error("Error in function \"parseUpdateCSV()|\"admin\"\"");
            console.error(error);
            return null;
        }
    };
    /**
     * Internal function that creates a random password
     * @returns { string } - the generated password
     */
    AdminServer.prototype.randomPassword = function () {
        return Math.random().toString(36).substring(2, 12) + Math.random().toString(36).substring(2, 10);
    };
    /**
     * Function that generates a recovery token used in password recovery
     * @returns {string} the recovery token
     */
    AdminServer.prototype._randomRecoveryGenerator = function () {
        var string = randomstring_1.default.generate({ length: 100 });
        ;
        return string;
    };
    /**
     * Function that formats a Date object to a readeable string
     * @param date - Date object
     * @returns {string} a readeable date string or ""
     */
    AdminServer.prototype.formatDate = function (date) {
        try {
            var time = (new Date(date)).toTimeString().split(" ");
            if (new Date(date).toString() === "Invalid Date")
                return "";
            else
                return (new Date(date)).toDateString() + " " + time[0];
        }
        catch (error) {
            console.log("Error in function \"formatDate(date: Date)\"|\"admin\"");
            console.error(error);
            return "";
        }
    };
    /**
     * Function that extract information from the database about all teams that have passed 20th may assesment and
     * 		all of their uploaded files.
     * @returns {Promise<any[]>} an array of informations about each team
     */
    AdminServer.prototype.getUDCData = function () {
        return __awaiter(this, void 0, void 0, function () {
            var conn, queryOptions, response, e_1;
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
                            sql: "SELECT IF(JSON_EXTRACT(productDetails,'$.assessment20May') = \"Yes\",\"DA\",\ Echipa,JSON_EXTRACT(t.teamDetails,'$.mentor') as Mentor,IF((SELECT count(*) from uploadDownload ud where ud.productId= p.productId and fileType=\"pres\")>0,\"DA\",\"NU\") as 'Au prezentare pptx incarcata?',IF((SELECT count(*) from uploadDownload ud where ud.productId= p.productId and fileType=\"image\")>0,(SELECT count(*) from uploadDownload ud where ud.productId= p.productId and fileType=\"image\"),0) as 'Au poze la \"Product Images\"?',IF((SELECT count(*) from uploadDownload ud where ud.productId= p.productId and fileType=\"demoVid\")>0,\"DA\",\"NU\") as 'Au \"Tehnic Demo Video\" incarcat?', IF((SELECT count(*) from uploadDownload ud where ud.productId= p.productId and fileType=\"presVid\")>0,\"DA\",\"NU\") as 'Au \"Product Presentation Video\" incarcat?',IF((SELECT count(*) from uploadDownload ud where ud.productId= p.productId and fileType=\"logo\")>0,\"DA\",\"NU\") as 'Au \"Logo\" incarcat?',IF((JSON_EXTRACT(p.productDetails,'$.website')=''),'NU','DA') as 'Au link catre pagina web a produsului?',IF((JSON_EXTRACT(p.productDetails,'$.facebook')=''),'NU','DA') as 'Au link catre pagina de facebook a produsului?',DATE_FORMAT(p.lastMentorUpdate, \"%d %M %Y\") as \"Ultima actualizare a descrierii RO\",DATE_FORMAT(p.lastMentorUpdate, \"%d %M %Y\") as \"Ultima actualizare a descrierii ENG\",CONCAT((SELECT count(*) from (SELECT u.avatarUu, t1.teamId,IF(u.avatarUu!='',\"Yes\",\"No\") as has from users u inner join userTeams uT on u.userId = uT.userId inner join teams t1 on t1.teamId = uT.teamId ) as t2 where t2.teamId = t.teamId and t2.has =\"Yes\" ),'|',(SELECT count(*) from (SELECT u.avatarUu, t1.teamId, IF(u.avatarUu!='',\"Yes\",\"No\") as has from users u inner join userTeams uT on u.userId = uT.userId inner join teams t1 on t1.teamId = uT.teamId ) as t2 where t2.teamId = t.teamId)) as \"Au toti membrii echipei poza incarcata?\", IFNULL(DATE_FORMAT(tab.date, '%d %M %Y'),'') as \"Ultima actualizare a Lean Model Canvas\",DATE_FORMAT(p.updatedAt, \"%d %M %Y\") as \"Ultima actualizare\" from teams t inner join products p on t.productId = p.productId and JSON_EXTRACT(productDetails,'$.assessment20May') = \"Yes\" left join (SELECT date, productId from bModelCanvas group by productId) as tab on p.productId = tab.productId;"
                        };
                        return [4 /*yield*/, conn.query(queryOptions)];
                    case 3:
                        response = _a.sent();
                        if (!(response && response.length > 0)) return [3 /*break*/, 5];
                        return [4 /*yield*/, conn.release()];
                    case 4:
                        _a.sent();
                        return [2 /*return*/, response];
                    case 5: return [4 /*yield*/, conn.release()];
                    case 6:
                        _a.sent();
                        return [2 /*return*/, []];
                    case 7: return [3 /*break*/, 9];
                    case 8: return [2 /*return*/, []];
                    case 9: return [3 /*break*/, 13];
                    case 10:
                        e_1 = _a.sent();
                        console.log("Error in function \"getUDCData()\"|\"admin\"");
                        console.error(e_1);
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
    /**
     * Function that extract information from the database about all teams and their descriptions
     * @returns {Promise<any[]>} an array of informations about each team
     */
    AdminServer.prototype.getTeamData = function () {
        return __awaiter(this, void 0, void 0, function () {
            var conn, queryOptions, response, e_2;
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
                            sql: "SELECT t.location as 'oras', t.teamName as 'nume_echipa', p.businessTrack as 'business_track', p.teamType as 'type', p.descriptionRO as 'descriere_RO', p.descriptionEN as 'descriere_ENG' from teams t inner join products p on p.productId = t.productId and JSON_EXTRACT(productDetails,'$.assessment20May') = 'Yes';"
                        };
                        return [4 /*yield*/, conn.query(queryOptions)];
                    case 3:
                        response = _a.sent();
                        if (!(response && response.length > 0)) return [3 /*break*/, 5];
                        return [4 /*yield*/, conn.release()];
                    case 4:
                        _a.sent();
                        return [2 /*return*/, response];
                    case 5: return [4 /*yield*/, conn.release()];
                    case 6:
                        _a.sent();
                        return [2 /*return*/, []];
                    case 7: return [3 /*break*/, 9];
                    case 8: return [2 /*return*/, []];
                    case 9: return [3 /*break*/, 13];
                    case 10:
                        e_2 = _a.sent();
                        console.log("Error in function \"getTeamData()\"|\"admin\"");
                        console.error(e_2);
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
    /**
     * Function that adds a recovery object containing the information about a users password recovery into the database
     * @param recovery - object that contains information about the incoming recovery of password request
     * @returns {Promise<Recovery>} - a recovery object
     */
    AdminServer.prototype.addRecovery = function (recovery) {
        return __awaiter(this, void 0, void 0, function () {
            var conn, user, queryOptions, newRecovery, msg, notification, newNotification, error_1;
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
                        recovery.recoveryLink = this._randomRecoveryGenerator();
                        return [4 /*yield*/, this.users.getUserByEmail(recovery.email)];
                    case 4:
                        user = _a.sent();
                        if (user)
                            recovery.userId = user.userId;
                        else
                            throw new Error("No such user");
                        queryOptions = {
                            namedPlaceholders: true,
                            sql: "INSERT INTO recoveries (recoveryId,userId,email,recoveryLink) VALUES(:recoveryId,:userId,:email,:recoveryLink)"
                        };
                        return [4 /*yield*/, conn.query(queryOptions, recovery)];
                    case 5:
                        _a.sent();
                        queryOptions.sql = "SELECT recoveryId,userId,email,recoveryLink FROM recoveries WHERE recoveryId=:recoveryId";
                        return [4 /*yield*/, conn.query(queryOptions, { recoveryId: recovery.recoveryId })];
                    case 6:
                        newRecovery = _a.sent();
                        if (!(newRecovery && newRecovery.length > 0 && newRecovery[0])) return [3 /*break*/, 14];
                        msg = "Hello " + user.firstName + " " + user.lastName + " ,\n\n"
                            + "Here is your activation link, please click here to reset your password.\n"
                            + "		https://teams.innovationlabs.ro/#/recovery/" + newRecovery[0].recoveryLink + "\n"
                            + "Regards, Innovation Labs Team\n";
                        notification = {
                            email: user.email,
                            notifyType: common_1.NotificationType.EMAIL,
                            msgType: common_1.MessageType.RESETPASS,
                            text: msg,
                            date: new Date()
                        };
                        return [4 /*yield*/, daemon.addNotification(notification)];
                    case 7:
                        newNotification = _a.sent();
                        if (!newNotification) return [3 /*break*/, 10];
                        return [4 /*yield*/, conn.commit()];
                    case 8:
                        _a.sent();
                        return [4 /*yield*/, conn.release()];
                    case 9:
                        _a.sent();
                        return [3 /*break*/, 13];
                    case 10: return [4 /*yield*/, conn.rollback()];
                    case 11:
                        _a.sent();
                        return [4 /*yield*/, conn.release()];
                    case 12:
                        _a.sent();
                        return [2 /*return*/, null];
                    case 13: return [2 /*return*/, newRecovery[0]];
                    case 14: throw new Error("Can't add recovery");
                    case 15: return [3 /*break*/, 17];
                    case 16: return [2 /*return*/, null];
                    case 17: return [3 /*break*/, 22];
                    case 18:
                        error_1 = _a.sent();
                        console.log("Error in function \"addRecovery(recovery)\"|\"admin\"");
                        console.error(error_1);
                        if (!conn) return [3 /*break*/, 21];
                        return [4 /*yield*/, conn.rollback()];
                    case 19:
                        _a.sent();
                        return [4 /*yield*/, conn.release()];
                    case 20:
                        _a.sent();
                        _a.label = 21;
                    case 21: return [2 /*return*/, null];
                    case 22: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Function that deletes a recovery object from the databse
     * @param recoveryId - unique indentifier to find the specified recovery in the database
     */
    AdminServer.prototype.deleteRecovery = function (recoveryId) {
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
                            sql: "DELETE FROM recoveries WHERE recoveryId=:recoveryId"
                        };
                        return [4 /*yield*/, conn.query(queryOptions, { recoveryId: recoveryId })];
                    case 4:
                        _a.sent();
                        queryOptions.sql = "SELECT recoveryId FROM recoveries WHERE recoveryId=:recoveryId";
                        return [4 /*yield*/, conn.query(queryOptions, { recoveryId: recoveryId })];
                    case 5:
                        response = _a.sent();
                        if (!(response && response.length === 0)) return [3 /*break*/, 8];
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
                        error_2 = _a.sent();
                        console.log("Error in function \"deleteRecovery(recoveryId)\"|\"admin\"");
                        console.error(error_2);
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
    /**
     * Function that finds a recovery object in the database based on it's unique id
     * @param id - unique identifier to find the recovery object in the database
     * @returns {Promise<Recovery>} a recovery object
     */
    AdminServer.prototype.findRecoveryById = function (recoveryId) {
        return __awaiter(this, void 0, void 0, function () {
            var conn, queryOptions, recovery, error_3;
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
                            sql: "SELECT * FROM recoveries WHERE recoveryId=:recoveryId"
                        };
                        return [4 /*yield*/, conn.query(queryOptions, { recoveryId: recoveryId })];
                    case 3:
                        recovery = _a.sent();
                        if (!(recovery && recovery.length > 0 && recovery[0])) return [3 /*break*/, 5];
                        return [4 /*yield*/, conn.release()];
                    case 4:
                        _a.sent();
                        return [2 /*return*/, recovery[0]];
                    case 5: return [4 /*yield*/, conn.release()];
                    case 6:
                        _a.sent();
                        return [2 /*return*/, null];
                    case 7: return [3 /*break*/, 9];
                    case 8: return [2 /*return*/, null];
                    case 9: return [3 /*break*/, 13];
                    case 10:
                        error_3 = _a.sent();
                        console.log("Error in function \"findRecoveryById(id)\"|\"admin\"");
                        console.error(error_3);
                        if (!conn) return [3 /*break*/, 12];
                        return [4 /*yield*/, conn.release()];
                    case 11:
                        _a.sent();
                        _a.label = 12;
                    case 12: return [2 /*return*/, null];
                    case 13: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Function that finds a recovery object in the databse based on it's unique recoveryLink
     * @param recoveryLink - unique recovery link that can be only once in the database
     * @returns {Promise<Recovery>} a recovery object
     */
    AdminServer.prototype.findRecoveryByToken = function (recoveryLink) {
        return __awaiter(this, void 0, void 0, function () {
            var conn, queryOptions, recovery, error_4;
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
                            sql: "SELECT * FROM recoveries WHERE recoveryLink=:recoveryLink"
                        };
                        return [4 /*yield*/, conn.query(queryOptions, { recoveryLink: recoveryLink })];
                    case 3:
                        recovery = _a.sent();
                        if (!(recovery && recovery.length > 0 && recovery[0])) return [3 /*break*/, 5];
                        return [4 /*yield*/, conn.release()];
                    case 4:
                        _a.sent();
                        return [2 /*return*/, recovery[0]];
                    case 5: return [4 /*yield*/, conn.release()];
                    case 6:
                        _a.sent();
                        return [2 /*return*/, null];
                    case 7: return [3 /*break*/, 9];
                    case 8: return [2 /*return*/, null];
                    case 9: return [3 /*break*/, 13];
                    case 10:
                        error_4 = _a.sent();
                        console.log("Error in function \"findRecoveryByToken(recoveryLink)\"|\"admin\"");
                        console.error(error_4);
                        if (!conn) return [3 /*break*/, 12];
                        return [4 /*yield*/, conn.release()];
                    case 11:
                        _a.sent();
                        _a.label = 12;
                    case 12: return [2 /*return*/, null];
                    case 13: return [2 /*return*/];
                }
            });
        });
    };
    AdminServer.getInstance = function () {
        if (!this.INSTANCE) {
            this.INSTANCE = new AdminServer();
        }
        return this.INSTANCE;
    };
    return AdminServer;
}());
exports.AdminServer = AdminServer;
/**
 * Create a public router for the admin plugin
 */
var router = express_1.Router();
var admin = AdminServer.getInstance();
// Bypass params dictionary and send authorization Function
/**
 * Route on which a reset email is created
 */
router.post("/createResetEmail", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var email, aux, recovery, error_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                email = req.body.email;
                aux = {
                    recoveryId: uuid_1.v4(),
                    userId: "",
                    email: email,
                    recoveryLink: "",
                };
                return [4 /*yield*/, admin.addRecovery(aux)];
            case 1:
                recovery = _a.sent();
                if (recovery) {
                    res.send(recovery);
                }
                else {
                    res.status(401).send({ err: 401, data: null });
                }
                res.status(201).send({});
                return [3 /*break*/, 3];
            case 2:
                error_5 = _a.sent();
                console.error("Error on route \"/createResetEmail\" in \"admin\" router");
                console.error(error_5);
                res.status(500).send({ err: 500, data: null });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
/**
 * Route on which the reset of a user's password is being done
 * Can be accessed only by the unique token generated in the email
 *
 */
router.post("/resetPassword", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var token, password, recovery, user, _a, error_6;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                token = req.body.token;
                password = req.body.password;
                _b.label = 1;
            case 1:
                _b.trys.push([1, 10, , 11]);
                return [4 /*yield*/, admin.findRecoveryByToken(token)];
            case 2:
                recovery = _b.sent();
                if (!recovery) return [3 /*break*/, 8];
                return [4 /*yield*/, users.getUserByEmail(recovery.email)];
            case 3:
                user = _b.sent();
                if (!user) return [3 /*break*/, 6];
                _a = user;
                return [4 /*yield*/, server_3.UsersServer.passwordGenerator(password)];
            case 4:
                _a.password = _b.sent();
                return [4 /*yield*/, users.modifyUser(user)];
            case 5:
                _b.sent();
                res.status(200).send({ username: user.username });
                return [3 /*break*/, 7];
            case 6:
                res.status(401).send({ err: 401, data: null });
                _b.label = 7;
            case 7: return [3 /*break*/, 9];
            case 8:
                res.status(401).send({ err: 401, data: null });
                _b.label = 9;
            case 9: return [3 /*break*/, 11];
            case 10:
                error_6 = _b.sent();
                console.error("Error on route \"/resetPassword\" in \"admin\" router");
                console.error(error_6);
                res.status(401).send({ err: 401, data: null });
                return [3 /*break*/, 11];
            case 11: return [2 /*return*/];
        }
    });
}); });
/**
 * Route on which the generated token is beign verified to actually exist
 */
router.post("/checkToken", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var token, recovery, error_7;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                token = req.body.token;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, admin.findRecoveryByToken(token)];
            case 2:
                recovery = _a.sent();
                if (recovery) {
                    res.send({ matched: true });
                }
                else {
                    res.send({ matched: false });
                }
                return [3 /*break*/, 4];
            case 3:
                error_7 = _a.sent();
                console.error("Error on route \"/checkToken\" in \"admin\" router");
                console.error(error_7);
                res.status(401).send({ err: 401, data: null });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
/**
 * Route on which a recovery is deleted based on it's unique token
 */
router.post("/deleteRecovery", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var token, recovery, error_8;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                token = req.body.token;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 6, , 7]);
                return [4 /*yield*/, admin.findRecoveryByToken(token)];
            case 2:
                recovery = _a.sent();
                if (!recovery) return [3 /*break*/, 4];
                return [4 /*yield*/, admin.deleteRecovery(recovery.recoveryId)];
            case 3:
                _a.sent();
                res.status(200).send(true);
                return [3 /*break*/, 5];
            case 4:
                res.status(401).send(false);
                _a.label = 5;
            case 5: return [3 /*break*/, 7];
            case 6:
                error_8 = _a.sent();
                console.error("Error on route \"/deleteRecovery\" in \"admin\" router");
                console.error(error_8);
                res.status(401).send({ err: 401, data: false });
                return [3 /*break*/, 7];
            case 7: return [2 /*return*/];
        }
    });
}); });
/**
 * Create a private router for the admin plugin
 */
var authFunct = server_3.getAuthorizationFunction();
if (authFunct)
    router.use(authFunct);
router.post("/updateDescriptionCSV", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var encoded, buffer, string, parsed, parsed_1, parsed_1_1, arr, object, team, product, e_3_1, error_9;
    var e_3, _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 18, , 19]);
                encoded = req.body.encode;
                buffer = Buffer.from(encoded, "base64");
                string = buffer.toString("utf-8");
                parsed = Papa.parse(string).data;
                parsed.splice(0, 1);
                _b.label = 1;
            case 1:
                _b.trys.push([1, 15, 16, 17]);
                parsed_1 = __values(parsed), parsed_1_1 = parsed_1.next();
                _b.label = 2;
            case 2:
                if (!!parsed_1_1.done) return [3 /*break*/, 14];
                arr = parsed_1_1.value;
                if (!arr) return [3 /*break*/, 12];
                object = admin.parseUpdateCSV.apply(admin, __spread((arr)));
                if (!(object !== null)) return [3 /*break*/, 10];
                return [4 /*yield*/, teams.getTeamByYearAndLocation((new Date()).getFullYear(), object.location, object.teamName)];
            case 3:
                team = _b.sent();
                if (!team) return [3 /*break*/, 8];
                return [4 /*yield*/, teams.getProductByTeamId(team.teamId)];
            case 4:
                product = _b.sent();
                if (!product) return [3 /*break*/, 6];
                if (object.descEN !== "")
                    product.descriptionEN = object.descEN;
                if (object.descRO !== "")
                    product.descriptionRO = object.descRO;
                return [4 /*yield*/, teams.updateProduct(product)];
            case 5:
                _b.sent();
                return [3 /*break*/, 7];
            case 6:
                console.error("\"/updateDescriptionCSV\" : Fetch Product Failed");
                _b.label = 7;
            case 7: return [3 /*break*/, 9];
            case 8:
                console.error("\"/updateDescriptionCSV\" : Fetch Team Failed");
                _b.label = 9;
            case 9: return [3 /*break*/, 11];
            case 10:
                console.error("\"/updateDescriptionCSV\" : Parse Function Failed");
                _b.label = 11;
            case 11: return [3 /*break*/, 13];
            case 12:
                console.error("\"/updateDescriptionCSV\" : Papa Parse Failed");
                _b.label = 13;
            case 13:
                parsed_1_1 = parsed_1.next();
                return [3 /*break*/, 2];
            case 14: return [3 /*break*/, 17];
            case 15:
                e_3_1 = _b.sent();
                e_3 = { error: e_3_1 };
                return [3 /*break*/, 17];
            case 16:
                try {
                    if (parsed_1_1 && !parsed_1_1.done && (_a = parsed_1.return)) _a.call(parsed_1);
                }
                finally { if (e_3) throw e_3.error; }
                return [7 /*endfinally*/];
            case 17:
                res.status(200).send({ err: 200, data: true });
                return [3 /*break*/, 19];
            case 18:
                error_9 = _b.sent();
                console.error("Error on route \"/updateDescriptionCSV\" in \"admin\" router");
                console.error(error_9);
                res.status(401).send({ err: 401, data: false });
                return [3 /*break*/, 19];
            case 19: return [2 /*return*/];
        }
    });
}); });
/**
 * Route on which information found in a .csv file is being uploaded into the database
 */ // TODO SEE RETURN TYPE
router.post("/uploadCSV", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var encoded, buffer, string, parsed, obj, parsed_2, parsed_2_1, arr, object, newObj, _a, _b, _i, key, _c, _d, entry, team, mentorEmail, mentor, mentorUsername, password, user_1, msg, notification, user, password, msg, notification, userTeam, role, teamUser, initDate, i, aux, date, userActivity, response, e_4_1, error_10;
    var e_5, _e, e_4, _f;
    return __generator(this, function (_g) {
        switch (_g.label) {
            case 0:
                _g.trys.push([0, 30, , 31]);
                encoded = req.body.encode;
                buffer = Buffer.from(encoded, "base64");
                string = buffer.toString("utf-8");
                parsed = Papa.parse(string).data;
                parsed.splice(0, 1);
                obj = [];
                try {
                    for (parsed_2 = __values(parsed), parsed_2_1 = parsed_2.next(); !parsed_2_1.done; parsed_2_1 = parsed_2.next()) {
                        arr = parsed_2_1.value;
                        if (arr) {
                            object = admin.parseCSVData.apply(admin, __spread((arr)));
                            if (object !== null)
                                obj.push(object);
                        }
                        // WORKAROUND for parsing the csv data. TODO -> Create interface for parsing
                    }
                }
                catch (e_5_1) { e_5 = { error: e_5_1 }; }
                finally {
                    try {
                        if (parsed_2_1 && !parsed_2_1.done && (_e = parsed_2.return)) _e.call(parsed_2);
                    }
                    finally { if (e_5) throw e_5.error; }
                }
                newObj = _.groupBy(obj, "teamId");
                _a = [];
                for (_b in newObj)
                    _a.push(_b);
                _i = 0;
                _g.label = 1;
            case 1:
                if (!(_i < _a.length)) return [3 /*break*/, 29];
                key = _a[_i];
                _g.label = 2;
            case 2:
                _g.trys.push([2, 26, 27, 28]);
                _c = (e_4 = void 0, __values(newObj[key])), _d = _c.next();
                _g.label = 3;
            case 3:
                if (!!_d.done) return [3 /*break*/, 25];
                entry = _d.value;
                team = null;
                if (!(entry.team && entry.product)) return [3 /*break*/, 11];
                mentorEmail = entry.team.teamDetails["mentor"];
                return [4 /*yield*/, users.getUserByEmail(mentorEmail)];
            case 4:
                mentor = _g.sent();
                mentorUsername = "";
                if (mentorEmail !== undefined) {
                    mentorUsername = mentorEmail.split("@")[0];
                }
                if (!mentor) return [3 /*break*/, 5];
                entry.product.mentorId = mentor.userId;
                return [3 /*break*/, 8];
            case 5:
                if (!(mentorUsername !== "")) return [3 /*break*/, 8];
                password = admin.randomPassword();
                return [4 /*yield*/, users.addUser({
                        // as any -> todo -> discuss if we change to userId: string|null 
                        userId: uuid_1.v4(),
                        firstName: mentorUsername,
                        lastName: "",
                        username: mentorUsername,
                        password: password,
                        email: mentorEmail,
                        phone: "",
                        socialMedia: {},
                        birthDate: new Date(),
                        userDetails: {
                            "location": entry.team.teamDetails["location"]
                        },
                        role: "Mentor",
                        avatarUu: "",
                        lastLogin: new Date()
                    })];
            case 6:
                user_1 = _g.sent();
                if (!user_1) return [3 /*break*/, 8];
                msg = "Hello " + user_1.firstName + " " + user_1.lastName + " ,\n\n"
                    + "Here is your new account, please do not disclose these informations to anyone.\n"
                    + "		Username: " + user_1.username + "\n"
                    + "		Password: " + password + "\n"
                    + "Use these credidentials to login on " + process.env.HOSTNAME + "\n\n"
                    + "Regards, Innovation Labs Team\n";
                notification = {
                    email: user_1.email,
                    notifyType: common_1.NotificationType.EMAIL,
                    msgType: common_1.MessageType.WELCOME,
                    text: msg,
                    date: new Date()
                };
                return [4 /*yield*/, daemon.addNotification(notification)];
            case 7:
                _g.sent();
                entry.product.mentorId = user_1.userId;
                _g.label = 8;
            case 8: return [4 /*yield*/, teams.getTeamByYearAndLocation(entry.team.year, entry.team.location, entry.team.teamName)];
            case 9:
                team = _g.sent();
                if (!(team === null)) return [3 /*break*/, 11];
                return [4 /*yield*/, teams.addTeam(entry.team, entry.product)];
            case 10:
                team = _g.sent();
                _g.label = 11;
            case 11:
                user = null;
                if (!entry.user) return [3 /*break*/, 15];
                return [4 /*yield*/, users.getUserByEmail(entry.user.email)];
            case 12:
                user = _g.sent();
                if (!(user == null)) return [3 /*break*/, 15];
                password = admin.randomPassword();
                entry.user.password = password;
                msg = "Hello " + entry.user.firstName + " " + entry.user.lastName + " ,\n\n"
                    + "Here is your new account, please do not disclose these informations to anyone.\n"
                    + "		Username: " + entry.user.username + "\n"
                    + "		Password: " + password + "\n"
                    + "Use these credidentials to login on " + process.env.HOSTNAME + "\n\n"
                    + "Regards, Innovation Labs Team\n";
                notification = {
                    email: entry.user.email,
                    notifyType: common_1.NotificationType.EMAIL,
                    msgType: common_1.MessageType.WELCOME,
                    text: msg,
                    date: new Date()
                };
                return [4 /*yield*/, daemon.addNotification(notification)];
            case 13:
                _g.sent();
                if (entry.product)
                    entry.product.mentorId = entry.user.userId;
                return [4 /*yield*/, users.addUser(entry.user)];
            case 14:
                user = _g.sent();
                _g.label = 15;
            case 15:
                userTeam = null;
                if (!(user && team)) return [3 /*break*/, 17];
                return [4 /*yield*/, teams.getUserInTeam(user.userId, team.teamId)];
            case 16:
                userTeam = _g.sent();
                _g.label = 17;
            case 17:
                if (!(userTeam === null && user !== null && team !== null)) return [3 /*break*/, 24];
                role = user.role;
                teamUser = null;
                if (!(user && team && role !== undefined && role !== null)) return [3 /*break*/, 19];
                return [4 /*yield*/, teams.addUserToTeam(user, team, role)];
            case 18:
                teamUser = _g.sent();
                _g.label = 19;
            case 19:
                initDate = void 0;
                if (team.teamDetails["location"] === "Bucharest") {
                    initDate = moment_1.default("2021-03-02");
                }
                else {
                    initDate = moment_1.default("2021-03-09");
                }
                i = 0;
                _g.label = 20;
            case 20:
                if (!(i < 10)) return [3 /*break*/, 24];
                aux = moment_1.default(initDate.toDate());
                date = aux.add(7 * i, "days").toDate();
                userActivity = void 0;
                if (!(user !== null && teamUser !== null)) return [3 /*break*/, 22];
                userActivity = {
                    activityId: uuid_1.v4(),
                    userId: user.userId,
                    teamId: teamUser.teamId,
                    noOfHours: 0,
                    date: date,
                    description: ""
                };
                return [4 /*yield*/, teams.addActivityForUser(userActivity)];
            case 21:
                response = _g.sent();
                if (!response) {
                    console.error("Error on route \"/uploadCSV\" in \"admin\" router");
                    console.error("No activity added NO RESPONSE");
                    return [3 /*break*/, 24];
                }
                return [3 /*break*/, 23];
            case 22:
                console.error("Error on route \"/uploadCSV\" in \"admin\" router");
                console.error("No activity added NO TEAM");
                return [3 /*break*/, 24];
            case 23:
                i++;
                return [3 /*break*/, 20];
            case 24:
                _d = _c.next();
                return [3 /*break*/, 3];
            case 25: return [3 /*break*/, 28];
            case 26:
                e_4_1 = _g.sent();
                e_4 = { error: e_4_1 };
                return [3 /*break*/, 28];
            case 27:
                try {
                    if (_d && !_d.done && (_f = _c.return)) _f.call(_c);
                }
                finally { if (e_4) throw e_4.error; }
                return [7 /*endfinally*/];
            case 28:
                _i++;
                return [3 /*break*/, 1];
            case 29:
                res.send(newObj);
                return [3 /*break*/, 31];
            case 30:
                error_10 = _g.sent();
                console.error("Error on route \"/uploadCSV\" in \"admin\" router");
                console.error(error_10);
                res.status(401).send({ err: 401, data: null });
                return [3 /*break*/, 31];
            case 31: return [2 /*return*/];
        }
    });
}); });
/**
 * Route on which a new user activity is added into the database
 */
router.post("/newUserActivity", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var userActivities, userActivities_1, userActivities_1_1, activity, response, e_6_1, error_11;
    var e_6, _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 11, , 12]);
                userActivities = req.body;
                if (!userActivities) return [3 /*break*/, 9];
                _b.label = 1;
            case 1:
                _b.trys.push([1, 6, 7, 8]);
                userActivities_1 = __values(userActivities), userActivities_1_1 = userActivities_1.next();
                _b.label = 2;
            case 2:
                if (!!userActivities_1_1.done) return [3 /*break*/, 5];
                activity = userActivities_1_1.value;
                return [4 /*yield*/, teams.addActivityForUser(activity)];
            case 3:
                response = _b.sent();
                if (!response) {
                    console.error("Error on route \"/newUserActivity\" in \"admin\" router");
                    console.error("No user activity added!");
                    res.status(401).send({ err: 401, data: false });
                }
                _b.label = 4;
            case 4:
                userActivities_1_1 = userActivities_1.next();
                return [3 /*break*/, 2];
            case 5: return [3 /*break*/, 8];
            case 6:
                e_6_1 = _b.sent();
                e_6 = { error: e_6_1 };
                return [3 /*break*/, 8];
            case 7:
                try {
                    if (userActivities_1_1 && !userActivities_1_1.done && (_a = userActivities_1.return)) _a.call(userActivities_1);
                }
                finally { if (e_6) throw e_6.error; }
                return [7 /*endfinally*/];
            case 8: return [3 /*break*/, 10];
            case 9:
                console.error("Error on route \"/newUserActivity\" in \"admin\" router");
                console.error("No user activity sent to be added!");
                res.status(401).send({ err: 401, data: false });
                _b.label = 10;
            case 10: return [3 /*break*/, 12];
            case 11:
                error_11 = _b.sent();
                console.error("Error on route \"/newUserActivity\" in \"admin\" router");
                console.error(error_11);
                res.status(401).send({ err: 401, data: false });
                return [3 /*break*/, 12];
            case 12:
                res.status(200).send(true);
                return [2 /*return*/];
        }
    });
}); });
/**
 * 	Route on which information about users/uploads/teams is sent to be downloaded
 */
router.post("/download/udc/data", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var usersString, array, usersString_1, usersString_1_1, row, csv, error_12;
    var e_7, _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                return [4 /*yield*/, admin.getUDCData()];
            case 1:
                usersString = _b.sent();
                array = [];
                try {
                    for (usersString_1 = __values(usersString), usersString_1_1 = usersString_1.next(); !usersString_1_1.done; usersString_1_1 = usersString_1.next()) {
                        row = usersString_1_1.value;
                        array.push(row);
                    }
                }
                catch (e_7_1) { e_7 = { error: e_7_1 }; }
                finally {
                    try {
                        if (usersString_1_1 && !usersString_1_1.done && (_a = usersString_1.return)) _a.call(usersString_1);
                    }
                    finally { if (e_7) throw e_7.error; }
                }
                csv = Papa.unparse(array);
                if (csv) {
                    res.send(csv);
                }
                else {
                    console.error("Error on route \"/download/udc/data\" in \"admin\" router");
                    console.error("No csv unparsed!");
                    res.status(401).send({ err: 401, data: null });
                }
                return [3 /*break*/, 3];
            case 2:
                error_12 = _b.sent();
                console.error("Error on route \"/download/udc/data\" in \"admin\" router");
                console.error(error_12);
                res.status(401).send({ err: 401, data: null });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
/**
 * 	Route on which information about specific teams is sent to be downloaded
 */
router.post("/download/team/data", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var usersString, array, usersString_2, usersString_2_1, row, csv, error_13;
    var e_8, _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                return [4 /*yield*/, admin.getTeamData()];
            case 1:
                usersString = _b.sent();
                array = [];
                try {
                    for (usersString_2 = __values(usersString), usersString_2_1 = usersString_2.next(); !usersString_2_1.done; usersString_2_1 = usersString_2.next()) {
                        row = usersString_2_1.value;
                        array.push(row);
                    }
                }
                catch (e_8_1) { e_8 = { error: e_8_1 }; }
                finally {
                    try {
                        if (usersString_2_1 && !usersString_2_1.done && (_a = usersString_2.return)) _a.call(usersString_2);
                    }
                    finally { if (e_8) throw e_8.error; }
                }
                csv = Papa.unparse(array);
                if (csv) {
                    res.send(csv);
                }
                else {
                    console.error("Error on route \"/download/team/data\" in \"admin\" router");
                    console.error("No csv unparsed!");
                    res.status(401).send({ err: 401, data: null });
                }
                return [3 /*break*/, 3];
            case 2:
                error_13 = _b.sent();
                console.error("Error on route \"/download/team/data\" in \"admin\" router");
                console.error(error_13);
                res.status(401).send({ err: 401, data: null });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
/**
 * 	Route on which we get all the users from the database based on a specified location
 */
router.get("/users/:location", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var teamsArray, users_1, teamsArray_1, teamsArray_1_1, team, auxUsers, e_9_1, error_14;
    var e_9, _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                teamsArray = [];
                _b.label = 1;
            case 1:
                _b.trys.push([1, 14, , 15]);
                if (!(req.params.location === "all")) return [3 /*break*/, 3];
                return [4 /*yield*/, teams.getTeams()];
            case 2:
                teamsArray = _b.sent();
                return [3 /*break*/, 5];
            case 3: return [4 /*yield*/, teams.getTeamsByLocation(req.params.location)];
            case 4:
                teamsArray = _b.sent();
                _b.label = 5;
            case 5:
                users_1 = [];
                _b.label = 6;
            case 6:
                _b.trys.push([6, 11, 12, 13]);
                teamsArray_1 = __values(teamsArray), teamsArray_1_1 = teamsArray_1.next();
                _b.label = 7;
            case 7:
                if (!!teamsArray_1_1.done) return [3 /*break*/, 10];
                team = teamsArray_1_1.value;
                return [4 /*yield*/, teams.getUsersByTeamId(team.teamId)];
            case 8:
                auxUsers = _b.sent();
                users_1.push.apply(users_1, __spread(auxUsers));
                _b.label = 9;
            case 9:
                teamsArray_1_1 = teamsArray_1.next();
                return [3 /*break*/, 7];
            case 10: return [3 /*break*/, 13];
            case 11:
                e_9_1 = _b.sent();
                e_9 = { error: e_9_1 };
                return [3 /*break*/, 13];
            case 12:
                try {
                    if (teamsArray_1_1 && !teamsArray_1_1.done && (_a = teamsArray_1.return)) _a.call(teamsArray_1);
                }
                finally { if (e_9) throw e_9.error; }
                return [7 /*endfinally*/];
            case 13:
                if (users_1) {
                    res.send(users_1);
                }
                else {
                    console.error("Error on route \"/users/:" + req.params.location + "\" in \"admin\" router");
                    console.error("Error no users!");
                    res.status(401).send({ err: 401, data: [] });
                }
                return [3 /*break*/, 15];
            case 14:
                error_14 = _b.sent();
                console.error("Error on route \"/users/:" + req.params.location + "\" in \"admin\" router");
                console.error(error_14);
                res.status(401).send({ err: 401, data: [] });
                return [3 /*break*/, 15];
            case 15: return [2 /*return*/];
        }
    });
}); });
/**
 * 	Route on which we get all the users from the database
 */
router.get("/users", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var teamsArray, users_3, teamsArray_2, teamsArray_2_1, team, auxUsers, e_10_1, users_2, users_2_1, user, error_15;
    var e_10, _a, e_11, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _c.trys.push([0, 10, , 11]);
                return [4 /*yield*/, teams.getTeams()];
            case 1:
                teamsArray = _c.sent();
                users_3 = [];
                _c.label = 2;
            case 2:
                _c.trys.push([2, 7, 8, 9]);
                teamsArray_2 = __values(teamsArray), teamsArray_2_1 = teamsArray_2.next();
                _c.label = 3;
            case 3:
                if (!!teamsArray_2_1.done) return [3 /*break*/, 6];
                team = teamsArray_2_1.value;
                return [4 /*yield*/, teams.getUsersByTeamId(team.teamId)];
            case 4:
                auxUsers = _c.sent();
                users_3.push.apply(users_3, __spread(auxUsers));
                _c.label = 5;
            case 5:
                teamsArray_2_1 = teamsArray_2.next();
                return [3 /*break*/, 3];
            case 6: return [3 /*break*/, 9];
            case 7:
                e_10_1 = _c.sent();
                e_10 = { error: e_10_1 };
                return [3 /*break*/, 9];
            case 8:
                try {
                    if (teamsArray_2_1 && !teamsArray_2_1.done && (_a = teamsArray_2.return)) _a.call(teamsArray_2);
                }
                finally { if (e_10) throw e_10.error; }
                return [7 /*endfinally*/];
            case 9:
                if (users_3) {
                    try {
                        for (users_2 = __values(users_3), users_2_1 = users_2.next(); !users_2_1.done; users_2_1 = users_2.next()) {
                            user = users_2_1.value;
                            user.socialMedia = JSON.parse(user.socialMedia);
                            user.userDetails = JSON.parse(user.userDetails);
                        }
                    }
                    catch (e_11_1) { e_11 = { error: e_11_1 }; }
                    finally {
                        try {
                            if (users_2_1 && !users_2_1.done && (_b = users_2.return)) _b.call(users_2);
                        }
                        finally { if (e_11) throw e_11.error; }
                    }
                    res.send(users_3);
                }
                else {
                    console.error("Error on route \"/users/\" in \"admin\" router");
                    console.error("Error no users!");
                    res.status(401).send({ err: 401, data: [] });
                }
                return [3 /*break*/, 11];
            case 10:
                error_15 = _c.sent();
                console.error("Error on route \"/users/\" in \"admin\" router");
                console.error(error_15);
                res.status(401).send({ err: 401, data: [] });
                return [3 /*break*/, 11];
            case 11: return [2 /*return*/];
        }
    });
}); });
/**
 * 	Route on which we get all the teams from the database based on a specified location
 */
router.get("/teams/:location", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var teamsArray, teamsArray_3, teamsArray_3_1, team, error_16;
    var e_12, _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 5, , 6]);
                teamsArray = [];
                if (!(req.params.location === "all" || req.params.location === "undefined")) return [3 /*break*/, 2];
                return [4 /*yield*/, teams.getTeams()];
            case 1:
                teamsArray = _b.sent();
                return [3 /*break*/, 4];
            case 2: return [4 /*yield*/, teams.getTeamsByLocation(req.params.location)];
            case 3:
                teamsArray = _b.sent();
                _b.label = 4;
            case 4:
                try {
                    for (teamsArray_3 = __values(teamsArray), teamsArray_3_1 = teamsArray_3.next(); !teamsArray_3_1.done; teamsArray_3_1 = teamsArray_3.next()) {
                        team = teamsArray_3_1.value;
                        team.productDetails = JSON.parse(team.productDetails);
                        team.teamDetails = JSON.parse(team.teamDetails);
                    }
                }
                catch (e_12_1) { e_12 = { error: e_12_1 }; }
                finally {
                    try {
                        if (teamsArray_3_1 && !teamsArray_3_1.done && (_a = teamsArray_3.return)) _a.call(teamsArray_3);
                    }
                    finally { if (e_12) throw e_12.error; }
                }
                if (teamsArray) {
                    res.send(teamsArray);
                }
                else {
                    res.status(401).send({ err: 401, data: [] });
                }
                return [3 /*break*/, 6];
            case 5:
                error_16 = _b.sent();
                console.error("Error on route \"/teams/:" + req.params.location + "\" in \"admin\" router");
                console.error(error_16);
                res.status(401).send({ err: 401, data: [] });
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); });
/**
 * 	Route on which we get all the teams from the database
 */
router.get("/teams", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var teamsArray, error_17;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, teams.getTeams()];
            case 1:
                teamsArray = _a.sent();
                if (teamsArray) {
                    res.send(teamsArray);
                }
                else {
                    res.status(401).send({ err: 401, data: [] });
                }
                return [3 /*break*/, 3];
            case 2:
                error_17 = _a.sent();
                console.error("Error on route \"/teams/\" in \"admin\" router");
                console.error(error_17);
                res.status(401).send({ err: 401, data: [] });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
/**
 * 	Route on which we get all the team reviews based on the type of user requesting them
 */
router.post("/teams/review", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var type, location, teamsArray, reviews, teamsArray_4, teamsArray_4_1, team, mentor, product, review, assesFinals, assesSemifinals, e_13_1, error_18;
    var e_13, _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                type = req.body.type;
                location = req.body.location;
                _b.label = 1;
            case 1:
                _b.trys.push([1, 16, , 17]);
                teamsArray = [];
                if (!(type === "admin")) return [3 /*break*/, 3];
                return [4 /*yield*/, teams.getTeamsByLocation(location)];
            case 2:
                teamsArray = _b.sent();
                return [3 /*break*/, 7];
            case 3:
                if (!(type === "mentor")) return [3 /*break*/, 5];
                return [4 /*yield*/, teams.getTeamAndProductByMentorId(req.body.id)];
            case 4:
                teamsArray = _b.sent();
                return [3 /*break*/, 7];
            case 5:
                if (!(type === "superAdmin")) return [3 /*break*/, 7];
                return [4 /*yield*/, teams.getTeams()];
            case 6:
                teamsArray = _b.sent();
                _b.label = 7;
            case 7:
                reviews = [];
                _b.label = 8;
            case 8:
                _b.trys.push([8, 13, 14, 15]);
                teamsArray_4 = __values(teamsArray), teamsArray_4_1 = teamsArray_4.next();
                _b.label = 9;
            case 9:
                if (!!teamsArray_4_1.done) return [3 /*break*/, 12];
                team = teamsArray_4_1.value;
                return [4 /*yield*/, users.getUserByEmail(JSON.parse(team.teamDetails)["mentor"])];
            case 10:
                mentor = _b.sent();
                product = JSON.parse(team.productDetails);
                review = void 0;
                if (mentor && product) {
                    assesFinals = false;
                    assesSemifinals = false;
                    if (product.assessment20May !== undefined) {
                        assesFinals = product.assessment20May;
                    }
                    if (product.assessment12Oct !== undefined) {
                        assesSemifinals = product.assessment12Oct;
                    }
                    review = {
                        location: team.location,
                        workshopNr: team.workshopDay,
                        mentor: mentor.email,
                        teamTrack: team.teamType,
                        businessTrack: team.businessTrack,
                        startupName: team.startupName,
                        description: team.descriptionEN,
                        webLink: product.website,
                        teamId: team.teamId,
                        mentorNotes: product.mentorNotes,
                        adminNotes: product.adminNotes,
                        assessment20May: assesFinals,
                        assessment12Oct: assesSemifinals,
                        updatedAt: admin.formatDate(team.updatedAt),
                        lastMentorUpdate: admin.formatDate(team.lastMentorUpdate)
                    };
                    reviews.push(review);
                }
                ;
                _b.label = 11;
            case 11:
                teamsArray_4_1 = teamsArray_4.next();
                return [3 /*break*/, 9];
            case 12: return [3 /*break*/, 15];
            case 13:
                e_13_1 = _b.sent();
                e_13 = { error: e_13_1 };
                return [3 /*break*/, 15];
            case 14:
                try {
                    if (teamsArray_4_1 && !teamsArray_4_1.done && (_a = teamsArray_4.return)) _a.call(teamsArray_4);
                }
                finally { if (e_13) throw e_13.error; }
                return [7 /*endfinally*/];
            case 15:
                if (reviews) {
                    reviews.sort(function (a, b) {
                        return a.startupName.localeCompare(b.startupName);
                    });
                    res.send(reviews);
                }
                else {
                    console.error("Error on route \"/teams/review\" in \"admin\" router");
                    console.error("Error, no reviews!");
                    res.status(401).send({ err: 401, data: [] });
                }
                return [3 /*break*/, 17];
            case 16:
                error_18 = _b.sent();
                console.error("Error on route \"/teams/review\" in \"admin\" router");
                console.error(error_18);
                res.status(401).send({ err: 401, data: [] });
                return [3 /*break*/, 17];
            case 17: return [2 /*return*/];
        }
    });
}); });
/**
 * Route on which we request the update of selected reviews
 */
router.post("/teams/review/update", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var revRes, reviews, type, reviews_1, reviews_1_1, review, product, team, newTeam, prodRes, e_14_1, error_19;
    var e_14, _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                revRes = [];
                reviews = req.body.reviews;
                type = req.body.type;
                _b.label = 1;
            case 1:
                _b.trys.push([1, 13, , 14]);
                _b.label = 2;
            case 2:
                _b.trys.push([2, 10, 11, 12]);
                reviews_1 = __values(reviews), reviews_1_1 = reviews_1.next();
                _b.label = 3;
            case 3:
                if (!!reviews_1_1.done) return [3 /*break*/, 9];
                review = reviews_1_1.value;
                return [4 /*yield*/, teams.getProductByTeamId(review.teamId)];
            case 4:
                product = _b.sent();
                return [4 /*yield*/, teams.getTeamById(review.teamId)];
            case 5:
                team = _b.sent();
                if (!(product && team)) return [3 /*break*/, 8];
                if (type && type === "mentor") {
                    product.productDetails["mentorNotes"] = review.mentorNotes;
                }
                else if (type && type === "admin") {
                    product.productDetails["adminNotes"] = review.adminNotes;
                }
                team.location = review.location;
                team.teamName = review.startupName;
                team.teamDetails = JSON.parse(team.teamDetails);
                team.teamDetails["mentor"] = review.mentor;
                return [4 /*yield*/, teams.updateTeam(team)];
            case 6:
                newTeam = _b.sent();
                if (!newTeam) {
                    console.error("Error on route \"/teams/review/update\" in \"admin\" router");
                    console.error("Error, team not updated");
                    res.status(401).send({ err: 401 });
                }
                product.startupName = review.startupName;
                product.teamType = review.teamTrack;
                product.businessTrack = review.businessTrack;
                product.workshopDay = review.workshopNr;
                product.descriptionEN = review.description;
                product.productDetails = JSON.parse(product.productDetails);
                product.productDetails["website"] = review.webLink;
                product.productDetails["assessment20May"] = review.assessment20May;
                product.productDetails["assessment12Oct"] = review.assessment12Oct;
                product.lastMentorUpdate = new Date(review.lastMentorUpdate);
                product.updatedAt = new Date(review.updatedAt);
                return [4 /*yield*/, teams.updateProduct(product)];
            case 7:
                prodRes = _b.sent();
                if (prodRes) {
                    revRes.push(review);
                }
                _b.label = 8;
            case 8:
                reviews_1_1 = reviews_1.next();
                return [3 /*break*/, 3];
            case 9: return [3 /*break*/, 12];
            case 10:
                e_14_1 = _b.sent();
                e_14 = { error: e_14_1 };
                return [3 /*break*/, 12];
            case 11:
                try {
                    if (reviews_1_1 && !reviews_1_1.done && (_a = reviews_1.return)) _a.call(reviews_1);
                }
                finally { if (e_14) throw e_14.error; }
                return [7 /*endfinally*/];
            case 12:
                if (revRes) {
                    res.send(revRes);
                }
                else {
                    console.error("Error on route \"/teams/review/update\" in \"admin\" router");
                    console.error("Error, no reviews updated");
                    res.status(401).send({ err: 401, data: [] });
                }
                return [3 /*break*/, 14];
            case 13:
                error_19 = _b.sent();
                console.error("Error on route \"/teams/review/update\" in \"admin\" router");
                console.error(error_19);
                res.status(401).send({ err: 401, data: [] });
                return [3 /*break*/, 14];
            case 14: return [2 /*return*/];
        }
    });
}); });
/**
 * Route on which we request the change of role for a selected user
 */
router.post("/changeRole", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var user, userTeam, error_20;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                user = req.body.user;
                userTeam = req.body.userTeam;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 8, , 9]);
                if (!user) return [3 /*break*/, 6];
                return [4 /*yield*/, users.modifyUser(user)];
            case 2:
                _a.sent();
                if (!userTeam) return [3 /*break*/, 4];
                return [4 /*yield*/, teams.updateUserTeamDetails(userTeam)];
            case 3:
                _a.sent();
                return [3 /*break*/, 5];
            case 4:
                console.error("Error on route \"/changeRole\" in \"admin\" router");
                console.error("Error, no userteam datatype");
                res.status(204).send(null);
                _a.label = 5;
            case 5: return [3 /*break*/, 7];
            case 6:
                console.error("Error on route \"/changeRole\" in \"admin\" router");
                console.error("Error, no user to change role to");
                res.status(204).send(null);
                _a.label = 7;
            case 7:
                res.status(200).send(userTeam);
                return [3 /*break*/, 9];
            case 8:
                error_20 = _a.sent();
                console.error("Error on route \"/changeRole\" in \"admin\" router");
                console.error(error_20);
                res.status(500).send({ err: 500, data: null });
                return [3 /*break*/, 9];
            case 9: return [2 /*return*/];
        }
    });
}); });
/**
 * Route on which we request to add a new workshop into the database
 */
router.post("/add/workshop", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var workshop;
    return __generator(this, function (_a) {
        workshop = req.body.workshop;
        if (workshop) {
            //TODO
            res.send(workshop);
        }
        else {
            res.status(401).send({ err: 401 });
        }
        res.status(201).send({});
        return [2 /*return*/];
    });
}); });
/**
 * Route on which we request to add new workshop instances in the database
 */
router.post("/add/workshop/Instances", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var instances;
    return __generator(this, function (_a) {
        instances = req.body.instances;
        if (instances) {
            //TODO
            res.send(instances);
        }
        else {
            res.status(401).send({ err: 401 });
        }
        res.status(201).send({});
        return [2 /*return*/];
    });
}); });
/**
 * Route on which we request to add new workshop instances in the database
 */
router.post("/request/user", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var from, email, firstName, lastName, teamId, team, product, mentor, msg, notification;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                from = req.body.from;
                email = req.body.email;
                firstName = req.body.firstName;
                lastName = req.body.lastName;
                teamId = req.body.teamId;
                return [4 /*yield*/, teams.getTeamById(teamId)];
            case 1:
                team = _a.sent();
                return [4 /*yield*/, teams.getProductByTeamId(teamId)];
            case 2:
                product = _a.sent();
                if (!product) return [3 /*break*/, 4];
                return [4 /*yield*/, users.getUserById(product.mentorId)];
            case 3:
                mentor = _a.sent();
                _a.label = 4;
            case 4:
                if (!(mentor && team)) return [3 /*break*/, 6];
                msg = "		From:" + from + "\n"
                    + "		First Name: " + firstName + "\n"
                    + "		Last Name: " + lastName + "\n"
                    + "		Email: " + email + "\n"
                    + "		Team: " + team.teamName + "\n"
                    + "		Location: " + team.location + "\n"
                    + "		Mentor: " + mentor.email + "\n";
                notification = {
                    email: "marius.andrei.aluculesei@gmail.com",
                    notifyType: common_1.NotificationType.EMAIL,
                    msgType: common_1.MessageType.REQUESTUSER,
                    text: msg,
                    date: new Date()
                };
                return [4 /*yield*/, daemon.addNotification(notification)];
            case 5:
                _a.sent();
                res.status(200).send(true);
                return [3 /*break*/, 7];
            case 6:
                res.status(400).send(false);
                _a.label = 7;
            case 7: return [2 /*return*/];
        }
    });
}); });
router.post("/add/user", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var user, option, msg, notification, newUser, teamId, team, userTeam, role, initDate, teamUser, i, aux, date, userActivity, error_21;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 15, , 16]);
                user = req.body.user;
                option = req.body.option;
                user.password = admin.randomPassword();
                msg = "Hello " + user.firstName + " " + user.lastName + " ,\n\n"
                    + "Here is your new account, please do not disclose these informations to anyone.\n"
                    + "		Username: " + user.username + "\n"
                    + "		Password: " + user.password + "\n"
                    + "Use these credidentials to login on " + process.env.HOSTNAME + "\n\n"
                    + "Regards, Innovation Labs Team\n";
                notification = {
                    email: user.email,
                    notifyType: common_1.NotificationType.EMAIL,
                    msgType: common_1.MessageType.WELCOME,
                    text: msg,
                    date: new Date()
                };
                return [4 /*yield*/, daemon.addNotification(notification)];
            case 1:
                _a.sent();
                if (!user) return [3 /*break*/, 13];
                return [4 /*yield*/, users.addUser(user)];
            case 2:
                newUser = _a.sent();
                if (!newUser) return [3 /*break*/, 11];
                if (!(option === "team")) return [3 /*break*/, 10];
                teamId = req.body.teamId;
                return [4 /*yield*/, teams.getTeamById(teamId)];
            case 3:
                team = _a.sent();
                userTeam = void 0;
                if (!team) return [3 /*break*/, 5];
                return [4 /*yield*/, teams.getUserInTeam(newUser.userId, team.teamId)];
            case 4:
                userTeam = _a.sent();
                _a.label = 5;
            case 5:
                if (!userTeam) return [3 /*break*/, 10];
                role = newUser.role;
                if (!team) return [3 /*break*/, 10];
                initDate = void 0;
                return [4 /*yield*/, teams.addUserToTeam(newUser, team, role)];
            case 6:
                teamUser = _a.sent();
                if (!teamUser) return [3 /*break*/, 10];
                if (team.teamDetails["location"] === "Bucharest") {
                    initDate = moment_1.default("2020-03-02");
                }
                else {
                    initDate = moment_1.default("2020-03-09");
                }
                i = 0;
                _a.label = 7;
            case 7:
                if (!(i < 10)) return [3 /*break*/, 10];
                aux = moment_1.default(initDate.toDate());
                date = aux.add(7 * i, "days").toDate();
                userActivity = {
                    userId: newUser.userId,
                    teamId: teamUser.teamId,
                    noOfHours: 0,
                    date: date,
                    description: ""
                };
                return [4 /*yield*/, teams.addActivityForUser(userActivity)];
            case 8:
                _a.sent();
                _a.label = 9;
            case 9:
                i++;
                return [3 /*break*/, 7];
            case 10:
                res.status(200).send(true);
                return [3 /*break*/, 12];
            case 11:
                res.status(401).send({ err: 401, data: false });
                _a.label = 12;
            case 12: return [3 /*break*/, 14];
            case 13:
                res.status(401).send({ err: 401, data: false });
                _a.label = 14;
            case 14:
                res.status(201).send(false);
                return [3 /*break*/, 16];
            case 15:
                error_21 = _a.sent();
                console.error(error_21);
                res.status(500).send({ err: 500, data: false });
                return [3 /*break*/, 16];
            case 16: return [2 /*return*/];
        }
    });
}); });
router.post("/update/user", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var user, changedPass, msg, notification, resp;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                user = req.body.user;
                changedPass = req.body.changedPass;
                if (!changedPass) return [3 /*break*/, 2];
                msg = "Hello " + user.firstName + " " + user.lastName + " ,\n\n"
                    + "Here is your new password, please do not disclose these informations to anyone.\n"
                    + "		Username: " + user.username + "\n"
                    + "		Password: " + user.password + "\n"
                    + "Use these credidentials to login on " + process.env.HOSTNAME + "\n\n"
                    + "Regards, Innovation Labs Team\n";
                notification = {
                    email: user.email,
                    notifyType: common_1.NotificationType.EMAIL,
                    msgType: common_1.MessageType.WELCOME,
                    text: msg,
                    date: new Date()
                };
                return [4 /*yield*/, daemon.addNotification(notification)];
            case 1:
                _a.sent();
                user.password = server_3.UsersServer.passwordGenerator(user.password);
                _a.label = 2;
            case 2:
                if (!user) return [3 /*break*/, 4];
                return [4 /*yield*/, users.modifyUser(user)];
            case 3:
                resp = _a.sent();
                if (resp) {
                    res.status(200).send(true);
                }
                else {
                    res.status(401).send({ err: 401, data: false });
                }
                return [3 /*break*/, 5];
            case 4:
                res.status(401).send({ err: 401, data: false });
                _a.label = 5;
            case 5:
                res.status(201).send(true);
                return [2 /*return*/];
        }
    });
}); });
router.post("/delete/user", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var user;
    return __generator(this, function (_a) {
        user = req.body.user;
        if (user) {
            //TODO
            res.send(true);
        }
        else {
            res.status(401).send({ err: 401, data: false });
        }
        res.status(201).send(true);
        return [2 /*return*/];
    });
}); });
router.post("/request/user/team", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var user, team, userTeam, role, teamUser, initDate, i, aux, date, userActivity;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                user = req.body.user;
                team = req.body.team;
                if (!(user && team)) return [3 /*break*/, 6];
                return [4 /*yield*/, teams.getUserInTeam(user.userId, team.teamId)];
            case 1:
                userTeam = _a.sent();
                if (!userTeam) return [3 /*break*/, 6];
                role = user.role;
                return [4 /*yield*/, teams.addUserToTeam(user, team, role)];
            case 2:
                teamUser = _a.sent();
                if (!teamUser) return [3 /*break*/, 6];
                initDate = void 0;
                if (team.teamDetails["location"] === "Bucharest") {
                    initDate = moment_1.default("2020-03-02");
                }
                else {
                    initDate = moment_1.default("2020-03-09");
                }
                i = 0;
                _a.label = 3;
            case 3:
                if (!(i < 10)) return [3 /*break*/, 6];
                aux = moment_1.default(initDate.toDate());
                date = aux.add(7 * i, "days").toDate();
                userActivity = {
                    userId: user.userId,
                    teamId: teamUser.teamId,
                    noOfHours: 0,
                    date: date,
                    description: ""
                };
                return [4 /*yield*/, teams.addActivityForUser(userActivity)];
            case 4:
                _a.sent();
                _a.label = 5;
            case 5:
                i++;
                return [3 /*break*/, 3];
            case 6: return [2 /*return*/];
        }
    });
}); });
var server = server_1.Server.getInstance();
server.registerRouterAPI(1, router, "/admin");
//# sourceMappingURL=server.js.map