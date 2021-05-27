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
exports.UploadDownloadServer = void 0;
// import { Team } from "./server_types";
var express_1 = require("express");
var uuid_1 = require("uuid");
var stream_1 = require("stream");
var aws_sdk_1 = __importDefault(require("aws-sdk"));
var fluent_ffmpeg_1 = __importDefault(require("fluent-ffmpeg"));
var fs_extra_1 = __importDefault(require("fs-extra"));
var path_1 = __importDefault(require("path"));
var jszip_1 = __importDefault(require("jszip"));
var server_1 = require("@startupway/main/lib/server");
var server_2 = require("@startupway/database/lib/server");
var server_3 = require("@startupway/users/lib/server");
var server_4 = require("@startupway/teams/lib/server");
var UploadDownloadServer = /** @class */ (function () {
    function UploadDownloadServer() {
    }
    UploadDownloadServer.prototype.formatDate = function (date) {
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var day = date.getDate();
        return year + "-" + month + "-" + day;
    };
    UploadDownloadServer.prototype.checkZipsDB = function () {
        return __awaiter(this, void 0, void 0, function () {
            var conn, queryOptions, links, links_1, links_1_1, link, e_1;
            var e_2, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        conn = null;
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 6, 7, 8]);
                        return [4 /*yield*/, server_2.getPool().getConnection()];
                    case 2:
                        conn = _b.sent();
                        if (!conn) return [3 /*break*/, 4];
                        queryOptions = {
                            sql: "SELECT uploadDownload.* FROM uploadDownload where uploadDownload.productId=:productId"
                        };
                        return [4 /*yield*/, conn.query(queryOptions, { productId: "7051998" })];
                    case 3:
                        links = _b.sent();
                        if (links.length > 0) {
                            try {
                                for (links_1 = __values(links), links_1_1 = links_1.next(); !links_1_1.done; links_1_1 = links_1.next()) {
                                    link = links_1_1.value;
                                    if (link.uuid !== '') {
                                        if (UploadDownloadServer.zips[link.uuid] === undefined) {
                                            UploadDownloadServer.zips[link.uuid] = null;
                                        }
                                    }
                                }
                            }
                            catch (e_2_1) { e_2 = { error: e_2_1 }; }
                            finally {
                                try {
                                    if (links_1_1 && !links_1_1.done && (_a = links_1.return)) _a.call(links_1);
                                }
                                finally { if (e_2) throw e_2.error; }
                            }
                        }
                        return [2 /*return*/, true];
                    case 4: return [2 /*return*/, false];
                    case 5: return [3 /*break*/, 8];
                    case 6:
                        e_1 = _b.sent();
                        console.error(e_1);
                        return [2 /*return*/, false];
                    case 7:
                        if (conn)
                            conn.release();
                        return [7 /*endfinally*/];
                    case 8: return [2 /*return*/];
                }
            });
        });
    };
    UploadDownloadServer.prototype.addLink = function (uploadDownloadLink) {
        return __awaiter(this, void 0, void 0, function () {
            var conn, uuid, queryOptions, response, e_3;
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
                        if (uploadDownloadLink.uuid === "") {
                            uuid = uuid_1.v4();
                            uploadDownloadLink.uuid = uuid;
                        }
                        queryOptions = {
                            namedPlaceholders: true,
                            sql: "INSERT INTO uploadDownload (uuid,productId,fileType,extension,uploadTime) values(:uuid,:productId,:fileType,:extension,:uploadTime)"
                        };
                        return [4 /*yield*/, conn.query(queryOptions, uploadDownloadLink)];
                    case 4:
                        _a.sent();
                        queryOptions.sql = "SELECT uuid,productId,fileType,extension,uploadTime FROM uploadDownload WHERE uuid=:uuid";
                        return [4 /*yield*/, conn.query(queryOptions, { uuid: uploadDownloadLink.uuid })];
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
                        e_3 = _a.sent();
                        console.error(e_3);
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
    UploadDownloadServer.prototype.deleteLink = function (uuid) {
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
                        queryOptions = {
                            namedPlaceholders: true,
                            sql: "DELETE FROM uploadDownload where uuid=:uuid"
                        };
                        return [4 /*yield*/, conn.query(queryOptions, { uuid: uuid })];
                    case 4:
                        _a.sent();
                        queryOptions.sql = "SELECT uuid as deleted_id FROM uploadDownload WHERE uuid=:uuid";
                        return [4 /*yield*/, conn.query(queryOptions, { uuid: uuid })];
                    case 5:
                        response = _a.sent();
                        if (!(response && response.length === 0)) return [3 /*break*/, 7];
                        return [4 /*yield*/, conn.commit()];
                    case 6:
                        _a.sent();
                        return [2 /*return*/, true];
                    case 7: return [4 /*yield*/, conn.rollback()];
                    case 8:
                        _a.sent();
                        return [2 /*return*/, false];
                    case 9: return [3 /*break*/, 11];
                    case 10: return [2 /*return*/, false];
                    case 11: return [3 /*break*/, 16];
                    case 12:
                        error_1 = _a.sent();
                        console.error(error_1);
                        if (!conn) return [3 /*break*/, 14];
                        return [4 /*yield*/, conn.rollback()];
                    case 13:
                        _a.sent();
                        _a.label = 14;
                    case 14: return [2 /*return*/, false];
                    case 15:
                        if (conn)
                            conn.release();
                        return [7 /*endfinally*/];
                    case 16: return [2 /*return*/];
                }
            });
        });
    };
    UploadDownloadServer.prototype.getLinkByUuid = function (uuid) {
        return __awaiter(this, void 0, void 0, function () {
            var conn, queryOptions, uploadDownloadLink, error_2;
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
                        if (!conn) return [3 /*break*/, 4];
                        queryOptions = {
                            namedPlaceholders: true,
                            sql: "SELECT * FROM uploadDownload WHERE uuid=:uuid"
                        };
                        return [4 /*yield*/, conn.query(queryOptions, { uuid: uuid })];
                    case 3:
                        uploadDownloadLink = _a.sent();
                        if (uploadDownloadLink && uploadDownloadLink.length > 0 && uploadDownloadLink[0]) {
                            return [2 /*return*/, uploadDownloadLink[0]];
                        }
                        else {
                            return [2 /*return*/, null];
                        }
                        return [3 /*break*/, 5];
                    case 4: return [2 /*return*/, null];
                    case 5: return [3 /*break*/, 8];
                    case 6:
                        error_2 = _a.sent();
                        console.error(error_2);
                        return [2 /*return*/, null];
                    case 7:
                        if (conn)
                            conn.release();
                        return [7 /*endfinally*/];
                    case 8: return [2 /*return*/];
                }
            });
        });
    };
    UploadDownloadServer.prototype.getLinksByProductIdAndFileType = function (productId, fileType) {
        return __awaiter(this, void 0, void 0, function () {
            var conn, queryOptions, uploadDownloadLinks, error_3;
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
                        if (!conn) return [3 /*break*/, 4];
                        queryOptions = {
                            namedPlaceholders: true,
                            sql: "SELECT * FROM uploadDownload WHERE productId=:productId AND fileType=:fileType"
                        };
                        return [4 /*yield*/, conn.query(queryOptions, { productId: productId, fileType: fileType })];
                    case 3:
                        uploadDownloadLinks = _a.sent();
                        if (uploadDownloadLinks && uploadDownloadLinks.length > 0) {
                            return [2 /*return*/, uploadDownloadLinks];
                        }
                        else {
                            return [2 /*return*/, []];
                        }
                        return [3 /*break*/, 5];
                    case 4: return [2 /*return*/, []];
                    case 5: return [3 /*break*/, 8];
                    case 6:
                        error_3 = _a.sent();
                        console.error(error_3);
                        return [2 /*return*/, []];
                    case 7:
                        if (conn)
                            conn.release();
                        return [7 /*endfinally*/];
                    case 8: return [2 /*return*/];
                }
            });
        });
    };
    UploadDownloadServer.prototype.getLinksByProductId = function (productId, date) {
        return __awaiter(this, void 0, void 0, function () {
            var conn, queryOptions, links, e_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        conn = null;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 11, 12, 13]);
                        return [4 /*yield*/, server_2.getPool().getConnection()];
                    case 2:
                        conn = _a.sent();
                        if (!conn) return [3 /*break*/, 9];
                        queryOptions = {
                            namedPlaceholders: true,
                            sql: ""
                        };
                        links = [];
                        if (!(date === "none")) return [3 /*break*/, 4];
                        queryOptions.sql = "SELECT * FROM uploadDownload WHERE productId=:productId";
                        return [4 /*yield*/, conn.query(queryOptions, { productId: productId })];
                    case 3:
                        links = _a.sent();
                        return [3 /*break*/, 8];
                    case 4:
                        if (!(date === "may")) return [3 /*break*/, 6];
                        // queryOptions.nestTables="_";
                        queryOptions.sql = "SELECT uploadDownload.* products.* FROM uploadDownload INNER JOIN products ON products.productId = uploadDownload.productId AND JSON_EXTRACT(productDetails,'$.assessmentSemifinals') = true WHERE uploadDownload.productId=:productId ";
                        return [4 /*yield*/, conn.query(queryOptions, { productId: productId })];
                    case 5:
                        links = _a.sent();
                        return [3 /*break*/, 8];
                    case 6:
                        if (!(date === "oct")) return [3 /*break*/, 8];
                        // queryOptions.nestTables="_";
                        queryOptions.sql =
                            "SELECT uploadDownload.* products.* FROM uploadDownload INNER JOIN products ON products.productId = uploadDownload.productId AND JSON_EXTRACT(productDetails,'$.assessmentSemifinals') = true AND JSON_EXTRACT(productDetails,'$.assessmentFinals') = true WHERE uploadDownload.productId=:productId ";
                        return [4 /*yield*/, conn.query(queryOptions, { productId: productId })];
                    case 7:
                        links = _a.sent();
                        _a.label = 8;
                    case 8:
                        if (links) {
                            return [2 /*return*/, links];
                        }
                        else {
                            return [2 /*return*/, []];
                        }
                        return [3 /*break*/, 10];
                    case 9: return [2 /*return*/, []];
                    case 10: return [3 /*break*/, 13];
                    case 11:
                        e_4 = _a.sent();
                        console.error(e_4);
                        return [2 /*return*/, []];
                    case 12:
                        if (conn)
                            conn.release();
                        return [7 /*endfinally*/];
                    case 13: return [2 /*return*/];
                }
            });
        });
    };
    UploadDownloadServer.prototype.getLinksByFileTypePass = function (fileType, date) {
        return __awaiter(this, void 0, void 0, function () {
            var conn, queryOptions, links, e_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        conn = null;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 11, 12, 13]);
                        return [4 /*yield*/, server_2.getPool().getConnection()];
                    case 2:
                        conn = _a.sent();
                        if (!conn) return [3 /*break*/, 9];
                        queryOptions = {
                            namedPlaceholders: true,
                            sql: ""
                        };
                        links = [];
                        if (!(date === "none")) return [3 /*break*/, 4];
                        queryOptions.sql = "SELECT uploadDownload.uuid, uploadDownload.fileType, uploadDownload.extension, uploadDownload.uploadTime, products.* FROM uploadDownload INNER JOIN products ON products.productId=uploadDownload.productId WHERE uploadDownload.fileType=:fileType";
                        return [4 /*yield*/, conn.query(queryOptions, { fileType: fileType })];
                    case 3:
                        links = _a.sent();
                        return [3 /*break*/, 8];
                    case 4:
                        if (!(date === "may")) return [3 /*break*/, 6];
                        queryOptions.sql = "SELECT uploadDownload.uuid, uploadDownload.fileType, uploadDownload.extension, uploadDownload.uploadTime, products.* FROM uploadDownload INNER JOIN products ON products.productId=uploadDownload.productId AND JSON_EXTRACT(productDetails,'$.assessmentSemifinals') = true WHERE uploadDownload.fileType=:fileType";
                        return [4 /*yield*/, conn.query(queryOptions, { fileType: fileType })];
                    case 5:
                        links = _a.sent();
                        return [3 /*break*/, 8];
                    case 6:
                        if (!(date === "oct")) return [3 /*break*/, 8];
                        queryOptions.sql =
                            "SELECT uploadDownload.uuid, uploadDownload.fileType, uploadDownload.extension, uploadDownload.uploadTime, products.* FROM uploadDownload INNER JOIN products ON products.productId=uploadDownload.productId AND JSON_EXTRACT(productDetails,'$.assessmentSemifinals') = true AND JSON_EXTRACT(productDetails,'$.assessmentFinals') = true WHERE uploadDownload.fileType=:fileType";
                        return [4 /*yield*/, conn.query(queryOptions, { fileType: fileType })];
                    case 7:
                        links = _a.sent();
                        _a.label = 8;
                    case 8:
                        if (links) {
                            return [2 /*return*/, links];
                        }
                        else {
                            return [2 /*return*/, []];
                        }
                        return [3 /*break*/, 10];
                    case 9: return [2 /*return*/, []];
                    case 10: return [3 /*break*/, 13];
                    case 11:
                        e_5 = _a.sent();
                        console.error(e_5);
                        return [2 /*return*/, []];
                    case 12:
                        if (conn)
                            conn.release();
                        return [7 /*endfinally*/];
                    case 13: return [2 /*return*/];
                }
            });
        });
    };
    UploadDownloadServer.prototype.addS3File = function (uuid, fileData, fileType) {
        return __awaiter(this, void 0, void 0, function () {
            var s3, uploadParams, readable, buffer, data, fileBuffer, data, e_6;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 14, , 15]);
                        return [4 /*yield*/, aws_sdk_1.default.config.update({ region: process.env.REGION, accessKeyId: process.env.AKEY, secretAccessKey: process.env.ASECRETKEY })];
                    case 1:
                        _a.sent();
                        s3 = new aws_sdk_1.default.S3();
                        if (!(uuid !== "" && uuid !== undefined && process.env.BUCKET)) return [3 /*break*/, 12];
                        uploadParams = {
                            Bucket: process.env.BUCKET,
                            Key: '',
                            Body: ''
                        };
                        readable = new stream_1.Readable();
                        if (!(fileType === "base64")) return [3 /*break*/, 5];
                        if (!(fileData !== "" && fileData !== undefined)) return [3 /*break*/, 3];
                        buffer = Buffer.from(fileData, "base64");
                        readable._read = function () { };
                        readable.push(buffer);
                        uploadParams.Body = buffer;
                        uploadParams.Key = uuid;
                        return [4 /*yield*/, s3.upload(uploadParams).promise()];
                    case 2:
                        data = _a.sent();
                        if (data)
                            return [2 /*return*/, true];
                        else
                            return [2 /*return*/, false];
                        return [3 /*break*/, 4];
                    case 3: return [2 /*return*/, false];
                    case 4: return [3 /*break*/, 11];
                    case 5:
                        if (!(fileType === "path")) return [3 /*break*/, 10];
                        return [4 /*yield*/, fs_extra_1.default.readFile(fileData)];
                    case 6:
                        fileBuffer = _a.sent();
                        if (!(fileBuffer && fileBuffer !== undefined)) return [3 /*break*/, 8];
                        readable._read = function () { };
                        readable.push(fileBuffer);
                        uploadParams.Body = fileBuffer;
                        uploadParams.Key = uuid;
                        return [4 /*yield*/, s3.upload(uploadParams).promise()];
                    case 7:
                        data = _a.sent();
                        if (data)
                            return [2 /*return*/, true];
                        else
                            return [2 /*return*/, false];
                        return [3 /*break*/, 9];
                    case 8: return [2 /*return*/, false];
                    case 9: return [3 /*break*/, 11];
                    case 10: return [2 /*return*/, false];
                    case 11: return [3 /*break*/, 13];
                    case 12: return [2 /*return*/, false];
                    case 13: return [3 /*break*/, 15];
                    case 14:
                        e_6 = _a.sent();
                        console.error(e_6);
                        return [2 /*return*/, false];
                    case 15: return [2 /*return*/];
                }
            });
        });
    };
    UploadDownloadServer.prototype.getS3Object = function (uuid) {
        return __awaiter(this, void 0, void 0, function () {
            var s3, BucketParams, utf8Data, response, e_7;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        aws_sdk_1.default.config.update({ region: process.env.REGION, accessKeyId: process.env.AKEY, secretAccessKey: process.env.ASECRETKEY });
                        s3 = new aws_sdk_1.default.S3({
                            signatureVersion: 'v4',
                        });
                        if (!(uuid !== "" && uuid !== undefined)) return [3 /*break*/, 2];
                        BucketParams = {
                            Bucket: process.env.BUCKET,
                            Key: uuid
                        };
                        utf8Data = void 0;
                        return [4 /*yield*/, s3.getObject(BucketParams).promise()];
                    case 1:
                        response = _a.sent();
                        console.log(response.Body);
                        if (response.Body !== undefined) {
                            utf8Data = response.Body.toString("base64");
                        }
                        if (utf8Data !== undefined)
                            return [2 /*return*/, utf8Data];
                        else
                            return [2 /*return*/, ""];
                        return [3 /*break*/, 3];
                    case 2: return [2 /*return*/, ""];
                    case 3: return [3 /*break*/, 5];
                    case 4:
                        e_7 = _a.sent();
                        console.error(e_7);
                        return [2 /*return*/, ""];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    UploadDownloadServer.prototype.getS3Url = function (uuid, userId) {
        return __awaiter(this, void 0, void 0, function () {
            var s3, name_1, user, link, product, date, signedUrlExpireSeconds, url, e_8;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 6, , 7]);
                        aws_sdk_1.default.config.update({ region: process.env.REGION, accessKeyId: process.env.AKEY, secretAccessKey: process.env.ASECRETKEY });
                        s3 = new aws_sdk_1.default.S3({
                            signatureVersion: 'v4',
                        });
                        name_1 = "";
                        if (!(userId !== undefined && userId !== "")) return [3 /*break*/, 2];
                        return [4 /*yield*/, users.getUserById(userId)];
                    case 1:
                        user = _a.sent();
                        if (user)
                            name_1 = user.username + "_profile_image.jpg";
                        return [3 /*break*/, 5];
                    case 2: return [4 /*yield*/, uploadDownload.getLinkByUuid(uuid)];
                    case 3:
                        link = _a.sent();
                        if (!link) return [3 /*break*/, 5];
                        return [4 /*yield*/, teams.getProductById(link.productId)];
                    case 4:
                        product = _a.sent();
                        if (product) {
                            date = this.formatDate(link.uploadTime);
                            if (link.uploadTime === undefined || date === undefined) {
                                date = this.formatDate(new Date());
                            }
                            if (link.fileType === "demoVid") {
                                name_1 = product.startupName + "_tehnic_demo_video_" + date + "." + link.extension;
                            }
                            else if (link.fileType === "presVid") {
                                name_1 = product.startupName + "_products_presentation_video_" + date + "." + link.extension;
                            }
                            else if (link.fileType === "pres") {
                                name_1 = product.startupName + "_powerpoint_presentation_" + date + "." + link.extension;
                            }
                            else if (link.fileType === "image") {
                                name_1 = product.startupName + "_products_image_" + link.uuid[0] + link.uuid[1] + link.uuid[2] + "_" + date + "." + link.extension;
                            }
                            else if (link.fileType === "logo") {
                                name_1 = product.startupName + "_logo_" + date + "." + link.extension;
                            }
                            else {
                                name_1 = link.fileType + link.extension;
                            }
                        }
                        _a.label = 5;
                    case 5:
                        if (uuid !== "" && uuid !== undefined) {
                            signedUrlExpireSeconds = 60 * 5;
                            url = s3.getSignedUrl('getObject', {
                                Bucket: process.env.BUCKET,
                                Key: uuid,
                                Expires: signedUrlExpireSeconds,
                                ResponseContentDisposition: 'attachment; filename ="' + name_1 + '"'
                            });
                            if (url !== undefined)
                                return [2 /*return*/, url];
                            else
                                return [2 /*return*/, ""];
                        }
                        else {
                            return [2 /*return*/, ""];
                        }
                        return [3 /*break*/, 7];
                    case 6:
                        e_8 = _a.sent();
                        console.error(e_8);
                        return [2 /*return*/, "false"];
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    UploadDownloadServer.prototype.deleteS3File = function (uuid) {
        return __awaiter(this, void 0, void 0, function () {
            var s3, deleteParams;
            return __generator(this, function (_a) {
                try {
                    aws_sdk_1.default.config.update({ region: process.env.REGION, accessKeyId: process.env.AKEY, secretAccessKey: process.env.ASECRETKEY });
                    s3 = new aws_sdk_1.default.S3();
                    if (uuid !== undefined && uuid !== "" && process.env.BUCKET) {
                        deleteParams = {
                            Bucket: process.env.BUCKET,
                            Key: uuid
                        };
                        if (s3.deleteObject(deleteParams, function (err, data) {
                            if (err) {
                                console.error("Error", err);
                                return false;
                            }
                            if (data) {
                                console.log("Delete Success", data);
                                return true;
                            }
                        }))
                            return [2 /*return*/, true];
                        else
                            return [2 /*return*/, false];
                    }
                    else
                        return [2 /*return*/, false];
                }
                catch (e) {
                    console.error(e);
                    return [2 /*return*/, false];
                }
                return [2 /*return*/];
            });
        });
    };
    UploadDownloadServer.prototype.generateCustomZip = function (linkUuid, city, businessTrack, semiFianals, finals) {
        return __awaiter(this, void 0, void 0, function () {
            var zip, products, products_1, products_1_1, product, prId, links, users_2, users_1, users_1_1, user, obj, name_2, e_9_1, links_2, links_2_1, link, date, name_3, obj, e_10_1, e_11_1, uuid_2, link, tmpPath, upload, e_12;
            var e_11, _a, e_9, _b, e_10, _c;
            var _this = this;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        _d.trys.push([0, 38, , 39]);
                        UploadDownloadServer.zips[linkUuid] = new jszip_1.default();
                        zip = UploadDownloadServer.zips[linkUuid];
                        if (!city) return [3 /*break*/, 26];
                        return [4 /*yield*/, teams.getTeamsByLocationBtFinals(city, businessTrack, semiFianals, finals)];
                    case 1:
                        products = _d.sent();
                        _d.label = 2;
                    case 2:
                        _d.trys.push([2, 24, 25, 26]);
                        products_1 = __values(products), products_1_1 = products_1.next();
                        _d.label = 3;
                    case 3:
                        if (!!products_1_1.done) return [3 /*break*/, 23];
                        product = products_1_1.value;
                        prId = product.productId;
                        return [4 /*yield*/, uploadDownload.getLinksByProductId(prId, "none")];
                    case 4:
                        links = _d.sent();
                        return [4 /*yield*/, teams.getUsersByTeamId(product.teamId)];
                    case 5:
                        users_2 = _d.sent();
                        if (!(users_2.length !== 0)) return [3 /*break*/, 13];
                        _d.label = 6;
                    case 6:
                        _d.trys.push([6, 11, 12, 13]);
                        users_1 = (e_9 = void 0, __values(users_2)), users_1_1 = users_1.next();
                        _d.label = 7;
                    case 7:
                        if (!!users_1_1.done) return [3 /*break*/, 10];
                        user = users_1_1.value;
                        if (!user) return [3 /*break*/, 9];
                        if (!(user.avatarUu !== "" &&
                            user.avatarUu !== null)) return [3 /*break*/, 9];
                        return [4 /*yield*/, uploadDownload.getS3Object(user.avatarUu)];
                    case 8:
                        obj = _d.sent();
                        name_2 = product.teamName +
                            "/UserImages/" +
                            product.location +
                            "_" +
                            product.teamName +
                            "_profile_photo_" +
                            user.firstName +
                            "_" +
                            user.lastName +
                            ".png";
                        if (obj !== "" && zip) {
                            zip.file(name_2, obj, { base64: true });
                        }
                        else {
                            console.error("No obj GETS3OBJ");
                        }
                        _d.label = 9;
                    case 9:
                        users_1_1 = users_1.next();
                        return [3 /*break*/, 7];
                    case 10: return [3 /*break*/, 13];
                    case 11:
                        e_9_1 = _d.sent();
                        e_9 = { error: e_9_1 };
                        return [3 /*break*/, 13];
                    case 12:
                        try {
                            if (users_1_1 && !users_1_1.done && (_b = users_1.return)) _b.call(users_1);
                        }
                        finally { if (e_9) throw e_9.error; }
                        return [7 /*endfinally*/];
                    case 13:
                        if (!(links.length !== 0 && zip)) return [3 /*break*/, 22];
                        zip.folder(product.teamName);
                        zip.folder(product.teamName + "/Videos");
                        zip.folder(product.teamName + "/Images");
                        zip.folder(product.teamName + "/PowerPoint");
                        _d.label = 14;
                    case 14:
                        _d.trys.push([14, 20, 21, 22]);
                        links_2 = (e_10 = void 0, __values(links)), links_2_1 = links_2.next();
                        _d.label = 15;
                    case 15:
                        if (!!links_2_1.done) return [3 /*break*/, 19];
                        link = links_2_1.value;
                        if (!(prId !== "" && product !== undefined)) return [3 /*break*/, 17];
                        date = uploadDownload.formatDate(link.uploadTime);
                        name_3 = "";
                        if (link.fileType === "demoVid") {
                            name_3 =
                                product.teamName +
                                    "/Videos/" +
                                    product.location +
                                    "_" +
                                    product.teamName +
                                    "_tehnic_demo_video_" +
                                    date +
                                    "." +
                                    link.extension;
                        }
                        else if (link.fileType === "presVid") {
                            name_3 =
                                product.teamName +
                                    "/Videos/" +
                                    product.location +
                                    "_" +
                                    product.teamName +
                                    "_products_presentation_video_" +
                                    date +
                                    "." +
                                    link.extension;
                        }
                        else if (link.fileType === "pres") {
                            name_3 =
                                product.teamName +
                                    "/PowerPoint/" +
                                    product.location +
                                    "_" +
                                    product.teamName +
                                    "_powerpoint_presentation_" +
                                    date +
                                    "." +
                                    link.extension;
                        }
                        else if (link.fileType === "image") {
                            name_3 =
                                product.teamName +
                                    "/Images/" +
                                    product.location +
                                    "_" +
                                    product.teamName +
                                    "_products_image_" +
                                    link.uuid[0] +
                                    link.uuid[1] +
                                    link.uuid[2] +
                                    "_" +
                                    date +
                                    "." +
                                    link.extension;
                        }
                        else if (link.fileType === "logo") {
                            name_3 =
                                product.teamName +
                                    "/Images/" +
                                    product.location +
                                    "_" +
                                    product.teamName +
                                    "_logo_" +
                                    date +
                                    "." +
                                    link.extension;
                        }
                        else {
                            console.error("Unidentified link");
                        }
                        return [4 /*yield*/, uploadDownload.getS3Object(link.uuid)];
                    case 16:
                        obj = _d.sent();
                        if (obj !== "") {
                            zip.file(name_3, obj, { base64: true });
                        }
                        else {
                            console.error("No obj GETS3OBJ");
                        }
                        return [3 /*break*/, 18];
                    case 17:
                        console.error("No Product");
                        _d.label = 18;
                    case 18:
                        links_2_1 = links_2.next();
                        return [3 /*break*/, 15];
                    case 19: return [3 /*break*/, 22];
                    case 20:
                        e_10_1 = _d.sent();
                        e_10 = { error: e_10_1 };
                        return [3 /*break*/, 22];
                    case 21:
                        try {
                            if (links_2_1 && !links_2_1.done && (_c = links_2.return)) _c.call(links_2);
                        }
                        finally { if (e_10) throw e_10.error; }
                        return [7 /*endfinally*/];
                    case 22:
                        products_1_1 = products_1.next();
                        return [3 /*break*/, 3];
                    case 23: return [3 /*break*/, 26];
                    case 24:
                        e_11_1 = _d.sent();
                        e_11 = { error: e_11_1 };
                        return [3 /*break*/, 26];
                    case 25:
                        try {
                            if (products_1_1 && !products_1_1.done && (_a = products_1.return)) _a.call(products_1);
                        }
                        finally { if (e_11) throw e_11.error; }
                        return [7 /*endfinally*/];
                    case 26:
                        uuid_2 = uuid_1.v4();
                        if (!(zip !== null)) return [3 /*break*/, 36];
                        if (!(Object.keys(zip.files).length === 0)) return [3 /*break*/, 34];
                        return [4 /*yield*/, fs_extra_1.default.writeFile(path_1.default.join("/tmp", "NO_FILE.txt"), "NO_FILE")];
                    case 27:
                        _d.sent();
                        link = {
                            uuid: linkUuid,
                            productId: "7051998",
                            fileType: linkUuid + "_zip",
                            extension: ".txt",
                            uploadTime: new Date()
                        };
                        tmpPath = path_1.default.join("/tmp", "NO_FILE.txt");
                        return [4 /*yield*/, uploadDownload.addS3File(link.uuid, tmpPath, "path")];
                    case 28:
                        upload = _d.sent();
                        if (!upload) return [3 /*break*/, 31];
                        console.log("Uploaded file");
                        return [4 /*yield*/, uploadDownload.addLink(link)];
                    case 29:
                        _d.sent();
                        return [4 /*yield*/, fs_extra_1.default.remove(tmpPath)];
                    case 30:
                        _d.sent();
                        return [3 /*break*/, 33];
                    case 31: return [4 /*yield*/, fs_extra_1.default.remove(tmpPath)];
                    case 32:
                        _d.sent();
                        console.error("Didn't upload ADDS3File");
                        _d.label = 33;
                    case 33: return [3 /*break*/, 35];
                    case 34:
                        zip.generateNodeStream({
                            type: "nodebuffer",
                            streamFiles: true
                        })
                            .pipe(fs_extra_1.default.createWriteStream(path_1.default.join("/tmp", uuid_2 + ".zip")))
                            .on("finish", function () { return __awaiter(_this, void 0, void 0, function () {
                            var link, upload, tmpFile;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        console.log("Finished writing zip");
                                        console.log("Trying to send zip");
                                        link = {
                                            uuid: linkUuid,
                                            productId: "7051998",
                                            fileType: linkUuid + "_zip",
                                            extension: ".zip",
                                            uploadTime: new Date()
                                        };
                                        if (!(link.uuid !== "")) return [3 /*break*/, 7];
                                        upload = false;
                                        tmpFile = path_1.default.join("/tmp", uuid_2 + ".zip");
                                        return [4 /*yield*/, uploadDownload.addS3File(link.uuid, tmpFile, "path")];
                                    case 1:
                                        upload = _a.sent();
                                        if (!upload) return [3 /*break*/, 4];
                                        console.log("Uploaded file");
                                        return [4 /*yield*/, uploadDownload.addLink(link)];
                                    case 2:
                                        _a.sent();
                                        return [4 /*yield*/, fs_extra_1.default.remove(tmpFile)];
                                    case 3:
                                        _a.sent();
                                        return [3 /*break*/, 6];
                                    case 4: return [4 /*yield*/, fs_extra_1.default.remove(tmpFile)];
                                    case 5:
                                        _a.sent();
                                        console.error("Didn't upload ADDS3File");
                                        _a.label = 6;
                                    case 6: return [3 /*break*/, 8];
                                    case 7:
                                        console.error("Didn't create link ADDLINK");
                                        _a.label = 8;
                                    case 8: return [2 /*return*/];
                                }
                            });
                        }); });
                        _d.label = 35;
                    case 35: return [3 /*break*/, 37];
                    case 36:
                        console.log("No archive");
                        _d.label = 37;
                    case 37:
                        zip = null;
                        return [3 /*break*/, 39];
                    case 38:
                        e_12 = _d.sent();
                        console.error(e_12);
                        return [3 /*break*/, 39];
                    case 39: return [2 /*return*/];
                }
            });
        });
    };
    UploadDownloadServer.prototype.generateZip = function (type, date, linkUuid, option, city, team) {
        return __awaiter(this, void 0, void 0, function () {
            var zip, products, products_2, products_2_1, product, prId, links, usersArr, folder, d, usersArr_1, usersArr_1_1, user, obj, name_4, e_13_1, links_3, links_3_1, link, date_1, name_5, obj, e_14_1, e_15_1, products, products_3, products_3_1, product, prId, links, users_6, d, users_3, users_3_1, user, obj, name_6, e_16_1, links_4, links_4_1, link, date_2, name_7, obj, e_17_1, e_18_1, links, teamP, users_7, d, users_4, users_4_1, user, obj, name_8, e_19_1, links_5, links_5_1, link, product, date_3, name_9, obj, e_20_1, teamsArr, teamsArr_1, teamsArr_1_1, teamP, prId, users_8, d, users_5, users_5_1, user, obj, name_10, e_21_1, links, links_6, links_6_1, link, date_4, name_11, obj, e_22_1, e_23_1, uuid_3, link, tmpPath, upload, e_24;
            var e_15, _a, e_13, _b, e_14, _c, e_18, _d, e_16, _e, e_17, _f, e_19, _g, e_20, _h, e_23, _j, e_21, _k, e_22, _l;
            var _this = this;
            return __generator(this, function (_m) {
                switch (_m.label) {
                    case 0:
                        _m.trys.push([0, 124, , 125]);
                        UploadDownloadServer.zips[linkUuid] = new jszip_1.default;
                        zip = UploadDownloadServer.zips[linkUuid];
                        if (!(type === "all")) return [3 /*break*/, 28];
                        return [4 /*yield*/, teams.getTeams()];
                    case 1:
                        products = _m.sent();
                        _m.label = 2;
                    case 2:
                        _m.trys.push([2, 25, 26, 27]);
                        products_2 = __values(products), products_2_1 = products_2.next();
                        _m.label = 3;
                    case 3:
                        if (!!products_2_1.done) return [3 /*break*/, 24];
                        product = products_2_1.value;
                        prId = product.productId;
                        return [4 /*yield*/, uploadDownload.getLinksByProductId(prId, date)];
                    case 4:
                        links = _m.sent();
                        return [4 /*yield*/, teams.getUsersByTeamId(product.teamId)];
                    case 5:
                        usersArr = _m.sent();
                        folder = product.location + '/' + product.teamName;
                        return [4 /*yield*/, teams.isTeamInDate(date, prId)];
                    case 6:
                        d = _m.sent();
                        if (!(usersArr.length !== 0 && d)) return [3 /*break*/, 14];
                        _m.label = 7;
                    case 7:
                        _m.trys.push([7, 12, 13, 14]);
                        usersArr_1 = (e_13 = void 0, __values(usersArr)), usersArr_1_1 = usersArr_1.next();
                        _m.label = 8;
                    case 8:
                        if (!!usersArr_1_1.done) return [3 /*break*/, 11];
                        user = usersArr_1_1.value;
                        if (!user) return [3 /*break*/, 10];
                        if (!(user.avatarUu !== '' && user.avatarUu !== null)) return [3 /*break*/, 10];
                        return [4 /*yield*/, uploadDownload.getS3Object(user.avatarUu)];
                    case 9:
                        obj = _m.sent();
                        name_4 = folder + '/UserImages/' + product.location + "_" + product.teamName + '_profile_photo_' + user.firstName + "_" + user.lastName + '.png';
                        if (obj !== "" && zip) {
                            zip.file(name_4, obj, { base64: true });
                        }
                        else {
                            console.error("No such object");
                        }
                        _m.label = 10;
                    case 10:
                        usersArr_1_1 = usersArr_1.next();
                        return [3 /*break*/, 8];
                    case 11: return [3 /*break*/, 14];
                    case 12:
                        e_13_1 = _m.sent();
                        e_13 = { error: e_13_1 };
                        return [3 /*break*/, 14];
                    case 13:
                        try {
                            if (usersArr_1_1 && !usersArr_1_1.done && (_b = usersArr_1.return)) _b.call(usersArr_1);
                        }
                        finally { if (e_13) throw e_13.error; }
                        return [7 /*endfinally*/];
                    case 14:
                        if (!(links.length !== 0 && zip)) return [3 /*break*/, 23];
                        zip.folder(folder);
                        zip.folder(folder + "/Videos");
                        zip.folder(folder + "/Images");
                        zip.folder(folder + "/PowerPoint");
                        _m.label = 15;
                    case 15:
                        _m.trys.push([15, 21, 22, 23]);
                        links_3 = (e_14 = void 0, __values(links)), links_3_1 = links_3.next();
                        _m.label = 16;
                    case 16:
                        if (!!links_3_1.done) return [3 /*break*/, 20];
                        link = links_3_1.value;
                        if (!(prId !== "" && product !== undefined)) return [3 /*break*/, 18];
                        date_1 = uploadDownload.formatDate(link.uploadTime);
                        name_5 = "";
                        if (link.fileType === "demoVid") {
                            name_5 = folder + '/Videos/' + product.location + "_" + product.teamName + "_tehnic_demo_video_" + date_1 + "." + link.extension;
                        }
                        else if (link.fileType === "presVid") {
                            name_5 = folder + '/Videos/' + product.location + "_" + product.teamName + "_products_presentation_video_" + date_1 + "." + link.extension;
                        }
                        else if (link.fileType === "pres") {
                            name_5 = folder + '/PowerPoint/' + product.location + "_" + product.teamName + "_powerpoint_presentation_" + date_1 + "." + link.extension;
                        }
                        else if (link.fileType === "image") {
                            name_5 = folder + '/Images/' + product.location + "_" + product.teamName + "_products_image_" + link.uuid[0] + link.uuid[1] + link.uuid[2] + "_" + date_1 + "." + link.extension;
                        }
                        else if (link.fileType === "logo") {
                            name_5 = folder + '/Images/' + product.location + "_" + product.teamName + "_logo_" + date_1 + "." + link.extension;
                        }
                        else {
                            console.error("Unidentified link");
                        }
                        return [4 /*yield*/, uploadDownload.getS3Object(link.uuid)];
                    case 17:
                        obj = _m.sent();
                        if (obj !== "") {
                            zip.file(name_5, obj, { base64: true });
                        }
                        else {
                            console.error("No such object");
                        }
                        return [3 /*break*/, 19];
                    case 18:
                        console.error("No productId");
                        _m.label = 19;
                    case 19:
                        links_3_1 = links_3.next();
                        return [3 /*break*/, 16];
                    case 20: return [3 /*break*/, 23];
                    case 21:
                        e_14_1 = _m.sent();
                        e_14 = { error: e_14_1 };
                        return [3 /*break*/, 23];
                    case 22:
                        try {
                            if (links_3_1 && !links_3_1.done && (_c = links_3.return)) _c.call(links_3);
                        }
                        finally { if (e_14) throw e_14.error; }
                        return [7 /*endfinally*/];
                    case 23:
                        products_2_1 = products_2.next();
                        return [3 /*break*/, 3];
                    case 24: return [3 /*break*/, 27];
                    case 25:
                        e_15_1 = _m.sent();
                        e_15 = { error: e_15_1 };
                        return [3 /*break*/, 27];
                    case 26:
                        try {
                            if (products_2_1 && !products_2_1.done && (_a = products_2.return)) _a.call(products_2);
                        }
                        finally { if (e_15) throw e_15.error; }
                        return [7 /*endfinally*/];
                    case 27: return [3 /*break*/, 112];
                    case 28:
                        if (!city) return [3 /*break*/, 56];
                        return [4 /*yield*/, teams.getTeamsByLocation(city)];
                    case 29:
                        products = _m.sent();
                        _m.label = 30;
                    case 30:
                        _m.trys.push([30, 53, 54, 55]);
                        products_3 = __values(products), products_3_1 = products_3.next();
                        _m.label = 31;
                    case 31:
                        if (!!products_3_1.done) return [3 /*break*/, 52];
                        product = products_3_1.value;
                        prId = product.productId;
                        return [4 /*yield*/, uploadDownload.getLinksByProductId(prId, date)];
                    case 32:
                        links = _m.sent();
                        return [4 /*yield*/, teams.getUsersByTeamId(product.teamId)];
                    case 33:
                        users_6 = _m.sent();
                        return [4 /*yield*/, teams.isTeamInDate(date, prId)];
                    case 34:
                        d = _m.sent();
                        if (!(users_6.length !== 0 && d)) return [3 /*break*/, 42];
                        _m.label = 35;
                    case 35:
                        _m.trys.push([35, 40, 41, 42]);
                        users_3 = (e_16 = void 0, __values(users_6)), users_3_1 = users_3.next();
                        _m.label = 36;
                    case 36:
                        if (!!users_3_1.done) return [3 /*break*/, 39];
                        user = users_3_1.value;
                        if (!user) return [3 /*break*/, 38];
                        if (!(user.avatarUu !== '' && user.avatarUu !== null)) return [3 /*break*/, 38];
                        return [4 /*yield*/, uploadDownload.getS3Object(user.avatarUu)];
                    case 37:
                        obj = _m.sent();
                        name_6 = product.teamName + '/UserImages/' + product.location + "_" + product.teamName + '_profile_photo_' + user.firstName + "_" + user.lastName + '.png';
                        if (obj !== "" && zip) {
                            zip.file(name_6, obj, { base64: true });
                        }
                        else {
                            console.error('No obj GETS3OBJ');
                        }
                        _m.label = 38;
                    case 38:
                        users_3_1 = users_3.next();
                        return [3 /*break*/, 36];
                    case 39: return [3 /*break*/, 42];
                    case 40:
                        e_16_1 = _m.sent();
                        e_16 = { error: e_16_1 };
                        return [3 /*break*/, 42];
                    case 41:
                        try {
                            if (users_3_1 && !users_3_1.done && (_e = users_3.return)) _e.call(users_3);
                        }
                        finally { if (e_16) throw e_16.error; }
                        return [7 /*endfinally*/];
                    case 42:
                        if (!(links.length !== 0 && zip)) return [3 /*break*/, 51];
                        zip.folder(product.teamName);
                        zip.folder(product.teamName + "/Videos");
                        zip.folder(product.teamName + "/Images");
                        zip.folder(product.teamName + "/PowerPoint");
                        _m.label = 43;
                    case 43:
                        _m.trys.push([43, 49, 50, 51]);
                        links_4 = (e_17 = void 0, __values(links)), links_4_1 = links_4.next();
                        _m.label = 44;
                    case 44:
                        if (!!links_4_1.done) return [3 /*break*/, 48];
                        link = links_4_1.value;
                        if (!(prId !== "" && product !== undefined)) return [3 /*break*/, 46];
                        date_2 = uploadDownload.formatDate(link.uploadTime);
                        name_7 = "";
                        if (link.fileType === "demoVid") {
                            name_7 = product.teamName + '/Videos/' + product.location + "_" + product.teamName + "_tehnic_demo_video_" + date_2 + "." + link.extension;
                        }
                        else if (link.fileType === "presVid") {
                            name_7 = product.teamName + '/Videos/' + product.location + "_" + product.teamName + "_products_presentation_video_" + date_2 + "." + link.extension;
                        }
                        else if (link.fileType === "pres") {
                            name_7 = product.teamName + '/PowerPoint/' + product.location + "_" + product.teamName + "_powerpoint_presentation_" + date_2 + "." + link.extension;
                        }
                        else if (link.fileType === "image") {
                            name_7 = product.teamName + '/Images/' + product.location + "_" + product.teamName + "_products_image_" + link.uuid[0] + link.uuid[1] + link.uuid[2] + "_" + date_2 + "." + link.extension;
                        }
                        else if (link.fileType === "logo") {
                            name_7 = product.teamName + '/Images/' + product.location + "_" + product.teamName + "_logo_" + date_2 + "." + link.extension;
                        }
                        else {
                            console.error('Unidentified link');
                        }
                        return [4 /*yield*/, uploadDownload.getS3Object(link.uuid)];
                    case 45:
                        obj = _m.sent();
                        if (obj !== "") {
                            zip.file(name_7, obj, { base64: true });
                        }
                        else {
                            console.error('No obj GETS3OBJ');
                        }
                        return [3 /*break*/, 47];
                    case 46:
                        console.error('No Product');
                        _m.label = 47;
                    case 47:
                        links_4_1 = links_4.next();
                        return [3 /*break*/, 44];
                    case 48: return [3 /*break*/, 51];
                    case 49:
                        e_17_1 = _m.sent();
                        e_17 = { error: e_17_1 };
                        return [3 /*break*/, 51];
                    case 50:
                        try {
                            if (links_4_1 && !links_4_1.done && (_f = links_4.return)) _f.call(links_4);
                        }
                        finally { if (e_17) throw e_17.error; }
                        return [7 /*endfinally*/];
                    case 51:
                        products_3_1 = products_3.next();
                        return [3 /*break*/, 31];
                    case 52: return [3 /*break*/, 55];
                    case 53:
                        e_18_1 = _m.sent();
                        e_18 = { error: e_18_1 };
                        return [3 /*break*/, 55];
                    case 54:
                        try {
                            if (products_3_1 && !products_3_1.done && (_d = products_3.return)) _d.call(products_3);
                        }
                        finally { if (e_18) throw e_18.error; }
                        return [7 /*endfinally*/];
                    case 55: return [3 /*break*/, 112];
                    case 56:
                        if (!(team && typeof team === "string")) return [3 /*break*/, 82];
                        return [4 /*yield*/, uploadDownload.getLinksByProductId(team, date)];
                    case 57:
                        links = _m.sent();
                        return [4 /*yield*/, teams.getTeamByProductId(team)];
                    case 58:
                        teamP = _m.sent();
                        if (!teamP) return [3 /*break*/, 60];
                        return [4 /*yield*/, teams.getUsersByTeamId(teamP.teamId)];
                    case 59:
                        users_7 = _m.sent();
                        _m.label = 60;
                    case 60: return [4 /*yield*/, teams.isTeamInDate(date, team)];
                    case 61:
                        d = _m.sent();
                        if (!(users_7 && teamP)) return [3 /*break*/, 69];
                        if (!(users_7.length !== 0 && d)) return [3 /*break*/, 69];
                        _m.label = 62;
                    case 62:
                        _m.trys.push([62, 67, 68, 69]);
                        users_4 = __values(users_7), users_4_1 = users_4.next();
                        _m.label = 63;
                    case 63:
                        if (!!users_4_1.done) return [3 /*break*/, 66];
                        user = users_4_1.value;
                        if (!user) return [3 /*break*/, 65];
                        if (!(user.avatarUu !== '' && user.avatarUu !== null)) return [3 /*break*/, 65];
                        return [4 /*yield*/, uploadDownload.getS3Object(user.avatarUu)];
                    case 64:
                        obj = _m.sent();
                        name_8 = 'UserImages/' + teamP.location + "_" + teamP.teamName + '_profile_photo_' + user.firstName + "_" + user.lastName + '.png';
                        if (obj !== "" && zip) {
                            zip.file(name_8, obj, { base64: true });
                        }
                        else {
                            console.error('No obj GETS3OBJ');
                        }
                        _m.label = 65;
                    case 65:
                        users_4_1 = users_4.next();
                        return [3 /*break*/, 63];
                    case 66: return [3 /*break*/, 69];
                    case 67:
                        e_19_1 = _m.sent();
                        e_19 = { error: e_19_1 };
                        return [3 /*break*/, 69];
                    case 68:
                        try {
                            if (users_4_1 && !users_4_1.done && (_g = users_4.return)) _g.call(users_4);
                        }
                        finally { if (e_19) throw e_19.error; }
                        return [7 /*endfinally*/];
                    case 69:
                        if (!(links.length !== 0 && zip)) return [3 /*break*/, 80];
                        zip.folder("Videos");
                        zip.folder("Images");
                        zip.folder("PowerPoint");
                        _m.label = 70;
                    case 70:
                        _m.trys.push([70, 77, 78, 79]);
                        links_5 = __values(links), links_5_1 = links_5.next();
                        _m.label = 71;
                    case 71:
                        if (!!links_5_1.done) return [3 /*break*/, 76];
                        link = links_5_1.value;
                        return [4 /*yield*/, teams.getProductById(link.productId)];
                    case 72:
                        product = _m.sent();
                        if (!(product && teamP)) return [3 /*break*/, 74];
                        date_3 = uploadDownload.formatDate(link.uploadTime);
                        name_9 = "";
                        if (link.fileType === "demoVid") {
                            name_9 = "Videos/" + teamP.location + "_" + product.startupName + "_tehnic_demo_video_" + date_3 + "." + link.extension;
                        }
                        else if (link.fileType === "presVid") {
                            name_9 = "Videos/" + teamP.location + "_" + product.startupName + "_products_presentation_video_" + date_3 + "." + link.extension;
                        }
                        else if (link.fileType === "pres") {
                            name_9 = "PowerPoint/" + teamP.location + "_" + product.startupName + "_powerpoint_presentation_" + date_3 + "." + link.extension;
                        }
                        else if (link.fileType === "image") {
                            name_9 = "Images/" + teamP.location + "_" + product.startupName + "_products_image_" + link.uuid[0] + link.uuid[1] + link.uuid[2] + "_" + date_3 + "." + link.extension;
                        }
                        else if (link.fileType === "logo") {
                            name_9 = "Images/" + teamP.location + "_" + product.startupName + "_logo_" + date_3 + "." + link.extension;
                        }
                        else {
                            console.error('Unidentified link');
                        }
                        return [4 /*yield*/, uploadDownload.getS3Object(link.uuid)];
                    case 73:
                        obj = _m.sent();
                        if (obj !== "") {
                            zip.file(name_9, obj, { base64: true });
                        }
                        else {
                            console.error('No obj GETS3OBJ');
                        }
                        return [3 /*break*/, 75];
                    case 74:
                        console.error('No Product');
                        _m.label = 75;
                    case 75:
                        links_5_1 = links_5.next();
                        return [3 /*break*/, 71];
                    case 76: return [3 /*break*/, 79];
                    case 77:
                        e_20_1 = _m.sent();
                        e_20 = { error: e_20_1 };
                        return [3 /*break*/, 79];
                    case 78:
                        try {
                            if (links_5_1 && !links_5_1.done && (_h = links_5.return)) _h.call(links_5);
                        }
                        finally { if (e_20) throw e_20.error; }
                        return [7 /*endfinally*/];
                    case 79: return [3 /*break*/, 81];
                    case 80:
                        console.error("No Files");
                        _m.label = 81;
                    case 81: return [3 /*break*/, 112];
                    case 82:
                        if (!(team && typeof team === "object" && typeof team[0] === "string")) return [3 /*break*/, 112];
                        return [4 /*yield*/, teams.getTeamsByIdList(team)];
                    case 83:
                        teamsArr = _m.sent();
                        _m.label = 84;
                    case 84:
                        _m.trys.push([84, 110, 111, 112]);
                        teamsArr_1 = __values(teamsArr), teamsArr_1_1 = teamsArr_1.next();
                        _m.label = 85;
                    case 85:
                        if (!!teamsArr_1_1.done) return [3 /*break*/, 109];
                        teamP = teamsArr_1_1.value;
                        prId = teamP.productId;
                        return [4 /*yield*/, teams.getUsersByTeamId(teamP.teamId)];
                    case 86:
                        users_8 = _m.sent();
                        return [4 /*yield*/, teams.isTeamInDate(date, prId)];
                    case 87:
                        d = _m.sent();
                        if (!(users_8.length !== 0 && d && option === "everything")) return [3 /*break*/, 95];
                        _m.label = 88;
                    case 88:
                        _m.trys.push([88, 93, 94, 95]);
                        users_5 = (e_21 = void 0, __values(users_8)), users_5_1 = users_5.next();
                        _m.label = 89;
                    case 89:
                        if (!!users_5_1.done) return [3 /*break*/, 92];
                        user = users_5_1.value;
                        if (!user) return [3 /*break*/, 91];
                        if (!(user.avatarUu !== '' && user.avatarUu !== null)) return [3 /*break*/, 91];
                        return [4 /*yield*/, uploadDownload.getS3Object(user.avatarUu)];
                    case 90:
                        obj = _m.sent();
                        name_10 = teamP.teamName + '/UserImages/' + teamP.location + "_" + teamP.teamName + '_profile_photo_' + user.firstName + "_" + user.lastName + '.png';
                        if (obj !== "" && zip) {
                            zip.file(name_10, obj, { base64: true });
                        }
                        else {
                            console.error('No obj GETS3OBJ');
                        }
                        _m.label = 91;
                    case 91:
                        users_5_1 = users_5.next();
                        return [3 /*break*/, 89];
                    case 92: return [3 /*break*/, 95];
                    case 93:
                        e_21_1 = _m.sent();
                        e_21 = { error: e_21_1 };
                        return [3 /*break*/, 95];
                    case 94:
                        try {
                            if (users_5_1 && !users_5_1.done && (_k = users_5.return)) _k.call(users_5);
                        }
                        finally { if (e_21) throw e_21.error; }
                        return [7 /*endfinally*/];
                    case 95:
                        links = [];
                        if (!(option !== undefined)) return [3 /*break*/, 97];
                        return [4 /*yield*/, uploadDownload.getLinksByProductIdAndFileType(prId, option)];
                    case 96:
                        links = _m.sent();
                        return [3 /*break*/, 99];
                    case 97: return [4 /*yield*/, uploadDownload.getLinksByProductId(prId, 'none')];
                    case 98:
                        links = _m.sent();
                        _m.label = 99;
                    case 99:
                        if (!(links.length !== 0)) return [3 /*break*/, 108];
                        if (option === "everything" && zip) {
                            zip.folder(teamP.teamName);
                            zip.folder(teamP.teamName + "/Videos");
                            zip.folder(teamP.teamName + "/Images");
                            zip.folder(teamP.teamName + "/PowerPoint");
                        }
                        _m.label = 100;
                    case 100:
                        _m.trys.push([100, 106, 107, 108]);
                        links_6 = (e_22 = void 0, __values(links)), links_6_1 = links_6.next();
                        _m.label = 101;
                    case 101:
                        if (!!links_6_1.done) return [3 /*break*/, 105];
                        link = links_6_1.value;
                        if (!(prId !== "" && teamP !== undefined)) return [3 /*break*/, 103];
                        date_4 = uploadDownload.formatDate(link.uploadTime);
                        name_11 = "";
                        if (option === "everything") {
                            if (link.fileType === "demoVid") {
                                name_11 = teamP.teamName + '/Videos/' + teamP.location + "_" + teamP.teamName + "_tehnic_demo_video_" + date_4 + "." + link.extension;
                            }
                            else if (link.fileType === "presVid") {
                                name_11 = teamP.teamName + '/Videos/' + teamP.location + "_" + teamP.teamName + "_products_presentation_video_" + date_4 + "." + link.extension;
                            }
                            else if (link.fileType === "pres") {
                                name_11 = teamP.teamName + '/PowerPoint/' + teamP.location + "_" + teamP.teamName + "_powerpoint_presentation_" + date_4 + "." + link.extension;
                            }
                            else if (link.fileType === "image") {
                                name_11 = teamP.teamName + '/Images/' + teamP.location + "_" + teamP.teamName + "_products_image_" + link.uuid[0] + link.uuid[1] + link.uuid[2] + "_" + date_4 + "." + link.extension;
                            }
                            else if (link.fileType === "logo") {
                                name_11 = teamP.teamName + '/Images/' + teamP.location + "_" + teamP.teamName + "_logo_" + date_4 + "." + link.extension;
                            }
                            else {
                                console.error('Unidentified link');
                            }
                        }
                        else {
                            if (option === "demoVid") {
                                name_11 = teamP.location + "_" + teamP.teamName + "_tehnic_demo_video_" + date_4 + "." + link.extension;
                            }
                            else if (option === "presVid") {
                                name_11 = teamP.location + "_" + teamP.teamName + "_products_presentation_video_" + date_4 + "." + link.extension;
                            }
                            else if (option === "pres") {
                                name_11 = teamP.location + "_" + teamP.teamName + "_powerpoint_presentation_" + date_4 + "." + link.extension;
                            }
                            else if (option === "image") {
                                name_11 = teamP.location + "_" + teamP.teamName + "_products_image_" + link.uuid[0] + link.uuid[1] + link.uuid[2] + "_" + date_4 + "." + link.extension;
                            }
                            else if (option === "logo") {
                                name_11 = teamP.location + "_" + teamP.teamName + "_logo_" + date_4 + "." + link.extension;
                            }
                            else {
                                console.error('Unidentified link');
                            }
                        }
                        return [4 /*yield*/, uploadDownload.getS3Object(link.uuid)];
                    case 102:
                        obj = _m.sent();
                        if (obj !== "" && zip) {
                            zip.file(name_11, obj, { base64: true });
                        }
                        else {
                            console.error('No obj GETS3OBJ');
                        }
                        return [3 /*break*/, 104];
                    case 103:
                        console.error('No Product');
                        _m.label = 104;
                    case 104:
                        links_6_1 = links_6.next();
                        return [3 /*break*/, 101];
                    case 105: return [3 /*break*/, 108];
                    case 106:
                        e_22_1 = _m.sent();
                        e_22 = { error: e_22_1 };
                        return [3 /*break*/, 108];
                    case 107:
                        try {
                            if (links_6_1 && !links_6_1.done && (_l = links_6.return)) _l.call(links_6);
                        }
                        finally { if (e_22) throw e_22.error; }
                        return [7 /*endfinally*/];
                    case 108:
                        teamsArr_1_1 = teamsArr_1.next();
                        return [3 /*break*/, 85];
                    case 109: return [3 /*break*/, 112];
                    case 110:
                        e_23_1 = _m.sent();
                        e_23 = { error: e_23_1 };
                        return [3 /*break*/, 112];
                    case 111:
                        try {
                            if (teamsArr_1_1 && !teamsArr_1_1.done && (_j = teamsArr_1.return)) _j.call(teamsArr_1);
                        }
                        finally { if (e_23) throw e_23.error; }
                        return [7 /*endfinally*/];
                    case 112:
                        uuid_3 = uuid_1.v4();
                        if (!(zip !== null)) return [3 /*break*/, 122];
                        if (!(Object.keys(zip.files).length === 0)) return [3 /*break*/, 120];
                        return [4 /*yield*/, fs_extra_1.default.writeFile(path_1.default.join("/tmp", "NO_FILE.txt"), "NO_FILE")];
                    case 113:
                        _m.sent();
                        link = {
                            uuid: linkUuid,
                            productId: "7051998",
                            fileType: linkUuid + "_zip",
                            extension: ".txt",
                            uploadTime: new Date()
                        };
                        tmpPath = path_1.default.join("/tmp", "NO_FILE.txt");
                        return [4 /*yield*/, uploadDownload.addS3File(link.uuid, tmpPath, "path")];
                    case 114:
                        upload = _m.sent();
                        if (!upload) return [3 /*break*/, 117];
                        console.log('Uploaded file');
                        return [4 /*yield*/, uploadDownload.addLink(link)];
                    case 115:
                        _m.sent();
                        return [4 /*yield*/, fs_extra_1.default.remove(tmpPath)];
                    case 116:
                        _m.sent();
                        return [3 /*break*/, 119];
                    case 117: return [4 /*yield*/, fs_extra_1.default.remove(tmpPath)];
                    case 118:
                        _m.sent();
                        console.error('Didn\'t upload ADDS3File');
                        _m.label = 119;
                    case 119: return [3 /*break*/, 121];
                    case 120:
                        zip.generateNodeStream({ type: 'nodebuffer', streamFiles: true }).pipe(fs_extra_1.default.createWriteStream(path_1.default.join("/tmp", uuid_3 + '.zip'))).on('finish', function () { return __awaiter(_this, void 0, void 0, function () {
                            var link, upload, tmpFile;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        console.log("Finished writing zip");
                                        console.log("Trying to send zip");
                                        link = {
                                            uuid: linkUuid,
                                            productId: "7051998",
                                            fileType: linkUuid + "_zip",
                                            extension: ".zip",
                                            uploadTime: new Date()
                                        };
                                        if (!(link.uuid !== "")) return [3 /*break*/, 7];
                                        upload = false;
                                        tmpFile = path_1.default.join("/tmp", uuid_3 + ".zip");
                                        return [4 /*yield*/, uploadDownload.addS3File(link.uuid, tmpFile, "path")];
                                    case 1:
                                        upload = _a.sent();
                                        if (!upload) return [3 /*break*/, 4];
                                        console.log('Uploaded file');
                                        return [4 /*yield*/, uploadDownload.addLink(link)];
                                    case 2:
                                        _a.sent();
                                        return [4 /*yield*/, fs_extra_1.default.remove(tmpFile)];
                                    case 3:
                                        _a.sent();
                                        return [3 /*break*/, 6];
                                    case 4: return [4 /*yield*/, fs_extra_1.default.remove(tmpFile)];
                                    case 5:
                                        _a.sent();
                                        console.error('Didn\'t upload ADDS3File');
                                        _a.label = 6;
                                    case 6: return [3 /*break*/, 8];
                                    case 7:
                                        console.error('Didn\'t create link ADDLINK');
                                        _a.label = 8;
                                    case 8: return [2 /*return*/];
                                }
                            });
                        }); });
                        _m.label = 121;
                    case 121: return [3 /*break*/, 123];
                    case 122:
                        console.log("No archive");
                        _m.label = 123;
                    case 123:
                        zip = null;
                        return [3 /*break*/, 125];
                    case 124:
                        e_24 = _m.sent();
                        console.error(e_24);
                        return [3 /*break*/, 125];
                    case 125: return [2 /*return*/];
                }
            });
        });
    };
    UploadDownloadServer.prototype.checkCustomZip = function (city, businessTrack, workshopNo, semifinals, finals) {
        return __awaiter(this, void 0, void 0, function () {
            var uuid, tsf, tf, link, truthful, oldDate, newDate, e_25;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 6, , 7]);
                        uuid = city + "_uploads_arhive_" + businessTrack + "_" + workshopNo;
                        tsf = semifinals ? "t" : "f";
                        tf = finals ? "t" : "f";
                        uuid = uuid + "_" + tsf + tf;
                        return [4 /*yield*/, uploadDownload.getLinkByUuid(uuid)];
                    case 1:
                        link = _a.sent();
                        truthful = false;
                        if (link) {
                            oldDate = new Date(link.uploadTime).getTime();
                            newDate = new Date().getTime();
                            truthful = (newDate - oldDate >= 86400000);
                        }
                        else {
                            truthful = true;
                        }
                        if (!truthful) return [3 /*break*/, 5];
                        if (!(UploadDownloadServer.zips[uuid] === null)) return [3 /*break*/, 3];
                        return [4 /*yield*/, uploadDownload.generateCustomZip(uuid, city, businessTrack, semifinals, finals)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                    case 3:
                        if (!(UploadDownloadServer.zips[uuid] === undefined)) return [3 /*break*/, 5];
                        UploadDownloadServer.zips[uuid] = null;
                        return [4 /*yield*/, uploadDownload.generateCustomZip(uuid, city, businessTrack, semifinals, finals)];
                    case 4:
                        _a.sent();
                        return [2 /*return*/];
                    case 5: return [3 /*break*/, 7];
                    case 6:
                        e_25 = _a.sent();
                        console.error(e_25);
                        return [2 /*return*/];
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    UploadDownloadServer.prototype.checkZip = function (type, date, option, city, team) {
        return __awaiter(this, void 0, void 0, function () {
            var link, uuid, product, truthful, oldDate, newDate, e_26;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 14, , 15]);
                        link = null;
                        uuid = '';
                        if (!(type === "all")) return [3 /*break*/, 2];
                        uuid = "all_uploads_arhive_" + date;
                        return [4 /*yield*/, uploadDownload.getLinkByUuid(uuid)];
                    case 1:
                        link = _a.sent();
                        console.log(link);
                        return [3 /*break*/, 9];
                    case 2:
                        if (!city) return [3 /*break*/, 4];
                        uuid = city + "_uploads_arhive_" + date;
                        return [4 /*yield*/, uploadDownload.getLinkByUuid(uuid)];
                    case 3:
                        link = _a.sent();
                        return [3 /*break*/, 9];
                    case 4:
                        if (!(typeof team === "string")) return [3 /*break*/, 7];
                        return [4 /*yield*/, teams.getProductById(team)];
                    case 5:
                        product = _a.sent();
                        if (product)
                            uuid = product.startupName + "_uploads_arhive";
                        return [4 /*yield*/, uploadDownload.getLinkByUuid(uuid)];
                    case 6:
                        link = _a.sent();
                        return [3 /*break*/, 9];
                    case 7:
                        if (!(typeof team === "object" && typeof team[0] === "string")) return [3 /*break*/, 9];
                        if (option !== undefined)
                            uuid = "demoday_uploads_arhive_" + option;
                        else
                            uuid = "demoday_uploads_arhive";
                        return [4 /*yield*/, uploadDownload.getLinkByUuid(uuid)];
                    case 8:
                        link = _a.sent();
                        _a.label = 9;
                    case 9:
                        truthful = false;
                        if (link) {
                            oldDate = new Date(link.uploadTime).getTime();
                            newDate = new Date().getTime();
                            truthful = (newDate - oldDate >= 86400000);
                        }
                        else {
                            truthful = true;
                        }
                        if (!truthful) return [3 /*break*/, 13];
                        if (!(UploadDownloadServer.zips[uuid] === null)) return [3 /*break*/, 11];
                        return [4 /*yield*/, uploadDownload.generateZip(type, date, uuid, option, city, team)];
                    case 10:
                        _a.sent();
                        return [2 /*return*/];
                    case 11:
                        if (!(UploadDownloadServer.zips[uuid] === undefined)) return [3 /*break*/, 13];
                        UploadDownloadServer.zips[uuid] = null;
                        return [4 /*yield*/, uploadDownload.generateZip(type, date, uuid, option, city, team)];
                    case 12:
                        _a.sent();
                        return [2 /*return*/];
                    case 13: return [3 /*break*/, 15];
                    case 14:
                        e_26 = _a.sent();
                        console.error(e_26);
                        return [2 /*return*/];
                    case 15: return [2 /*return*/];
                }
            });
        });
    };
    UploadDownloadServer.prototype.getZip = function (type, date, option, city, team) {
        return __awaiter(this, void 0, void 0, function () {
            var link, uuid, product, obj, file, ref, url, e_27;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 16, , 17]);
                        link = null;
                        uuid = '';
                        if (!(type === "all")) return [3 /*break*/, 2];
                        uuid = "all_uploads_arhive_" + date;
                        return [4 /*yield*/, uploadDownload.getLinkByUuid(uuid)];
                    case 1:
                        link = _a.sent();
                        return [3 /*break*/, 9];
                    case 2:
                        if (!city) return [3 /*break*/, 4];
                        uuid = city + "_uploads_arhive_" + date;
                        return [4 /*yield*/, uploadDownload.getLinkByUuid(uuid)];
                    case 3:
                        link = _a.sent();
                        return [3 /*break*/, 9];
                    case 4:
                        if (!(team && typeof team === "string")) return [3 /*break*/, 7];
                        return [4 /*yield*/, teams.getProductById(team)];
                    case 5:
                        product = _a.sent();
                        if (product)
                            uuid = product.startupName + "_uploads_arhive";
                        return [4 /*yield*/, uploadDownload.getLinkByUuid(uuid)];
                    case 6:
                        link = _a.sent();
                        return [3 /*break*/, 9];
                    case 7:
                        if (!(typeof team === "object" && typeof team[0] === "string")) return [3 /*break*/, 9];
                        if (option !== undefined)
                            uuid = "demoday_uploads_arhive_" + option;
                        else
                            uuid = "demoday_uploads_arhive";
                        return [4 /*yield*/, uploadDownload.getLinkByUuid(uuid)];
                    case 8:
                        link = _a.sent();
                        _a.label = 9;
                    case 9:
                        if (!link) return [3 /*break*/, 14];
                        return [4 /*yield*/, uploadDownload.getS3Object(link.uuid)];
                    case 10:
                        obj = _a.sent();
                        file = Buffer.from(obj.substring(0, 12), "base64").toString();
                        ref = "NO_FILE";
                        if (!(file === ref)) return [3 /*break*/, 11];
                        return [2 /*return*/, "NO_FILES_TO_UPLOAD"];
                    case 11: return [4 /*yield*/, uploadDownload.getS3Url(link.uuid)];
                    case 12:
                        url = _a.sent();
                        if (url !== '')
                            return [2 /*return*/, url];
                        else
                            return [2 /*return*/, "ERROR"];
                        _a.label = 13;
                    case 13: return [3 /*break*/, 15];
                    case 14:
                        console.log("else");
                        return [2 /*return*/, "NOT_DONE"];
                    case 15: return [3 /*break*/, 17];
                    case 16:
                        e_27 = _a.sent();
                        console.error(e_27);
                        return [2 /*return*/, "ERROR"];
                    case 17: return [2 /*return*/];
                }
            });
        });
    };
    UploadDownloadServer.getInstance = function () {
        if (!this.INSTANCE) {
            this.INSTANCE = new UploadDownloadServer();
        }
        return this.INSTANCE;
    };
    UploadDownloadServer.zips = {
        "all_uploads_arhive_none": null,
        "all_uploads_arhive_may": null,
        "all_uploads_arhive_oct": null,
        "Bucharest_uploads_arhive_none": null,
        "Bucharest_uploads_arhive_may": null,
        "Bucharest_uploads_arhive_oct": null,
        "Sibiu_uploads_arhive_none": null,
        "Sibiu_uploads_arhive_may": null,
        "Sibiu_uploads_arhive_oct": null,
        "Iasi_uploads_arhive_none": null,
        "Iasi_uploads_arhive_may": null,
        "Iasi_uploads_arhive_oct": null,
        "Cluj_uploads_arhive_none": null,
        "Cluj_uploads_arhive_may": null,
        "Cluj_uploads_arhive_oct": null,
        "Timisoara_uploads_arhive_none": null,
        "Timisoara_uploads_arhive_may": null,
        "Timisoara_uploads_arhive_oct": null,
        "demoday_uploads_arhive": null
    };
    return UploadDownloadServer;
}());
exports.UploadDownloadServer = UploadDownloadServer;
var router = express_1.Router();
var uploadDownload = UploadDownloadServer.getInstance();
var users = server_3.UsersServer.getInstance();
var teams = server_4.TeamsServer.getInstance();
var authFunct = server_3.getAuthorizationFunction();
if (authFunct)
    router.use(authFunct);
