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
exports.getPool = exports.MariaDBServer = void 0;
var mariadb_1 = require("mariadb");
var dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
var tables_1 = require("./tables");
var MariaDBServer = /** @class */ (function () {
    function MariaDBServer() {
        var _this = this;
        this.createDB().then(function (ret) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (ret) {
                    console.log("Database initialized");
                }
                else {
                    console.log("Database not initialized");
                }
                return [2 /*return*/];
            });
        }); }).catch(function (error) {
            console.log("Database was not initialized");
            console.error(error);
        });
    }
    MariaDBServer.prototype.createPoolConn = function () {
        try {
            this.pool = mariadb_1.createPool({
                host: process.env.DB_HOST,
                user: process.env.DB_USER,
                password: process.env.DB_PASS,
                database: process.env.DB_NAME,
                connectionLimit: 10,
                idleTimeout: 0,
                rowsAsArray: false
            });
            return true;
        }
        catch (error) {
            console.error(error);
            return false;
        }
    };
    // private async createConn():Promise<boolean> {
    // 	try {
    // 		if (this.pool !== undefined) {
    // 			this.conn = await this.pool.getConnection();
    // 		}
    // 		return true;
    // 	} catch (error) {
    // 		console.error(error);
    // 		return false;
    // 	}
    // }
    MariaDBServer.prototype.createDB = function () {
        return __awaiter(this, void 0, void 0, function () {
            var auxPool, auxConn, queryOptions, r, tablePool, tableConn, respPool, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 25, , 26]);
                        auxPool = mariadb_1.createPool({
                            host: process.env.DB_HOST,
                            user: process.env.DB_USER,
                            password: process.env.DB_PASS,
                            connectionLimit: 5,
                            rowsAsArray: true
                        });
                        return [4 /*yield*/, auxPool.getConnection()];
                    case 1:
                        auxConn = _a.sent();
                        queryOptions = {
                            namedPlaceholders: true,
                            sql: "SELECT schema_name FROM information_schema.schemata WHERE schema_name = :db"
                        };
                        return [4 /*yield*/, auxConn.query(queryOptions, { db: process.env.DB_NAME })];
                    case 2:
                        r = _a.sent();
                        if (!(r[0] === undefined || r[0].length < 1)) return [3 /*break*/, 21];
                        queryOptions = {
                            namedPlaceholders: true,
                            sql: "CREATE DATABASE " + tables_1.DB_NAME + " CHARACTER SET " + tables_1.DB_CHARSET + " COLLATE " + tables_1.DB_COLLATE
                        };
                        return [4 /*yield*/, auxConn.query(queryOptions)];
                    case 3:
                        _a.sent();
                        tablePool = mariadb_1.createPool({
                            host: process.env.DB_HOST,
                            user: process.env.DB_USER,
                            password: process.env.DB_PASS,
                            database: process.env.DB_NAME,
                            connectionLimit: 5,
                            rowsAsArray: false
                        });
                        return [4 /*yield*/, tablePool.getConnection()];
                    case 4:
                        tableConn = _a.sent();
                        // TODO each package register it's table
                        // users
                        return [4 /*yield*/, tableConn.query("CREATE TABLE `users` (`userId` varchar(100) NOT NULL, `firstName` varchar(50) NOT NULL,`lastName` varchar(50) NOT NULL,`username` varchar(120) NOT NULL,`password` varchar(90) NOT NULL,`email` varchar(100) NOT NULL,`phone` varchar(15) NOT NULL,`birthDate` datetime NOT NULL,`avatarUu` varchar(100) NOT NULL,`socialMedia` text NOT NULL,`userDetails` text NOT NULL,`role` text NOT NULL,`lastLogin` datetime NOT NULL,PRIMARY KEY (`userId`),UNIQUE KEY `username` (`username`),UNIQUE KEY `username_password` (`username`,`password`)) ENGINE=InnoDB")];
                    case 5:
                        // TODO each package register it's table
                        // users
                        _a.sent();
                        // products
                        return [4 /*yield*/, tableConn.query("CREATE TABLE `products` (`productId` varchar(100) NOT NULL, `startupName` varchar(30) NOT NULL,`businessTrack` varchar(60) NOT NULL,`teamType` varchar(30) NOT NULL,`workshopDay` varchar(30) NOT NULL,`mentorId` varchar(100) NOT NULL,`descriptionRO` varchar(600) NOT NULL,`descriptionEN` varchar(600) NOT NULL,`pendingDescriptionRO` varchar(600) NOT NULL,`pendingDescriptionEN` varchar(600) NOT NULL,`userId` varchar(100) DEFAULT NULL,`productDetails` text NOT NULL,`updatedAt` timestamp NOT NULL,`lastMentorUpdate` timestamp NOT NULL,PRIMARY KEY (`productId`),UNIQUE KEY `startupName` (`startupName`),KEY `FK_99d90c2a483d79f3b627fb1d5e9` (`userId`),CONSTRAINT `FK_99d90c2a483d79f3b627fb1d5e9` FOREIGN KEY (`userId`) REFERENCES `users` (`userId`) ON DELETE NO ACTION ON UPDATE NO ACTION) ENGINE=InnoDB")];
                    case 6:
                        // products
                        _a.sent();
                        // teams
                        return [4 /*yield*/, tableConn.query("CREATE TABLE `teams` (`teamId` varchar(100) NOT NULL, `productId` varchar(100) NOT NULL,`year` int(11) NOT NULL,`location` varchar(100) NOT NULL,`teamName` varchar(120) NOT NULL,`teamDetails` text NOT NULL,PRIMARY KEY (`teamId`),UNIQUE KEY `teamName` (`teamName`),UNIQUE KEY `REL_004cf2c4fc89735735b1e77a6d` (`productId`),CONSTRAINT `FK_004cf2c4fc89735735b1e77a6db` FOREIGN KEY (`productId`) REFERENCES `products` (`productId`) ON DELETE NO ACTION ON UPDATE NO ACTION) ENGINE=InnoDB")];
                    case 7:
                        // teams
                        _a.sent();
                        // sessions
                        return [4 /*yield*/, tableConn.query("CREATE TABLE `sessions` (`userId` varchar(100) NOT NULL,`sessionId` varchar(100) NOT NULL, `token` varchar(150) NOT NULL,`createdAt` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),PRIMARY KEY (`sessionId`),KEY `FK_57de40bc620f456c7311aa3a1e6` (`userId`),CONSTRAINT `FK_57de40bc620f456c7311aa3a1e6` FOREIGN KEY (`userId`) REFERENCES `users` (`userId`) ON DELETE NO ACTION ON UPDATE NO ACTION) ENGINE=InnoDB")];
                    case 8:
                        // sessions
                        _a.sent();
                        // userTeams
                        return [4 /*yield*/, tableConn.query("CREATE TABLE `userTeams` (`userProductId` varchar(100) NOT NULL, `userId` varchar(100) NOT NULL,`teamId` varchar(100) NOT NULL,`role` varchar(10) NOT NULL,PRIMARY KEY (`userProductId`),KEY `FK_83be579ba81c5f68b6792c4fe4f` (`userId`),KEY `FK_be4217fd0c329929e298f276f3e` (`teamId`),CONSTRAINT `FK_83be579ba81c5f68b6792c4fe4f` FOREIGN KEY (`userId`) REFERENCES `users` (`userId`) ON DELETE NO ACTION ON UPDATE NO ACTION,CONSTRAINT `FK_be4217fd0c329929e298f276f3e` FOREIGN KEY (`teamId`) REFERENCES `teams` (`teamId`) ON DELETE NO ACTION ON UPDATE NO ACTION) ENGINE=InnoDB")];
                    case 9:
                        // userTeams
                        _a.sent();
                        // userActivities
                        return [4 /*yield*/, tableConn.query("CREATE TABLE `userActivities` (`activityId` varchar(100) NOT NULL, `userId` varchar(100) NOT NULL,`teamId` varchar(100) NOT NULL,`date` datetime NOT NULL,`description` varchar(1000) NOT NULL,`noOfHours` int(11) NOT NULL,PRIMARY KEY (`activityId`),KEY `FK_274a34b4f5e47d9ca5ddeccc922` (`userId`),KEY `FK_ba771a2ce2af5e6cfa9e552b6db` (`teamId`),CONSTRAINT `FK_274a34b4f5e47d9ca5ddeccc922` FOREIGN KEY (`userId`) REFERENCES `users` (`userId`) ON DELETE NO ACTION ON UPDATE NO ACTION,CONSTRAINT `FK_ba771a2ce2af5e6cfa9e552b6db` FOREIGN KEY (`teamId`) REFERENCES `teams` (`teamId`) ON DELETE NO ACTION ON UPDATE NO ACTION) ENGINE=InnoDB")];
                    case 10:
                        // userActivities
                        _a.sent();
                        // bModelCanvas
                        return [4 /*yield*/, tableConn.query("CREATE TABLE `bModelCanvas` (`modelId` varchar(100) NOT NULL, `productId` varchar(100) NOT NULL,`date` datetime NOT NULL,`fields` text NOT NULL,PRIMARY KEY (`modelId`),KEY `FK_9b5ad0d5379a1f0e9165fc40408` (`productId`),CONSTRAINT `FK_9b5ad0d5379a1f0e9165fc40408` FOREIGN KEY (`productId`) REFERENCES `products` (`productId`) ON DELETE NO ACTION ON UPDATE NO ACTION) ENGINE=InnoDB")];
                    case 11:
                        // bModelCanvas
                        _a.sent();
                        // workshops
                        return [4 /*yield*/, tableConn.query("CREATE TABLE `workshops` (`workshopId` varchar(100) NOT NULL, `workshopName` varchar(120) NOT NULL,PRIMARY KEY (`workshopId`),UNIQUE KEY `workshopName` (`workshopName`)) ENGINE=InnoDB ")];
                    case 12:
                        // workshops
                        _a.sent();
                        // workshopInstances
                        return [4 /*yield*/, tableConn.query("CREATE TABLE `workshopInstances` (`workshopInstanceId` varchar(100) NOT NULL, `workshopId` varchar(100) NOT NULL,`teamId` varchar(100) NOT NULL,`trainerName` varchar(100) NOT NULL,`workshopDate` datetime NOT NULL,`workshopDetails` text NOT NULL,PRIMARY KEY (`workshopInstanceId`),UNIQUE KEY `workshopInstanceId` (`workshopInstanceId`),KEY `FK_2e20c0c8114652d2f442cedc6e1` (`workshopId`),KEY `FK_49ca002b40c714b757ae74c323a` (`teamId`),CONSTRAINT `FK_2e20c0c8114652d2f442cedc6e1` FOREIGN KEY (`workshopId`) REFERENCES `workshops` (`workshopId`) ON DELETE NO ACTION ON UPDATE NO ACTION,CONSTRAINT `FK_49ca002b40c714b757ae74c323a` FOREIGN KEY (`teamId`) REFERENCES `teams` (`teamId`) ON DELETE NO ACTION ON UPDATE NO ACTION) ENGINE=InnoDB")];
                    case 13:
                        // workshopInstances
                        _a.sent();
                        // workshopAttendances
                        return [4 /*yield*/, tableConn.query("CREATE TABLE `workshopAttendances` (`attendanceId` varchar(100) NOT NULL, `workshopInstanceId` varchar(100) NOT NULL,`attendanceDate` datetime NOT NULL,`userId` varchar(100) NOT NULL,PRIMARY KEY (`attendanceId`),UNIQUE KEY `attendanceId` (`attendanceId`),KEY `FK_eb9bcf0843c6ac3782a9f2fa4cf` (`workshopInstanceId`),KEY `FK_772b3a178a351d44ea62d230f53` (`userId`),CONSTRAINT `FK_772b3a178a351d44ea62d230f53` FOREIGN KEY (`userId`) REFERENCES `users` (`userId`) ON DELETE NO ACTION ON UPDATE NO ACTION,CONSTRAINT `FK_eb9bcf0843c6ac3782a9f2fa4cf` FOREIGN KEY (`workshopInstanceId`) REFERENCES `workshopInstances` (`workshopInstanceId`) ON DELETE NO ACTION ON UPDATE NO ACTION) ENGINE=InnoDB")];
                    case 14:
                        // workshopAttendances
                        _a.sent();
                        // uploadDownload
                        return [4 /*yield*/, tableConn.query("CREATE TABLE `uploadDownload` (`uuid` varchar(100) NOT NULL,`productId` varchar(100) NOT NULL,`fileType` varchar(255) NOT NULL,`extension` varchar(255) NOT NULL,`uploadTime` datetime NOT NULL,PRIMARY KEY (`uuid`),KEY `FK_0af268615f35d00781c400254ae` (`productId`),CONSTRAINT `FK_0af268615f35d00781c400254ae` FOREIGN KEY (`productId`) REFERENCES `products` (`productId`) ON DELETE NO ACTION ON UPDATE NO ACTION) ENGINE=InnoDB")];
                    case 15:
                        // uploadDownload
                        _a.sent();
                        // recoveries
                        return [4 /*yield*/, tableConn.query("CREATE TABLE `recoveries` (`recoveryId` varchar(100) NOT NULL, `userId` varchar(100) NOT NULL,`email` varchar(100) NOT NULL,`recoveryLink` varchar(100) NOT NULL,PRIMARY KEY (`recoveryId`),UNIQUE KEY `token` (`recoveryLink`),KEY `FK_7902dfcee5a16cb1377e04d3d7a` (`userId`),CONSTRAINT `FK_7902dfcee5a16cb1377e04d3d7a` FOREIGN KEY (`userId`) REFERENCES `users` (`userId`) ON DELETE NO ACTION ON UPDATE NO ACTION) ENGINE=InnoDB")];
                    case 16:
                        // recoveries
                        _a.sent();
                        // feeds
                        return [4 /*yield*/, tableConn.query("CREATE TABLE `feeds` (`feedId` varchar(100) NOT NULL,  `teamId` varchar(100) NOT NULL, `feedType` varchar(30) NOT NULL, `text` text NOT NULL, `date` datetime NOT NULL, PRIMARY KEY (`feedId`), KEY `FK_87caf98485e27800f1e171ccf6c` (`teamId`), CONSTRAINT `FK_87caf98485e27800f1e171ccf6c` FOREIGN KEY (`teamId`) REFERENCES `teams` (`teamId`) ON DELETE NO ACTION ON UPDATE NO ACTION) ENGINE=InnoDB")
                            // notifications
                        ];
                    case 17:
                        // feeds
                        _a.sent();
                        // notifications
                        return [4 /*yield*/, tableConn.query("CREATE TABLE `notifications` (`email` varchar(100) NOT NULL,  `notifyType` varchar(30) NOT NULL, `msgType` varchar(30) NOT NULL, `text` text NOT NULL, `date` datetime NOT NULL, PRIMARY KEY (`email`,`msgType`,`notifyType`) ON DELETE NO ACTION ON UPDATE NO ACTION) ENGINE=InnoDB")];
                    case 18:
                        // notifications
                        _a.sent();
                        return [4 /*yield*/, tableConn.release()];
                    case 19:
                        _a.sent();
                        return [4 /*yield*/, tablePool.end()];
                    case 20:
                        _a.sent();
                        console.log("Database created succsessfuly");
                        _a.label = 21;
                    case 21: return [4 /*yield*/, auxConn.release()];
                    case 22:
                        _a.sent();
                        return [4 /*yield*/, auxPool.end()];
                    case 23:
                        _a.sent();
                        return [4 /*yield*/, this.createPoolConn()];
                    case 24:
                        respPool = _a.sent();
                        if (respPool)
                            return [2 /*return*/, true];
                        else
                            return [2 /*return*/, false];
                        return [3 /*break*/, 26];
                    case 25:
                        error_1 = _a.sent();
                        console.error(error_1);
                        return [2 /*return*/, false];
                    case 26: return [2 /*return*/];
                }
            });
        });
    };
    MariaDBServer.prototype.start = function () {
        return __awaiter(this, void 0, void 0, function () {
            var respPool;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(this.pool === undefined)) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.createPoolConn()];
                    case 1:
                        respPool = _a.sent();
                        if (respPool) {
                            // const respPoolConn = await this.createConn();
                            // if (respPoolConn) {
                            return [2 /*return*/, true];
                            // } else {
                            // 	return false;
                            // }
                        }
                        else {
                            return [2 /*return*/, false];
                        }
                        _a.label = 2;
                    case 2: return [2 /*return*/, false];
                }
            });
        });
    };
    MariaDBServer.getInstance = function () {
        if (!this.INSTANCE) {
            this.INSTANCE = new MariaDBServer();
        }
        return this.INSTANCE;
    };
    return MariaDBServer;
}());
exports.MariaDBServer = MariaDBServer;
function getPool() {
    var dbserver = MariaDBServer.getInstance();
    return dbserver.pool;
}
exports.getPool = getPool;
// const mariadbServer = MariaDBServer.getInstance();
// mariadbServer.createPoolConn();
//# sourceMappingURL=mariadb.js.map