router.get("/get/file/product/:fileType/:productId", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var type, productId, links, results, _a, _b, link, url, e_28_1, e_29;
    var e_28, _c;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                _d.trys.push([0, 12, , 13]);
                type = req.params.fileType;
                productId = req.params.productId;
                if (!(productId !== "" && productId !== undefined && type !== "" && type !== undefined)) return [3 /*break*/, 10];
                return [4 /*yield*/, uploadDownload.getLinksByProductIdAndFileType(productId, type)];
            case 1:
                links = _d.sent();
                results = [];
                _d.label = 2;
            case 2:
                _d.trys.push([2, 7, 8, 9]);
                _a = __values(links), _b = _a.next();
                _d.label = 3;
            case 3:
                if (!!_b.done) return [3 /*break*/, 6];
                link = _b.value;
                if (!(link.uuid !== "")) return [3 /*break*/, 5];
                return [4 /*yield*/, uploadDownload.getS3Url(link.uuid)];
            case 4:
                url = _d.sent();
                results.push({
                    data: url,
                    type: link.fileType,
                    ext: link.extension,
                    uuid: link.uuid
                });
                _d.label = 5;
            case 5:
                _b = _a.next();
                return [3 /*break*/, 3];
            case 6: return [3 /*break*/, 9];
            case 7:
                e_28_1 = _d.sent();
                e_28 = { error: e_28_1 };
                return [3 /*break*/, 9];
            case 8:
                try {
                    if (_b && !_b.done && (_c = _a.return)) _c.call(_a);
                }
                finally { if (e_28) throw e_28.error; }
                return [7 /*endfinally*/];
            case 9:
                res.status(200).send(results);
                return [3 /*break*/, 11];
            case 10:
                res.status(204).send({ err: 204, data: null });
                _d.label = 11;
            case 11: return [3 /*break*/, 13];
            case 12:
                e_29 = _d.sent();
                console.error(e_29);
                res.status(500).send({ err: 500, data: null });
                return [3 /*break*/, 13];
            case 13: return [2 /*return*/];
        }
    });
}); });
router.post("/delete/file/", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var uuid, file, rs, rss, name_12, tmpFile, e_30;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 11, , 12]);
                uuid = req.body.uuid;
                if (!(uuid !== "")) return [3 /*break*/, 10];
                return [4 /*yield*/, uploadDownload.getS3Object(uuid)];
            case 1:
                file = _a.sent();
                return [4 /*yield*/, uploadDownload.deleteS3File(uuid)];
            case 2:
                rs = _a.sent();
                if (!(rs && file !== undefined)) return [3 /*break*/, 9];
                return [4 /*yield*/, uploadDownload.deleteLink(uuid)];
            case 3:
                rss = _a.sent();
                if (!rss) return [3 /*break*/, 4];
                res.status(200).send(true);
                return [3 /*break*/, 8];
            case 4:
                name_12 = uuid_1.v4();
                tmpFile = path_1.default.join("/tmp", name_12);
                return [4 /*yield*/, fs_extra_1.default.writeFile(tmpFile, file)];
            case 5:
                _a.sent();
                return [4 /*yield*/, uploadDownload.addS3File(uuid, tmpFile, "path")];
            case 6:
                _a.sent();
                return [4 /*yield*/, fs_extra_1.default.remove(tmpFile)];
            case 7:
                _a.sent();
                res.status(500).send({ err: 500, data: false });
                _a.label = 8;
            case 8: return [3 /*break*/, 10];
            case 9:
                res.status(500).send({ err: 500, data: false });
                _a.label = 10;
            case 10: return [3 /*break*/, 12];
            case 11:
                e_30 = _a.sent();
                console.error(e_30);
                res.status(500).send({ err: 500, data: false });
                return [3 /*break*/, 12];
            case 12: return [2 /*return*/];
        }
    });
}); });
router.get("/download/file/:uuid", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var uuid, url, e_31;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                uuid = req.params.uuid;
                url = "";
                if (!(uuid !== "")) return [3 /*break*/, 2];
                return [4 /*yield*/, uploadDownload.getS3Url(uuid)];
            case 1:
                url = _a.sent();
                _a.label = 2;
            case 2:
                if (url !== "") {
                    res.status(200).send(url);
                }
                else {
                    res.status(404).send({ err: 404, data: null });
                }
                return [3 /*break*/, 4];
            case 3:
                e_31 = _a.sent();
                console.error(e_31);
                res.status(500).send({ err: 500, data: null });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
router.get("/download/zip/:type/:date", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var type_1, date, links, zip, links_7, links_7_1, link, product, date_5, name_13, obj, e_32_1, uuid_4, e_33;
    var e_32, _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 14, , 15]);
                type_1 = req.params.type;
                date = req.params.date;
                return [4 /*yield*/, uploadDownload.getLinksByFileTypePass(type_1, date)];
            case 1:
                links = _b.sent();
                if (!(links.length !== 0)) return [3 /*break*/, 12];
                zip = new jszip_1.default();
                _b.label = 2;
            case 2:
                _b.trys.push([2, 9, 10, 11]);
                links_7 = __values(links), links_7_1 = links_7.next();
                _b.label = 3;
            case 3:
                if (!!links_7_1.done) return [3 /*break*/, 8];
                link = links_7_1.value;
                return [4 /*yield*/, teams.getProductById(link.productId)];
            case 4:
                product = _b.sent();
                if (!product) return [3 /*break*/, 6];
                date_5 = uploadDownload.formatDate(link.uploadTime);
                name_13 = "";
                if (type_1 === "demoVid") {
                    name_13 = product.startupName + "_tehnic_demo_video_" + date_5 + "." + link.extension;
                }
                else if (type_1 === "presVid") {
                    name_13 = product.startupName + "_products_presentation_video_" + date_5 + "." + link.extension;
                }
                else if (type_1 === "pres") {
                    name_13 = product.startupName + "_powerpoint_presentation_" + date_5 + "." + link.extension;
                }
                else if (type_1 === "image") {
                    zip.folder(product.startupName);
                    name_13 = product.startupName + "/" + product.startupName + "_products_image_" + link.uuid[0] + link.uuid[1] + link.uuid[2] + "_" + date_5 + "." + link.extension;
                }
                else if (type_1 === "logo") {
                    name_13 = product.startupName + "_logo_" + date_5 + "." + link.extension;
                }
                else {
                    name_13 = type_1 + link.extension;
                }
                return [4 /*yield*/, uploadDownload.getS3Object(link.uuid)];
            case 5:
                obj = _b.sent();
                if (obj !== "") {
                    zip.file(name_13, obj, { base64: true });
                }
                else {
                    res.status(404).send('No obj GETS3OBJ');
                }
                return [3 /*break*/, 7];
            case 6:
                res.status(500).send({ err: 500, data: null });
                _b.label = 7;
            case 7:
                links_7_1 = links_7.next();
                return [3 /*break*/, 3];
            case 8: return [3 /*break*/, 11];
            case 9:
                e_32_1 = _b.sent();
                e_32 = { error: e_32_1 };
                return [3 /*break*/, 11];
            case 10:
                try {
                    if (links_7_1 && !links_7_1.done && (_a = links_7.return)) _a.call(links_7);
                }
                finally { if (e_32) throw e_32.error; }
                return [7 /*endfinally*/];
            case 11:
                uuid_4 = uuid_1.v4();
                zip.generateNodeStream({ type: 'nodebuffer', streamFiles: true }).pipe(fs_extra_1.default.createWriteStream(path_1.default.join("/tmp", uuid_4 + '.zip'))).on('finish', function () { return __awaiter(void 0, void 0, void 0, function () {
                    var link, newLink, upload, tmpFile, url;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                console.log("Finished writing zip");
                                link = {
                                    uuid: type_1,
                                    productId: "7051998",
                                    fileType: type_1 + "_zip",
                                    extension: ".zip",
                                    uploadTime: new Date()
                                };
                                return [4 /*yield*/, uploadDownload.addLink(link)];
                            case 1:
                                newLink = _a.sent();
                                if (!newLink) return [3 /*break*/, 13];
                                upload = false;
                                tmpFile = path_1.default.join("/tmp", uuid_4 + ".zip");
                                return [4 /*yield*/, uploadDownload.addS3File(newLink.uuid, tmpFile, "path")];
                            case 2:
                                upload = _a.sent();
                                if (!upload) return [3 /*break*/, 9];
                                url = "";
                                return [4 /*yield*/, uploadDownload.getS3Url(newLink.uuid)];
                            case 3:
                                url = _a.sent();
                                if (!(url !== "")) return [3 /*break*/, 5];
                                return [4 /*yield*/, fs_extra_1.default.remove(tmpFile)];
                            case 4:
                                _a.sent();
                                res.status(200).send(url);
                                return [3 /*break*/, 8];
                            case 5: return [4 /*yield*/, uploadDownload.deleteLink(newLink.uuid)];
                            case 6:
                                _a.sent();
                                return [4 /*yield*/, fs_extra_1.default.remove(tmpFile)];
                            case 7:
                                _a.sent();
                                res.status(404).send('No url GETS3URL');
                                _a.label = 8;
                            case 8: return [3 /*break*/, 12];
                            case 9: return [4 /*yield*/, uploadDownload.deleteLink(newLink.uuid)];
                            case 10:
                                _a.sent();
                                return [4 /*yield*/, fs_extra_1.default.remove(tmpFile)];
                            case 11:
                                _a.sent();
                                res.status(404).send('Didn\'t upload ADDS3File');
                                _a.label = 12;
                            case 12: return [3 /*break*/, 14];
                            case 13:
                                res.status(404).send('Didn\'t create link ADDLINK');
                                _a.label = 14;
                            case 14: return [2 /*return*/];
                        }
                    });
                }); });
                return [3 /*break*/, 13];
            case 12:
                res.status(204).send(null);
                _b.label = 13;
            case 13: return [3 /*break*/, 15];
            case 14:
                e_33 = _b.sent();
                console.error(e_33);
                res.status(500).send({ err: 500, data: null });
                return [3 /*break*/, 15];
            case 15: return [2 /*return*/];
        }
    });
}); });
router.post("/download/zip/:city", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var city, businessTrack, workshopNo, semiFinals, finals, e_34;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                city = req.params.city;
                businessTrack = req.body.businessTrack;
                workshopNo = req.body.workshopNo;
                semiFinals = req.body.semiFinals;
                finals = req.body.finals;
                res.status(200).send('OK');
                return [4 /*yield*/, uploadDownload.checkCustomZip(city, businessTrack, workshopNo, semiFinals, finals)];
            case 1:
                _a.sent();
                return [3 /*break*/, 3];
            case 2:
                e_34 = _a.sent();
                console.error(e_34);
                res.status(500).send({ err: 500, data: null });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
router.post("/download/zip/", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var type, date, team, city, option, e_35;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                type = req.body.type;
                date = req.body.date;
                team = req.body.team;
                city = req.body.city;
                option = req.body.option;
                res.status(200).send('OK');
                return [4 /*yield*/, uploadDownload.checkZip(type, date, option, city, team)];
            case 1:
                _a.sent();
                return [3 /*break*/, 3];
            case 2:
                e_35 = _a.sent();
                console.error(e_35);
                res.status(500).send({ err: 500, data: null });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
router.post("/check/zip/status/", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var type, date, city, team, option, response, e_36;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                type = req.body.type;
                date = req.body.date;
                city = req.body.city;
                team = req.body.team;
                option = req.body.option;
                return [4 /*yield*/, uploadDownload.getZip(type, date, option, city, team)];
            case 1:
                response = _a.sent();
                console.log(response);
                if (response === "NOT_DONE") {
                    res.status(204).send(response);
                }
                else if (response === "ERROR") {
                    res.status(500).send({ err: 500, data: null });
                }
                else {
                    res.status(200).send(response);
                }
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
router.post("/download/team/zip/:type/:date", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var type_2, date_6, zip, exists, productId, product, uuid, link, oldDate, newDate, links, team, users_12, users_9, users_9_1, user, obj, name_14, e_37_1, links_8, links_8_1, link_1, product_1, date_7, name_15, obj, e_38_1, city, uuid, link, oldDate, newDate, products, products_4, products_4_1, product, prId, links, users_13, users_10, users_10_1, user, obj, name_16, e_39_1, links_9, links_9_1, link_2, date_8, name_17, e_40_1, e_41_1, uuid, link, oldDate, newDate, products, products_5, products_5_1, product, prId, links, users_14, folder, users_11, users_11_1, user, obj, name_18, e_42_1, links_10, links_10_1, link_3, date_9, name_19, obj, e_43_1, e_44_1, uuid_5, url, uuid, newLink, product, city, e_45;
    var e_37, _a, e_38, _b, e_41, _c, e_39, _d, e_40, _e, e_44, _f, e_42, _g, e_43, _h;
    return __generator(this, function (_j) {
        switch (_j.label) {
            case 0:
                _j.trys.push([0, 101, , 102]);
                type_2 = req.params.type;
                date_6 = req.params.date;
                zip = new jszip_1.default();
                exists = false;
                if (!(type_2 === "team")) return [3 /*break*/, 29];
                productId = req.body.productId;
                return [4 /*yield*/, teams.getProductById(productId)];
            case 1:
                product = _j.sent();
                uuid = void 0;
                if (product)
                    uuid = product.startupName + "_uploads_arhive";
                link = void 0;
                if (!uuid) return [3 /*break*/, 3];
                return [4 /*yield*/, uploadDownload.getLinkByUuid(uuid)];
            case 2:
                link = _j.sent();
                _j.label = 3;
            case 3:
                oldDate = 0;
                if (link)
                    oldDate = new Date(link.uploadTime).getTime();
                newDate = new Date().getTime();
                if (!(link && newDate - oldDate <= 86400000)) return [3 /*break*/, 4];
                exists = true;
                return [3 /*break*/, 28];
            case 4: return [4 /*yield*/, uploadDownload.getLinksByProductId(productId, date_6)];
            case 5:
                links = _j.sent();
                return [4 /*yield*/, teams.getTeamByProductId(productId)];
            case 6:
                team = _j.sent();
                if (!team) return [3 /*break*/, 8];
                return [4 /*yield*/, teams.getUsersByTeamId(team.teamId)];
            case 7:
                users_12 = _j.sent();
                _j.label = 8;
            case 8:
                if (!(team && users_12 && users_12.length !== 0)) return [3 /*break*/, 16];
                _j.label = 9;
            case 9:
                _j.trys.push([9, 14, 15, 16]);
                users_9 = __values(users_12), users_9_1 = users_9.next();
                _j.label = 10;
            case 10:
                if (!!users_9_1.done) return [3 /*break*/, 13];
                user = users_9_1.value;
                if (!user) return [3 /*break*/, 12];
                if (!(user.avatarUu !== '' && user.avatarUu !== null)) return [3 /*break*/, 12];
                return [4 /*yield*/, uploadDownload.getS3Object(user.avatarUu)];
            case 11:
                obj = _j.sent();
                name_14 = 'UserImages/' + team.location + "_" + team.teamName + '_profile_photo_' + user.firstName + "_" + user.lastName + '.png';
                if (obj !== "") {
                    zip.file(name_14, obj, { base64: true });
                }
                else {
                    res.status(404).send('No obj GETS3OBJ');
                }
                _j.label = 12;
            case 12:
                users_9_1 = users_9.next();
                return [3 /*break*/, 10];
            case 13: return [3 /*break*/, 16];
            case 14:
                e_37_1 = _j.sent();
                e_37 = { error: e_37_1 };
                return [3 /*break*/, 16];
            case 15:
                try {
                    if (users_9_1 && !users_9_1.done && (_a = users_9.return)) _a.call(users_9);
                }
                finally { if (e_37) throw e_37.error; }
                return [7 /*endfinally*/];
            case 16:
                if (!(links.length !== 0)) return [3 /*break*/, 27];
                zip.folder("Videos");
                zip.folder("Images");
                zip.folder("PowerPoint");
                _j.label = 17;
            case 17:
                _j.trys.push([17, 24, 25, 26]);
                links_8 = __values(links), links_8_1 = links_8.next();
                _j.label = 18;
            case 18:
                if (!!links_8_1.done) return [3 /*break*/, 23];
                link_1 = links_8_1.value;
                return [4 /*yield*/, teams.getProductById(link_1.productId)];
            case 19:
                product_1 = _j.sent();
                if (!(product_1 && team)) return [3 /*break*/, 21];
                date_7 = uploadDownload.formatDate(link_1.uploadTime);
                name_15 = "";
                if (link_1.fileType === "demoVid") {
                    name_15 = "Videos/" + team.location + "_" + product_1.startupName + "_tehnic_demo_video_" + date_7 + "." + link_1.extension;
                }
                else if (link_1.fileType === "presVid") {
                    name_15 = "Videos/" + team.location + "_" + product_1.startupName + "_products_presentation_video_" + date_7 + "." + link_1.extension;
                }
                else if (link_1.fileType === "pres") {
                    name_15 = "PowerPoint/" + team.location + "_" + product_1.startupName + "_powerpoint_presentation_" + date_7 + "." + link_1.extension;
                }
                else if (link_1.fileType === "image") {
                    name_15 = "Images/" + team.location + "_" + product_1.startupName + "_products_image_" + link_1.uuid[0] + link_1.uuid[1] + link_1.uuid[2] + "_" + date_7 + "." + link_1.extension;
                }
                else if (link_1.fileType === "logo") {
                    name_15 = "Images/" + team.location + "_" + product_1.startupName + "_logo_" + date_7 + "." + link_1.extension;
                }
                else {
                    res.status(400).send('Unidentified link');
                }
                return [4 /*yield*/, uploadDownload.getS3Object(link_1.uuid)];
            case 20:
                obj = _j.sent();
                if (obj !== "") {
                    zip.file(name_15, obj, { base64: true });
                }
                else {
                    res.status(404).send('No obj GETS3OBJ');
                }
                return [3 /*break*/, 22];
            case 21:
                res.status(500).send({ err: 500 });
                _j.label = 22;
            case 22:
                links_8_1 = links_8.next();
                return [3 /*break*/, 18];
            case 23: return [3 /*break*/, 26];
            case 24:
                e_38_1 = _j.sent();
                e_38 = { error: e_38_1 };
                return [3 /*break*/, 26];
            case 25:
                try {
                    if (links_8_1 && !links_8_1.done && (_b = links_8.return)) _b.call(links_8);
                }
                finally { if (e_38) throw e_38.error; }
                return [7 /*endfinally*/];
            case 26: return [3 /*break*/, 28];
            case 27:
                res.status(204).send(null);
                _j.label = 28;
            case 28: return [3 /*break*/, 88];
            case 29:
                if (!(type_2 === "city")) return [3 /*break*/, 58];
                city = req.body.city;
                uuid = city + "_uploads_arhive";
                return [4 /*yield*/, uploadDownload.getLinkByUuid(uuid)];
            case 30:
                link = _j.sent();
                oldDate = 0;
                if (link)
                    oldDate = new Date(link.uploadTime).getTime();
                newDate = new Date().getTime();
                if (!(link && newDate - oldDate <= 86400000)) return [3 /*break*/, 31];
                exists = true;
                return [3 /*break*/, 57];
            case 31: return [4 /*yield*/, teams.getTeamsByLocation(city)];
            case 32:
                products = _j.sent();
                _j.label = 33;
            case 33:
                _j.trys.push([33, 55, 56, 57]);
                products_4 = __values(products), products_4_1 = products_4.next();
                _j.label = 34;
            case 34:
                if (!!products_4_1.done) return [3 /*break*/, 54];
                product = products_4_1.value;
                prId = product.productId;
                return [4 /*yield*/, uploadDownload.getLinksByProductId(prId, date_6)];
            case 35:
                links = _j.sent();
                return [4 /*yield*/, teams.getUsersByTeamId(product.teamId)];
            case 36:
                users_13 = _j.sent();
                if (!(users_13.length !== 0)) return [3 /*break*/, 44];
                _j.label = 37;
            case 37:
                _j.trys.push([37, 42, 43, 44]);
                users_10 = (e_39 = void 0, __values(users_13)), users_10_1 = users_10.next();
                _j.label = 38;
            case 38:
                if (!!users_10_1.done) return [3 /*break*/, 41];
                user = users_10_1.value;
                if (!user) return [3 /*break*/, 40];
                if (!(user.avatarUu !== '' && user.avatarUu !== null)) return [3 /*break*/, 40];
                return [4 /*yield*/, uploadDownload.getS3Object(user.avatarUu)];
            case 39:
                obj = _j.sent();
                name_16 = product.teamName + '/UserImages/' + product.location + "_" + product.teamName + '_profile_photo_' + user.firstName + "_" + user.lastName + '.png';
                if (obj !== "") {
                    zip.file(name_16, obj, { base64: true });
                }
                else {
                    res.status(404).send('No obj GETS3OBJ');
                }
                _j.label = 40;
            case 40:
                users_10_1 = users_10.next();
                return [3 /*break*/, 38];
            case 41: return [3 /*break*/, 44];
            case 42:
                e_39_1 = _j.sent();
                e_39 = { error: e_39_1 };
                return [3 /*break*/, 44];
            case 43:
                try {
                    if (users_10_1 && !users_10_1.done && (_d = users_10.return)) _d.call(users_10);
                }
                finally { if (e_39) throw e_39.error; }
                return [7 /*endfinally*/];
            case 44:
                if (!(links.length !== 0)) return [3 /*break*/, 53];
                zip.folder(product.teamName);
                zip.folder(product.teamName + "/Videos");
                zip.folder(product.teamName + "/Images");
                zip.folder(product.teamName + "/PowerPoint");
                _j.label = 45;
            case 45:
                _j.trys.push([45, 51, 52, 53]);
                links_9 = (e_40 = void 0, __values(links)), links_9_1 = links_9.next();
                _j.label = 46;
            case 46:
                if (!!links_9_1.done) return [3 /*break*/, 50];
                link_2 = links_9_1.value;
                if (!(prId !== "" && product !== undefined)) return [3 /*break*/, 48];
                date_8 = uploadDownload.formatDate(link_2.uploadTime);
                name_17 = "";
                console.log(name_17 + " ");
                if (link_2.fileType === "demoVid") {
                    name_17 = product.teamName + '/Videos/' + product.location + "_" + product.teamName + "_tehnic_demo_video_" + date_8 + "." + link_2.extension;
                }
                else if (link_2.fileType === "presVid") {
                    name_17 = product.teamName + '/Videos/' + product.location + "_" + product.teamName + "_products_presentation_video_" + date_8 + "." + link_2.extension;
                }
                else if (link_2.fileType === "pres") {
                    name_17 = product.teamName + '/PowerPoint/' + product.location + "_" + product.teamName + "_powerpoint_presentation_" + date_8 + "." + link_2.extension;
                }
                else if (link_2.fileType === "image") {
                    name_17 = product.teamName + '/Images/' + product.location + "_" + product.teamName + "_products_image_" + link_2.uuid[0] + link_2.uuid[1] + link_2.uuid[2] + "_" + date_8 + "." + link_2.extension;
                }
                else if (link_2.fileType === "logo") {
                    name_17 = product.teamName + '/Images/' + product.location + "_" + product.teamName + "_logo_" + date_8 + "." + link_2.extension;
                }
                else {
                    res.status(400).send('Unidentified link');
                }
                return [4 /*yield*/, uploadDownload.getS3Object(link_2.uuid)];
            case 47:
                _j.sent();
                return [3 /*break*/, 49];
            case 48:
                res.status(500).send({ err: 500 });
                _j.label = 49;
            case 49:
                links_9_1 = links_9.next();
                return [3 /*break*/, 46];
            case 50: return [3 /*break*/, 53];
            case 51:
                e_40_1 = _j.sent();
                e_40 = { error: e_40_1 };
                return [3 /*break*/, 53];
            case 52:
                try {
                    if (links_9_1 && !links_9_1.done && (_e = links_9.return)) _e.call(links_9);
                }
                finally { if (e_40) throw e_40.error; }
                return [7 /*endfinally*/];
            case 53:
                products_4_1 = products_4.next();
                return [3 /*break*/, 34];
            case 54: return [3 /*break*/, 57];
            case 55:
                e_41_1 = _j.sent();
                e_41 = { error: e_41_1 };
                return [3 /*break*/, 57];
            case 56:
                try {
                    if (products_4_1 && !products_4_1.done && (_c = products_4.return)) _c.call(products_4);
                }
                finally { if (e_41) throw e_41.error; }
                return [7 /*endfinally*/];
            case 57: return [3 /*break*/, 88];
            case 58:
                if (!(type_2 === "all")) return [3 /*break*/, 87];
                uuid = "all_uploads_arhive_" + date_6;
                return [4 /*yield*/, uploadDownload.getLinkByUuid(uuid)];
            case 59:
                link = _j.sent();
                oldDate = 0;
                if (link)
                    oldDate = new Date(link.uploadTime).getTime();
                newDate = new Date().getTime();
                if (!(link && newDate - oldDate <= 86400000)) return [3 /*break*/, 60];
                exists = true;
                return [3 /*break*/, 86];
            case 60: return [4 /*yield*/, teams.getTeams()];
            case 61:
                products = _j.sent();
                _j.label = 62;
            case 62:
                _j.trys.push([62, 84, 85, 86]);
                products_5 = __values(products), products_5_1 = products_5.next();
                _j.label = 63;
            case 63:
                if (!!products_5_1.done) return [3 /*break*/, 83];
                product = products_5_1.value;
                prId = product.productId;
                return [4 /*yield*/, uploadDownload.getLinksByProductId(prId, date_6)];
            case 64:
                links = _j.sent();
                return [4 /*yield*/, teams.getUsersByTeamId(product.teamId)];
            case 65:
                users_14 = _j.sent();
                folder = product.location + '/' + product.teamName;
                if (!(users_14.length !== 0)) return [3 /*break*/, 73];
                _j.label = 66;
            case 66:
                _j.trys.push([66, 71, 72, 73]);
                users_11 = (e_42 = void 0, __values(users_14)), users_11_1 = users_11.next();
                _j.label = 67;
            case 67:
                if (!!users_11_1.done) return [3 /*break*/, 70];
                user = users_11_1.value;
                if (!user) return [3 /*break*/, 69];
                if (!(user.avatarUu !== '' && user.avatarUu !== null)) return [3 /*break*/, 69];
                return [4 /*yield*/, uploadDownload.getS3Object(user.avatarUu)];
            case 68:
                obj = _j.sent();
                name_18 = folder + '/UserImages/' + product.location + "_" + product.teamName + '_profile_photo_' + user.firstName + "_" + user.lastName + '.png';
                if (obj !== "") {
                    zip.file(name_18, obj, { base64: true });
                }
                else {
                    res.status(404).send('No obj GETS3OBJ');
                }
                _j.label = 69;
            case 69:
                users_11_1 = users_11.next();
                return [3 /*break*/, 67];
            case 70: return [3 /*break*/, 73];
            case 71:
                e_42_1 = _j.sent();
                e_42 = { error: e_42_1 };
                return [3 /*break*/, 73];
            case 72:
                try {
                    if (users_11_1 && !users_11_1.done && (_g = users_11.return)) _g.call(users_11);
                }
                finally { if (e_42) throw e_42.error; }
                return [7 /*endfinally*/];
            case 73:
                if (!(links.length !== 0)) return [3 /*break*/, 82];
                zip.folder(folder);
                zip.folder(folder + "/Videos");
                zip.folder(folder + "/Images");
                zip.folder(folder + "/PowerPoint");
                _j.label = 74;
            case 74:
                _j.trys.push([74, 80, 81, 82]);
                links_10 = (e_43 = void 0, __values(links)), links_10_1 = links_10.next();
                _j.label = 75;
            case 75:
                if (!!links_10_1.done) return [3 /*break*/, 79];
                link_3 = links_10_1.value;
                if (!(prId !== "" && product !== undefined)) return [3 /*break*/, 77];
                date_9 = uploadDownload.formatDate(link_3.uploadTime);
                name_19 = "";
                if (link_3.fileType === "demoVid") {
                    name_19 = folder + '/Videos/' + product.location + "_" + product.teamName + "_tehnic_demo_video_" + date_9 + "." + link_3.extension;
                }
                else if (link_3.fileType === "presVid") {
                    name_19 = folder + '/Videos/' + product.location + "_" + product.teamName + "_products_presentation_video_" + date_9 + "." + link_3.extension;
                }
                else if (link_3.fileType === "pres") {
                    name_19 = folder + '/PowerPoint/' + product.location + "_" + product.teamName + "_powerpoint_presentation_" + date_9 + "." + link_3.extension;
                }
                else if (link_3.fileType === "image") {
                    name_19 = folder + '/Images/' + product.location + "_" + product.teamName + "_products_image_" + link_3.uuid[0] + link_3.uuid[1] + link_3.uuid[2] + "_" + date_9 + "." + link_3.extension;
                }
                else if (link_3.fileType === "logo") {
                    name_19 = folder + '/Images/' + product.location + "_" + product.teamName + "_logo_" + date_9 + "." + link_3.extension;
                }
                else {
                    res.status(400).send('Unidentified link');
                }
                return [4 /*yield*/, uploadDownload.getS3Object(link_3.uuid)];
            case 76:
                obj = _j.sent();
                if (obj !== "") {
                    zip.file(name_19, obj, { base64: true });
                }
                else {
                    res.status(404).send('No obj GETS3OBJ');
                }
                return [3 /*break*/, 78];
            case 77:
                res.status(500).send({ err: 500 });
                _j.label = 78;
            case 78:
                links_10_1 = links_10.next();
                return [3 /*break*/, 75];
            case 79: return [3 /*break*/, 82];
            case 80:
                e_43_1 = _j.sent();
                e_43 = { error: e_43_1 };
                return [3 /*break*/, 82];
            case 81:
                try {
                    if (links_10_1 && !links_10_1.done && (_h = links_10.return)) _h.call(links_10);
                }
                finally { if (e_43) throw e_43.error; }
                return [7 /*endfinally*/];
            case 82:
                products_5_1 = products_5.next();
                return [3 /*break*/, 63];
            case 83: return [3 /*break*/, 86];
            case 84:
                e_44_1 = _j.sent();
                e_44 = { error: e_44_1 };
                return [3 /*break*/, 86];
            case 85:
                try {
                    if (products_5_1 && !products_5_1.done && (_f = products_5.return)) _f.call(products_5);
                }
                finally { if (e_44) throw e_44.error; }
                return [7 /*endfinally*/];
            case 86: return [3 /*break*/, 88];
            case 87:
                res.status(400).send("Invalid type");
                _j.label = 88;
            case 88:
                if (!!exists) return [3 /*break*/, 89];
                uuid_5 = uuid_1.v4();
                if (Object.keys(zip.files).length !== 0)
                    zip.generateNodeStream({ type: 'nodebuffer', streamFiles: true }).pipe(fs_extra_1.default.createWriteStream(path_1.default.join("/tmp", uuid_5 + '.zip'))).on('finish', function () { return __awaiter(void 0, void 0, void 0, function () {
                        var linkUuid, productId, product, city, link, newLink, upload, tmpFile, url;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    console.log("Finished writing zip");
                                    console.log("Trying to send zip");
                                    linkUuid = '';
                                    if (!(type_2 === "team")) return [3 /*break*/, 2];
                                    productId = req.body.productId;
                                    return [4 /*yield*/, teams.getProductById(productId)];
                                case 1:
                                    product = _a.sent();
                                    if (product)
                                        linkUuid = (product).startupName + "_uploads_arhive";
                                    return [3 /*break*/, 3];
                                case 2:
                                    if (type_2 === "city") {
                                        city = req.body.city;
                                        linkUuid = city + "_uploads_arhive_" + date_6;
                                    }
                                    else if (type_2 === "all") {
                                        linkUuid = "all_uploads_arhive_" + date_6;
                                    }
                                    _a.label = 3;
                                case 3:
                                    link = {
                                        uuid: linkUuid,
                                        productId: "7051998",
                                        fileType: linkUuid + "_zip",
                                        extension: ".zip",
                                        uploadTime: new Date()
                                    };
                                    return [4 /*yield*/, uploadDownload.addLink(link)];
                                case 4:
                                    newLink = _a.sent();
                                    if (!newLink) return [3 /*break*/, 16];
                                    upload = false;
                                    tmpFile = path_1.default.join("/tmp", uuid_5 + ".zip");
                                    return [4 /*yield*/, uploadDownload.addS3File(newLink.uuid, tmpFile, "path")];
                                case 5:
                                    upload = _a.sent();
                                    if (!upload) return [3 /*break*/, 12];
                                    url = "";
                                    return [4 /*yield*/, uploadDownload.getS3Url(newLink.uuid)];
                                case 6:
                                    url = _a.sent();
                                    if (!(url !== "")) return [3 /*break*/, 8];
                                    return [4 /*yield*/, fs_extra_1.default.remove(tmpFile)];
                                case 7:
                                    _a.sent();
                                    res.status(200).send({ url: url });
                                    return [3 /*break*/, 11];
                                case 8: return [4 /*yield*/, uploadDownload.deleteLink(newLink.uuid)];
                                case 9:
                                    _a.sent();
                                    return [4 /*yield*/, fs_extra_1.default.remove(tmpFile)];
                                case 10:
                                    _a.sent();
                                    res.status(404).send('No url GETS3URL');
                                    _a.label = 11;
                                case 11: return [3 /*break*/, 15];
                                case 12: return [4 /*yield*/, uploadDownload.deleteLink(newLink.uuid)];
                                case 13:
                                    _a.sent();
                                    return [4 /*yield*/, fs_extra_1.default.remove(tmpFile)];
                                case 14:
                                    _a.sent();
                                    res.status(404).send('Didn\'t upload ADDS3File');
                                    _a.label = 15;
                                case 15: return [3 /*break*/, 17];
                                case 16:
                                    res.status(404).send('Didn\'t create link ADDLINK');
                                    _a.label = 17;
                                case 17: return [2 /*return*/];
                            }
                        });
                    }); });
                else {
                    res.status(204).send(null);
                }
                return [3 /*break*/, 100];
            case 89:
                url = "";
                uuid = "";
                newLink = null;
                if (!(type_2 === "team")) return [3 /*break*/, 91];
                return [4 /*yield*/, teams.getProductById(req.body.productId)];
            case 90:
                product = _j.sent();
                if (product)
                    uuid = product.startupName + "_uploads_arhive";
                return [3 /*break*/, 92];
            case 91:
                if (type_2 === "city") {
                    city = req.body.city;
                    uuid = city + "_uploads_arhive_" + date_6;
                }
                else if (type_2 === "all") {
                    uuid = "all_uploads_arhive_" + date_6;
                }
                _j.label = 92;
            case 92:
                if (!(uuid !== '')) return [3 /*break*/, 94];
                return [4 /*yield*/, uploadDownload.getLinkByUuid(uuid)];
            case 93:
                newLink = _j.sent();
                _j.label = 94;
            case 94:
                if (!newLink) return [3 /*break*/, 96];
                return [4 /*yield*/, uploadDownload.getS3Url(newLink.uuid)];
            case 95:
                url = _j.sent();
                _j.label = 96;
            case 96:
                if (!(url !== "")) return [3 /*break*/, 97];
                res.status(200).send(url);
                return [3 /*break*/, 100];
            case 97:
                if (!newLink) return [3 /*break*/, 99];
                return [4 /*yield*/, uploadDownload.deleteLink(newLink.uuid)];
            case 98:
                _j.sent();
                _j.label = 99;
            case 99:
                res.status(404).send('No url GETS3URL');
                _j.label = 100;
            case 100: return [3 /*break*/, 102];
            case 101:
                e_45 = _j.sent();
                console.error(e_45);
                res.status(500).send({ err: 500, data: null });
                return [3 /*break*/, 102];
            case 102: return [2 /*return*/];
        }
    });
}); });
router.post("/upload/file/chunk", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var end, fileName, base64, data, checkDir, fileType_1, productId_1, filePath_1, width_1, height_1, checkFile, e_46, link, links, file, name_20, tmpFile, newLink, upload, e_47;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 38, , 39]);
                end = req.body.finish;
                fileName = req.body.fileName;
                if (!!end) return [3 /*break*/, 5];
                base64 = req.body.base64Encode;
                data = Buffer.from(base64, "base64");
                return [4 /*yield*/, fs_extra_1.default.pathExists('./tmp')];
            case 1:
                checkDir = _a.sent();
                if (!!checkDir) return [3 /*break*/, 3];
                return [4 /*yield*/, fs_extra_1.default.mkdir('./tmp')];
            case 2:
                _a.sent();
                _a.label = 3;
            case 3: return [4 /*yield*/, fs_extra_1.default.appendFile(path_1.default.join("./tmp", fileName), data)];
            case 4:
                _a.sent();
                res.status(202).send(true);
                return [3 /*break*/, 37];
            case 5:
                fileType_1 = req.body.fileType;
                productId_1 = req.body.productId;
                filePath_1 = path_1.default.join('./tmp', fileName);
                if (!(fileType_1 !== 'pres')) return [3 /*break*/, 11];
                return [4 /*yield*/, fs_extra_1.default.pathExists(filePath_1)];
            case 6:
                checkFile = _a.sent();
                if (!checkFile) {
                    console.error("No file");
                    res.status(404).send({ err: 404, data: false });
                }
                _a.label = 7;
            case 7:
                _a.trys.push([7, 9, , 10]);
                // as any because no ffmpeg types
                return [4 /*yield*/, fluent_ffmpeg_1.default(filePath_1).ffprobe(function (err, metadata) {
                        return __awaiter(this, void 0, void 0, function () {
                            var link, links, file, name_21, tmpFile, newLink, upload;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, metadata.streams[0].width];
                                    case 1:
                                        width_1 = _a.sent();
                                        return [4 /*yield*/, metadata.streams[0].height];
                                    case 2:
                                        height_1 = _a.sent();
                                        if (!(width_1 === undefined || height_1 === undefined)) return [3 /*break*/, 7];
                                        return [4 /*yield*/, metadata.streams[1].width];
                                    case 3:
                                        width_1 = _a.sent();
                                        return [4 /*yield*/, metadata.streams[1].height];
                                    case 4:
                                        height_1 = _a.sent();
                                        if (!(width_1 === undefined || height_1 === undefined)) return [3 /*break*/, 7];
                                        return [4 /*yield*/, metadata.streams[2].width];
                                    case 5:
                                        width_1 = _a.sent();
                                        return [4 /*yield*/, metadata.streams[2].height];
                                    case 6:
                                        height_1 = _a.sent();
                                        _a.label = 7;
                                    case 7:
                                        console.log(width_1);
                                        console.log(height_1);
                                        if (!((width_1 !== 0 && width_1 >= 1280) && (height_1 !== 0 && height_1 >= 720))) return [3 /*break*/, 34];
                                        link = {
                                            uuid: "",
                                            productId: productId_1,
                                            fileType: fileType_1,
                                            extension: req.body.ext,
                                            uploadTime: new Date()
                                        };
                                        if (!(fileType_1 === "demoVid" || fileType_1 === "presVid" || fileType_1 === "logo")) return [3 /*break*/, 23];
                                        console.log(fileType_1);
                                        return [4 /*yield*/, uploadDownload.getLinksByProductIdAndFileType(productId_1, fileType_1)];
                                    case 8:
                                        links = _a.sent();
                                        if (!(links.length > 0)) return [3 /*break*/, 23];
                                        return [4 /*yield*/, uploadDownload.getS3Object(links[0].uuid)];
                                    case 9:
                                        file = _a.sent();
                                        if (!(file !== "")) return [3 /*break*/, 20];
                                        return [4 /*yield*/, uploadDownload.deleteS3File(links[0].uuid)];
                                    case 10:
                                        if (!_a.sent()) return [3 /*break*/, 17];
                                        return [4 /*yield*/, uploadDownload.deleteLink(links[0].uuid)];
                                    case 11:
                                        if (!!(_a.sent())) return [3 /*break*/, 16];
                                        name_21 = uuid_1.v4();
                                        tmpFile = path_1.default.join("/tmp", name_21);
                                        return [4 /*yield*/, fs_extra_1.default.writeFile(tmpFile, file)];
                                    case 12:
                                        _a.sent();
                                        return [4 /*yield*/, uploadDownload.addS3File(links[0].uuid, tmpFile, "path")];
                                    case 13:
                                        _a.sent();
                                        return [4 /*yield*/, fs_extra_1.default.remove(filePath_1)];
                                    case 14:
                                        _a.sent();
                                        return [4 /*yield*/, fs_extra_1.default.remove(tmpFile)];
                                    case 15:
                                        _a.sent();
                                        res.status(500).send({ err: 500, data: false });
                                        _a.label = 16;
                                    case 16: return [3 /*break*/, 19];
                                    case 17: return [4 /*yield*/, fs_extra_1.default.remove(filePath_1)];
                                    case 18:
                                        _a.sent();
                                        res.status(500).send({ err: 500, data: false });
                                        _a.label = 19;
                                    case 19: return [3 /*break*/, 23];
                                    case 20: return [4 /*yield*/, uploadDownload.deleteLink(links[0].uuid)];
                                    case 21:
                                        if (!!(_a.sent())) return [3 /*break*/, 23];
                                        return [4 /*yield*/, fs_extra_1.default.remove(filePath_1)];
                                    case 22:
                                        _a.sent();
                                        res.status(500).send({ err: 500, data: false });
                                        _a.label = 23;
                                    case 23: return [4 /*yield*/, uploadDownload.addLink(link)];
                                    case 24:
                                        newLink = _a.sent();
                                        if (!newLink) return [3 /*break*/, 31];
                                        return [4 /*yield*/, uploadDownload.addS3File(link.uuid, filePath_1, "path")];
                                    case 25:
                                        upload = _a.sent();
                                        if (!upload) return [3 /*break*/, 27];
                                        return [4 /*yield*/, fs_extra_1.default.remove(filePath_1)];
                                    case 26:
                                        _a.sent();
                                        res.status(200).send();
                                        return [3 /*break*/, 30];
                                    case 27: return [4 /*yield*/, uploadDownload.deleteLink(newLink.uuid)];
                                    case 28:
                                        _a.sent();
                                        return [4 /*yield*/, fs_extra_1.default.remove(filePath_1)];
                                    case 29:
                                        _a.sent();
                                        res.status(404).send({ err: 404, data: false });
                                        _a.label = 30;
                                    case 30: return [3 /*break*/, 33];
                                    case 31: return [4 /*yield*/, fs_extra_1.default.remove(filePath_1)];
                                    case 32:
                                        _a.sent();
                                        res.status(404).send({ err: 404, data: false });
                                        _a.label = 33;
                                    case 33: return [3 /*break*/, 38];
                                    case 34:
                                        if (!(height_1 === 0 || width_1 === 0)) return [3 /*break*/, 36];
                                        return [4 /*yield*/, fs_extra_1.default.remove(filePath_1)];
                                    case 35:
                                        _a.sent();
                                        res.status(405).send({ err: 405, data: false });
                                        return [3 /*break*/, 38];
                                    case 36: return [4 /*yield*/, fs_extra_1.default.remove(filePath_1)];
                                    case 37:
                                        _a.sent();
                                        res.status(406).send({ err: 406, data: false });
                                        _a.label = 38;
                                    case 38: return [2 /*return*/];
                                }
                            });
                        });
                    })];
            case 8:
                // as any because no ffmpeg types
                _a.sent();
                return [3 /*break*/, 10];
            case 9:
                e_46 = _a.sent();
                console.error(e_46);
                res.status(500).send({ err: 500, data: false });
                return [3 /*break*/, 10];
            case 10: return [3 /*break*/, 37];
            case 11:
                link = {
                    uuid: "",
                    productId: productId_1,
                    fileType: fileType_1,
                    extension: req.body.ext,
                    uploadTime: new Date()
                };
                return [4 /*yield*/, uploadDownload.getLinksByProductIdAndFileType(productId_1, fileType_1)];
            case 12:
                links = _a.sent();
                if (!(links.length > 0)) return [3 /*break*/, 27];
                return [4 /*yield*/, uploadDownload.getS3Object(links[0].uuid)];
            case 13:
                file = _a.sent();
                if (!(file !== "")) return [3 /*break*/, 24];
                return [4 /*yield*/, uploadDownload.deleteS3File(links[0].uuid)];
            case 14:
                if (!_a.sent()) return [3 /*break*/, 21];
                return [4 /*yield*/, uploadDownload.deleteLink(links[0].uuid)];
            case 15:
                if (!!(_a.sent())) return [3 /*break*/, 20];
                name_20 = uuid_1.v4();
                tmpFile = path_1.default.join("/tmp", name_20);
                return [4 /*yield*/, fs_extra_1.default.writeFile(tmpFile, file)];
            case 16:
                _a.sent();
                return [4 /*yield*/, uploadDownload.addS3File(links[0].uuid, tmpFile, "path")];
            case 17:
                _a.sent();
                return [4 /*yield*/, fs_extra_1.default.remove(filePath_1)];
            case 18:
                _a.sent();
                return [4 /*yield*/, fs_extra_1.default.remove(tmpFile)];
            case 19:
                _a.sent();
                res.status(500).send({ err: 500, data: false });
                _a.label = 20;
            case 20: return [3 /*break*/, 23];
            case 21: return [4 /*yield*/, fs_extra_1.default.remove(filePath_1)];
            case 22:
                _a.sent();
                res.status(500).send({ err: 500, data: false });
                _a.label = 23;
            case 23: return [3 /*break*/, 27];
            case 24: return [4 /*yield*/, uploadDownload.deleteLink(links[0].uuid)];
            case 25:
                if (!!(_a.sent())) return [3 /*break*/, 27];
                return [4 /*yield*/, fs_extra_1.default.remove(filePath_1)];
            case 26:
                _a.sent();
                res.status(500).send({ err: 500, data: false });
                _a.label = 27;
            case 27: return [4 /*yield*/, uploadDownload.addLink(link)];
            case 28:
                newLink = _a.sent();
                if (!newLink) return [3 /*break*/, 35];
                upload = false;
                if (!(filePath_1 !== "")) return [3 /*break*/, 34];
                return [4 /*yield*/, uploadDownload.addS3File(link.uuid, filePath_1, "path")];
            case 29:
                upload = _a.sent();
                if (!upload) return [3 /*break*/, 31];
                return [4 /*yield*/, fs_extra_1.default.remove(filePath_1)];
            case 30:
                _a.sent();
                res.status(200).send();
                return [3 /*break*/, 34];
            case 31: return [4 /*yield*/, uploadDownload.deleteLink(newLink.uuid)];
            case 32:
                _a.sent();
                return [4 /*yield*/, fs_extra_1.default.remove(filePath_1)];
            case 33:
                _a.sent();
                res.status(404).send({ err: 404, data: false });
                _a.label = 34;
            case 34: return [3 /*break*/, 37];
            case 35: return [4 /*yield*/, fs_extra_1.default.remove(filePath_1)];
            case 36:
                _a.sent();
                res.status(404).send({ err: 404, data: false });
                _a.label = 37;
            case 37: return [3 /*break*/, 39];
            case 38:
                e_47 = _a.sent();
                console.error(e_47);
                res.status(500).send({ err: 500, data: false });
                return [3 /*break*/, 39];
            case 39: return [2 /*return*/];
        }
    });
}); });
router.post("/upload/file/user/avatar", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var base64Encode, userId, uuid, upload, user, e_48;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 11, , 12]);
                base64Encode = req.body.base64Encode;
                userId = req.body.userId;
                if (!(base64Encode !== "" && base64Encode !== undefined && userId !== "" && userId !== undefined)) return [3 /*break*/, 9];
                uuid = uuid_1.v4();
                if (!(uuid !== "")) return [3 /*break*/, 7];
                return [4 /*yield*/, uploadDownload.addS3File(uuid, base64Encode, "base64")];
            case 1:
                upload = _a.sent();
                if (!upload) return [3 /*break*/, 5];
                return [4 /*yield*/, users.getUserById(userId)];
            case 2:
                user = _a.sent();
                if (!user) return [3 /*break*/, 4];
                user.avatarUu = uuid;
                return [4 /*yield*/, users.modifyUser(user)];
            case 3:
                _a.sent();
                _a.label = 4;
            case 4:
                res.status(200).send(true);
                return [3 /*break*/, 6];
            case 5:
                res.status(500).send({ err: 500, data: false });
                _a.label = 6;
            case 6: return [3 /*break*/, 8];
            case 7:
                res.status(500).send({ err: 500, data: false });
                _a.label = 8;
            case 8: return [3 /*break*/, 10];
            case 9:
                res.status(400).send({ err: 400, data: false });
                _a.label = 10;
            case 10: return [3 /*break*/, 12];
            case 11:
                e_48 = _a.sent();
                console.error(e_48);
                res.status(500).send({ err: 500, data: false });
                return [3 /*break*/, 12];
            case 12: return [2 /*return*/];
        }
    });
}); });
router.post("/get/file/user/avatar", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, user, uuid, string, e_49;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 7, , 8]);
                userId = req.body.userId;
                if (!(userId !== "" && userId !== undefined)) return [3 /*break*/, 5];
                return [4 /*yield*/, users.getUserById(userId)];
            case 1:
                user = _a.sent();
                uuid = void 0;
                if (user)
                    uuid = user.avatarUu;
                if (!(uuid !== "" && uuid !== null && uuid !== undefined)) return [3 /*break*/, 3];
                return [4 /*yield*/, uploadDownload.getS3Url(uuid, userId)];
            case 2:
                string = _a.sent();
                if (string !== "") {
                    res.status(200).send(string);
                }
                else
                    res.status(500).send({ err: 500, data: null });
                return [3 /*break*/, 4];
            case 3:
                res.status(204).send(null);
                _a.label = 4;
            case 4: return [3 /*break*/, 6];
            case 5:
                res.status(204).send(null);
                _a.label = 6;
            case 6: return [3 /*break*/, 8];
            case 7:
                e_49 = _a.sent();
                console.error(e_49);
                res.status(500).send({ err: 500, data: null });
                return [3 /*break*/, 8];
            case 8: return [2 /*return*/];
        }
    });
}); });
var server = server_1.Server.getInstance();
server.registerRouterAPI(1, router, "/uploadDownload");
//# sourceMappingURL=server.js.map