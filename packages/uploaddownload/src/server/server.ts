// import { Team } from "./server_types";
import { Router } from "express";
import { UploadDownloadLink } from "../common";
import { v4 as uiidv4} from "uuid";
import { Readable } from "stream";
import AWS from "aws-sdk";
import ffmpeg from "fluent-ffmpeg";
import fs from "fs-extra";
import path from "path";
import jszip from "jszip";
import { Server, ApiRequest, ApiResponse } from "@startupway/main/lib/server";
import { getPool } from "@startupway/database/lib/server";
import { QueryOptions, PoolConnection } from "mariadb";
import { getAuthorizationFunction, UsersServer } from "@startupway/users/lib/server";
import { TeamsServer } from "@startupway/teams/lib/server";

export class UploadDownloadServer {

	private static INSTANCE?: UploadDownloadServer;

	private static zips:{[key:string]:jszip | null} = {
		"all_uploads_arhive_none":null,
		"all_uploads_arhive_may":null,
		"all_uploads_arhive_oct":null,
		"Bucharest_uploads_arhive_none":null,
		"Bucharest_uploads_arhive_may":null,
		"Bucharest_uploads_arhive_oct":null,
		"Sibiu_uploads_arhive_none":null,
		"Sibiu_uploads_arhive_may":null,
		"Sibiu_uploads_arhive_oct":null,
		"Iasi_uploads_arhive_none":null,
		"Iasi_uploads_arhive_may":null,
		"Iasi_uploads_arhive_oct":null,
		"Cluj_uploads_arhive_none":null,
		"Cluj_uploads_arhive_may":null,
		"Cluj_uploads_arhive_oct":null,
		"Timisoara_uploads_arhive_none":null,
		"Timisoara_uploads_arhive_may":null,
		"Timisoara_uploads_arhive_oct":null,
		"demoday_uploads_arhive":null
	};
	formatDate(date: Date):string {
		const year = date.getFullYear(); 
		const month = date.getMonth() + 1;
		const day = date.getDate()
		return year + "-" + month + "-" + day;
	}
	async checkZipsDB():Promise<boolean> {
		let conn:PoolConnection | null = null;
		try {
			conn = await getPool().getConnection();
			if(conn) {
				const queryOptions:QueryOptions = {
					sql: "SELECT uploadDownload.* FROM uploadDownload where uploadDownload.productId=:productId"
				}
				let links = await conn.query(queryOptions, {productId:"7051998"});
				if(links.length > 0) {
					for(const link of links) {
						if(link.uuid !== '') {
							if(UploadDownloadServer.zips[link.uuid] === undefined) {
								UploadDownloadServer.zips[link.uuid] = null;
							}
						}
					}
				}
				return true;
			} else {
				return false;
			}
		} catch (e) {
			console.error(e);
			return false;
		} finally {
			if(conn)
				conn.release();
		}
	}
	async addLink(uploadDownloadLink:UploadDownloadLink): Promise<UploadDownloadLink | null> {
		let conn:PoolConnection | null = null;
		try {
			conn = await getPool().getConnection();
			if(conn) {
				await conn.beginTransaction();
				if(uploadDownloadLink.uuid === "") {
					const uuid= uiidv4();
					uploadDownloadLink.uuid = uuid;
				}
				const queryOptions:QueryOptions = {
					namedPlaceholders:true,
					sql: `INSERT INTO uploadDownload (uuid,productId,fileType,extension,uploadTime) values(:uuid,:productId,:fileType,:extension,:uploadTime)`
				}
				await conn.query(queryOptions, uploadDownloadLink);
				queryOptions.sql = "SELECT uuid,productId,fileType,extension,uploadTime FROM uploadDownload WHERE uuid=:uuid"
				const response:UploadDownloadLink[] = await conn.query(queryOptions, {uuid:uploadDownloadLink.uuid});
				if(response && response.length > 0 && response[0]){
					await conn.commit();
					return response[0];
				} else {
					await conn.rollback();
					return null;
				}
			} else {
				return null;
			}
		} catch (e) {
			console.error(e);
			if(conn) {
				await conn.rollback();
			}
			return null;
		} finally {
			if(conn)
				conn.release();
		}
	}
	async deleteLink(uuid:string): Promise<Boolean> {
		let conn:PoolConnection | null = null;
		try {
			conn = await getPool().getConnection();
			if(conn) {
				await conn.beginTransaction();
				const queryOptions:QueryOptions = {
					namedPlaceholders:true,
					sql: "DELETE FROM uploadDownload where uuid=:uuid"
				}
				await conn.query(queryOptions,{uuid});
				queryOptions.sql = "SELECT uuid as deleted_id FROM uploadDownload WHERE uuid=:uuid";
				const response:{deleted_id:string}[] = await conn.query(queryOptions,{uuid});
				if(response && response.length === 0) {
					await conn.commit();
					return true;
				} else {
					await conn.rollback();
					return false;
				}
			} else {
				return false;
			}
		} catch (error) {
			console.error(error);
			if(conn) {
				await conn.rollback();
			}
			return false;
		} finally {
			if(conn)
				conn.release();
		}
	}
	async getLinkByUuid(uuid:string): Promise<UploadDownloadLink | null> {
		let conn:PoolConnection | null = null;
		try {
			conn = await getPool().getConnection();
			if(conn) {
				const queryOptions:QueryOptions = {
					namedPlaceholders:true,
					sql: "SELECT * FROM uploadDownload WHERE uuid=:uuid"
				};
				const uploadDownloadLink:UploadDownloadLink[] = await conn.query(queryOptions,{uuid}) as UploadDownloadLink[];
				if(uploadDownloadLink && uploadDownloadLink.length > 0 && uploadDownloadLink[0]) {
					return uploadDownloadLink[0];
				} else {
					return null;
				}
			} else {
				return null;
			}
		} catch (error) {
			console.error(error);
			return null;
		} finally {
			if(conn)
				conn.release();
		}
	}

	async getLinksByProductIdAndFileType(productId:string, fileType:string): Promise<UploadDownloadLink[]> {
		let conn:PoolConnection | null = null;
		try {
			conn = await getPool().getConnection();
			if(conn) {
				const queryOptions:QueryOptions = {
					namedPlaceholders:true,
					sql: "SELECT * FROM uploadDownload WHERE productId=:productId AND fileType=:fileType"
				};
				const uploadDownloadLinks:UploadDownloadLink[] = await conn.query(queryOptions,{productId,fileType}) as UploadDownloadLink[];
				if(uploadDownloadLinks && uploadDownloadLinks.length > 0) {
					return uploadDownloadLinks;
				} else {
					return [];
				}
			} else {
				return [];
			}
		} catch (error) {
			console.error(error);
			return [];
		} finally {
			if(conn)
				conn.release();
		}
	}

	async getLinksByProductId(productId:string, date:string): Promise<UploadDownloadLink[]> {
		let conn:PoolConnection | null = null;
		try {
			conn = await getPool().getConnection();
			if(conn) {
				const queryOptions:QueryOptions = {
					namedPlaceholders:true,
					sql: ""
				};
				let links:UploadDownloadLink[] = [];

				if(date === "none") {
					queryOptions.sql = "SELECT * FROM uploadDownload WHERE productId=:productId";
					links = await conn.query(queryOptions,{productId});
				} else if(date === "may") {
					// queryOptions.nestTables="_";
					queryOptions.sql = "SELECT uploadDownload.* products.* FROM uploadDownload INNER JOIN products ON products.productId = uploadDownload.productId AND JSON_EXTRACT(productDetails,'$.assessmentSemifinals') = true WHERE uploadDownload.productId=:productId ";
					links = await conn.query(queryOptions,{productId});
				} else if(date === "oct") {
					// queryOptions.nestTables="_";
					queryOptions.sql =
						"SELECT uploadDownload.* products.* FROM uploadDownload INNER JOIN products ON products.productId = uploadDownload.productId AND JSON_EXTRACT(productDetails,'$.assessmentSemifinals') = true AND JSON_EXTRACT(productDetails,'$.assessmentFinals') = true WHERE uploadDownload.productId=:productId ";
					links = await conn.query(queryOptions,{productId});
				}

				if(links) {
					return links;
				} else {
					return [];
				}
			} else {
				return [];
			}
		} catch (e) {
			console.error(e);
			return [];
		} finally {
			if(conn)
				conn.release();
		}
	}

	async getLinksByFileTypePass(fileType:string,date:string): Promise<UploadDownloadLink[]> {
		let conn:PoolConnection | null = null;
		try {
			conn = await getPool().getConnection();
			if(conn) {
				const queryOptions:QueryOptions = {
					namedPlaceholders:true,
					sql: ""
				};
				let links:UploadDownloadLink[] = [];
	
				if(date === "none") {
					queryOptions.sql = "SELECT uploadDownload.uuid, uploadDownload.fileType, uploadDownload.extension, uploadDownload.uploadTime, products.* FROM uploadDownload INNER JOIN products ON products.productId=uploadDownload.productId WHERE uploadDownload.fileType=:fileType";
					links = await conn.query(queryOptions,{fileType});
				} else if(date === "may") {
					queryOptions.sql = "SELECT uploadDownload.uuid, uploadDownload.fileType, uploadDownload.extension, uploadDownload.uploadTime, products.* FROM uploadDownload INNER JOIN products ON products.productId=uploadDownload.productId AND JSON_EXTRACT(productDetails,'$.assessmentSemifinals') = true WHERE uploadDownload.fileType=:fileType";
					links = await conn.query(queryOptions,{fileType});
				} else if(date === "oct") {
					queryOptions.sql =
						"SELECT uploadDownload.uuid, uploadDownload.fileType, uploadDownload.extension, uploadDownload.uploadTime, products.* FROM uploadDownload INNER JOIN products ON products.productId=uploadDownload.productId AND JSON_EXTRACT(productDetails,'$.assessmentSemifinals') = true AND JSON_EXTRACT(productDetails,'$.assessmentFinals') = true WHERE uploadDownload.fileType=:fileType";
					links = await conn.query(queryOptions,{fileType});
				}
			
				if(links) {
					return links;
				} else {
					return [];
				}
			} else {
				return [];
			}
		} catch (e) {
			console.error(e);
			return [];
		} finally {
			if(conn)
				conn.release();
		}
	}

	async getLinks(city: string, fileType: string, teamType: string): Promise<UploadDownloadLink[]> {
		let conn:PoolConnection | null = null;
		try {
			conn = await getPool().getConnection();
			if(conn) {
				const queryOptions:QueryOptions = {
					namedPlaceholders:true,
					sql: ""
				};
				if (teamType === "none") {
					queryOptions.sql = "SELECT uuid, fileType, extension, uploadTime, products.*, teams.location FROM uploadDownload inner join products on products.productId=uploadDownload.productId inner join teams on teams.location=:city and teams.productId = products.productId  where fileType = :fileType;";
				} else if (teamType === "semifinals") {
					queryOptions.sql = "SELECT uuid, fileType, extension, uploadTime, products.*, teams.location FROM uploadDownload inner join products on products.productId=uploadDownload.productId AND JSON_EXTRACT(productDetails,'$.assessmentSemifinals') = true inner join teams on teams.location=:city and teams.productId = products.productId  where fileType = :fileType;";
				} else if (teamType === "finals") {
					queryOptions.sql = "SELECT uuid, fileType, extension, uploadTime, products.*, teams.location FROM uploadDownload inner join products on products.productId=uploadDownload.productId AND JSON_EXTRACT(productDetails,'$.assessmentSemifinals') = true AND JSON_EXTRACT(productDetails,'$.assessmentFinals') = true inner join teams on teams.location=:city and teams.productId = products.productId  where fileType = :fileType;";
				}
				let links:UploadDownloadLink[] = [];
				let params: {city?: string, fileType?: string} = {};
				if (city === "All") {
					queryOptions.sql = queryOptions.sql.replace(" teams.location=:city and", "");
				} else {
					params.city = city;
				}
				params.fileType = fileType
				links = await conn.query(queryOptions, params);
				if(links) {
					return links;
				} else {
					return [];
				}
			} else {
				return [];
			}
		} catch (e) {
			console.error(e);
			return [];
		} finally {
			if(conn)
				conn.release();
		}
	}

	async addS3File(uuid:string,fileData:string, fileType:string): Promise<Boolean> {
		try {
			await AWS.config.update({region: process.env.REGION, accessKeyId: process.env.AKEY, secretAccessKey: process.env.ASECRETKEY});
			const s3 = new AWS.S3();
			if(uuid !== "" && uuid !== undefined && process.env.BUCKET) {
				const uploadParams:{Bucket:string,Key:string,Body:string|Buffer} = {
					Bucket: process.env.BUCKET, 
					Key: '', 
					Body: ''
				};
				
				const readable = new Readable();
				if(fileType === "base64") {
					if(fileData !== "" && fileData !== undefined) {
						const buffer = Buffer.from(fileData,"base64");
						readable._read = () => {}; 
						readable.push(buffer);
						uploadParams.Body = buffer;
						uploadParams.Key = uuid;
						const data = await s3.upload (uploadParams).promise()
						if(data)
							return true;
						else
							return false;
					} else
						return false;
				} else if(fileType === "path") {
					const fileBuffer = await fs.readFile(fileData);
					if(fileBuffer && fileBuffer !== undefined) {
						readable._read = () => {}; 
						readable.push(fileBuffer);
						uploadParams.Body = fileBuffer;
						uploadParams.Key = uuid;
						const data = await s3.upload (uploadParams).promise()
						if(data)
							return true;
						else
							return false;
					} else
						return false;
				} else {
					return false;
				}
			}
			else 
				return false;
		} catch (e) {
			console.error(e);
			return false;
		}
	}
	async getS3Object(uuid:string): Promise<string> {
		try {
			AWS.config.update({region: process.env.REGION, accessKeyId: process.env.AKEY, secretAccessKey: process.env.ASECRETKEY});
			const s3 = new AWS.S3({
				signatureVersion: 'v4',
			});
			if(uuid !== "" && uuid !== undefined) {
				const BucketParams = {
					Bucket:(process.env.BUCKET as string),
					Key:uuid
				};
				let utf8Data;
				const response:AWS.S3.GetObjectOutput = await s3.getObject(BucketParams).promise();
				if(response.Body !== undefined) {
					utf8Data = response.Body.toString("base64");
				}
				if(utf8Data !== undefined)
					return utf8Data;
				else 
					return "";
			} else {
				return "";
			}
		} catch (e) {
			console.error(e);
			return "";
		}
	}
	async getS3Url(uuid:string, userId?:string): Promise<string> {
		try {
			AWS.config.update({region: process.env.REGION, accessKeyId: process.env.AKEY, secretAccessKey: process.env.ASECRETKEY});
			const s3 = new AWS.S3({
				signatureVersion: 'v4',
			});
			let name = "";
			if(userId !== undefined && userId !== "") {
				const user = await users.getUserById(userId);
				if(user)
				name = user.username + "_profile_image.jpg"
			} else {
				const link = await uploadDownload.getLinkByUuid(uuid);
				if(link) {
					const product = await teams.getProductById(link.productId);
					if(product) {
						let date = this.formatDate(link.uploadTime);
						if(link.uploadTime === undefined || date === undefined) {
							date = this.formatDate(new Date());
						}
						if(link.fileType === "demoVid")
						{
							name = product.startupName + "_tehnic_demo_video_" + date + "." + link.extension;
						} else if(link.fileType ==="presVid") {
							name = product.startupName + "_products_presentation_video_" + date + "." + link.extension;
						} else if(link.fileType ==="pres") {
							name = product.startupName + "_powerpoint_presentation_" + date + "."  + link.extension;
						} else if(link.fileType ==="image") {
							name = product.startupName + "_products_image_"+ link.uuid[0] +link.uuid[1] + link.uuid[2] + "_" + date + "."  + link.extension;
						} else if(link.fileType ==="logo") {
							name = product.startupName + "_logo_" + date + "."  + link.extension;
						} else {
							name = link.fileType + link.extension;
						}
					}
				}
			}
			if(uuid !== "" && uuid !== undefined) {
				const signedUrlExpireSeconds = 60 * 5;
				const url = s3.getSignedUrl('getObject', {
					Bucket: process.env.BUCKET,
					Key: uuid,
					Expires: signedUrlExpireSeconds,
					ResponseContentDisposition: 'attachment; filename ="' + name + '"'
				})
				if(url !== undefined)
					return url;
				else 
					return "";
			} else {
				return "";
			}
			
		} catch (e) {
			console.error(e);
			return "false";
		}
	}

	async deleteS3File(uuid:string): Promise<Boolean> {
		try {
			AWS.config.update({region: process.env.REGION, accessKeyId: process.env.AKEY, secretAccessKey: process.env.ASECRETKEY});
			const s3 = new AWS.S3();
			if(uuid !== undefined && uuid !== "" && process.env.BUCKET) {
				const deleteParams:{Bucket:string, Key:string} = {
					Bucket: process.env.BUCKET, 
					Key: uuid
				};
				if(s3.deleteObject (deleteParams, (err:AWS.AWSError, data:AWS.S3.DeleteObjectOutput) => {
					if (err) {
						console.error("Error", err);
						return false;
					} if (data) {
						console.log("Delete Success", data);
						return true;
					}
				}))
					return true;
				else
					return false;
			} else 
				return false;
			
		} catch (e) {
			console.error(e);
			return false;
		}
	}
	async generateCustomZip(linkUuid:string, city:string, businessTrack:string, semiFianals:boolean, finals:boolean) {
		try {
			UploadDownloadServer.zips[linkUuid] = new jszip();
			let zip = UploadDownloadServer.zips[linkUuid];
			if (city) {
				const products = await teams.getTeamsByLocationBtFinals(city, businessTrack, semiFianals, finals);
				for (const product of products) {
					const prId = product.productId;
					const links = await uploadDownload.getLinksByProductId(
						prId,
						"none"
					);
					const users = await teams.getUsersByTeamId(product.teamId);
					if (users.length !== 0) {
						for (const user of users) {
							if (user)
								if (
									user.avatarUu !== "" &&
									user.avatarUu !== null
								) {
									const obj: string = await uploadDownload.getS3Object(
										user.avatarUu
									);
									let name =
										product.teamName +
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
										zip.file(name, obj, { base64: true });
									} else {
										console.error("No obj GETS3OBJ");
									}
								}
						}
					}
					if (links.length !== 0 && zip) {
						zip.folder(product.teamName);
						zip.folder(product.teamName + "/Videos");
						zip.folder(product.teamName + "/Images");
						zip.folder(product.teamName + "/PowerPoint");
						for (const link of links) {
							if (prId !== "" && product !== undefined) {
								const date = uploadDownload.formatDate(
									link.uploadTime
								);
								let name = "";

								if (link.fileType === "demoVid") {
									name =
										product.teamName +
										"/Videos/" +
										product.location +
										"_" +
										product.teamName +
										"_tehnic_demo_video_" +
										date +
										"." +
										link.extension;
								} else if (link.fileType === "presVid") {
									name =
										product.teamName +
										"/Videos/" +
										product.location +
										"_" +
										product.teamName +
										"_products_presentation_video_" +
										date +
										"." +
										link.extension;
								} else if (link.fileType === "pres") {
									name =
										product.teamName +
										"/PowerPoint/" +
										product.location +
										"_" +
										product.teamName +
										"_powerpoint_presentation_" +
										date +
										"." +
										link.extension;
								} else if (link.fileType === "image") {
									name =
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
								} else if (link.fileType === "logo") {
									name =
										product.teamName +
										"/Images/" +
										product.location +
										"_" +
										product.teamName +
										"_logo_" +
										date +
										"." +
										link.extension;
								} else {
									console.error("Unidentified link");
								}
								const obj: string = await uploadDownload.getS3Object(
									link.uuid
								);
								if (obj !== "") {
									zip.file(name, obj, { base64: true });
								} else {
									console.error("No obj GETS3OBJ");
								}
							} else {
								console.error("No Product");
							}
						}
					}
				}
			}
			const uuid = uiidv4();
			if (zip !== null) {
				if (Object.keys(zip.files).length === 0) {
					await fs.writeFile(
						path.join("/tmp", "NO_FILE.txt"),
						"NO_FILE"
					);
					const link: UploadDownloadLink = {
						uuid: linkUuid,
						productId: "7051998",
						fileType: linkUuid + "_zip",
						extension: ".txt",
						uploadTime: new Date()
					};
					const tmpPath = path.join("/tmp", "NO_FILE.txt");
					const upload = await uploadDownload.addS3File(
						link.uuid,
						tmpPath,
						"path"
					);
					if (upload) {
						console.log("Uploaded file");
						await uploadDownload.addLink(link);
						await fs.remove(tmpPath);
					} else {
						await fs.remove(tmpPath);
						console.error("Didn't upload ADDS3File");
					}
				} else {
					zip.generateNodeStream({
						type: "nodebuffer",
						streamFiles: true
					})
						.pipe(
							fs.createWriteStream(
								path.join("/tmp", uuid + ".zip")
							)
						)
						.on("finish", async () => {
							console.log("Finished writing zip");
							console.log("Trying to send zip");
							const link: UploadDownloadLink = {
								uuid: linkUuid,
								productId: "7051998",
								fileType: linkUuid + "_zip",
								extension: ".zip",
								uploadTime: new Date()
							};
							if (link.uuid !== "") {
								let upload: Boolean = false;
								const tmpFile = path.join(
									"/tmp",
									uuid + ".zip"
								);
								upload = await uploadDownload.addS3File(
									link.uuid,
									tmpFile,
									"path"
								);
								if (upload) {
									console.log("Uploaded file");
									await uploadDownload.addLink(link);
									await fs.remove(tmpFile);
								} else {
									await fs.remove(tmpFile);
									console.error("Didn't upload ADDS3File");
								}
							} else {
								console.error("Didn't create link ADDLINK");
							}
						});
				}
			} else {
				console.log("No archive");
			}
			zip = null;
		} catch (e) {
			console.error(e);
		}
	}
	async generateZip(type:string,date:string,linkUuid:string, option?:string,city?:string,team?:string|string[]) {
		try {
			UploadDownloadServer.zips[linkUuid] = new jszip;
			let zip = UploadDownloadServer.zips[linkUuid];
			if(type === "all") {
				const products = await teams.getTeams();
				for(const product of products) {
					const prId = product.productId;
					const links = await uploadDownload.getLinksByProductId(prId, date);
					const usersArr = await teams.getUsersByTeamId(product.teamId);
					const folder = product.location+'/'+product.teamName;
					const d = await teams.isTeamInDate(date,prId);
					if(usersArr.length !== 0 && d) {
						for(const user of usersArr) {
							if(user)
							if(user.avatarUu !== '' && user.avatarUu !== null) {
								const obj:string = await uploadDownload.getS3Object(user.avatarUu);
								let name = folder+'/UserImages/'+product.location + "_" + product.teamName+'_profile_photo_'+user.firstName + "_" + user.lastName + '.png';
								if(obj !== "" && zip) {
									zip.file(name, obj, {base64:true});
								} else {
									console.error("No such object");
								}
							}
						}
					}
					if(links.length !== 0 && zip) {
						zip.folder(folder)
						zip.folder(folder + "/Videos");
						zip.folder(folder + "/Images");
						zip.folder(folder + "/PowerPoint");
						for(const link of links) {
							if(prId !== "" && product !== undefined) {
								const date = uploadDownload.formatDate(link.uploadTime);
								let name = "";
								if(link.fileType === "demoVid") {
									name = folder+'/Videos/'+product.location + "_" + product.teamName + "_tehnic_demo_video_" + date + "." + link.extension;
								} else if(link.fileType ==="presVid") {
									name = folder+'/Videos/'+product.location + "_" + product.teamName + "_products_presentation_video_" + date + "." + link.extension;
								} else if(link.fileType ==="pres") {
									name = folder+'/PowerPoint/'+product.location + "_" + product.teamName + "_powerpoint_presentation_" + date + "."  + link.extension;
								} else if(link.fileType ==="image") {
									name = folder+'/Images/'+product.location + "_" + product.teamName + "_products_image_"+ link.uuid[0] +link.uuid[1] + link.uuid[2] + "_" + date + "."  + link.extension;
								} else if(link.fileType ==="logo") {
									name = folder+'/Images/'+product.location + "_" + product.teamName + "_logo_" + date + "."  + link.extension;
								} else {
									console.error("Unidentified link");
								}
								const obj:string = await uploadDownload.getS3Object(link.uuid);
								if(obj !== "") {
									zip.file(name, obj, {base64:true});
								} else {
									console.error("No such object");
								}
							} else {
								console.error("No productId");
							}
						}
					}
				}
			} else {
				if(city) {
					const products = await teams.getTeamsByLocation(city);
					for(const product of products) {
						const prId = product.productId;
						const links = await uploadDownload.getLinksByProductId(prId, date);
						const users = await teams.getUsersByTeamId(product.teamId);
						const d = await teams.isTeamInDate(date,prId);
						if(users.length !== 0 && d) {
							for(const user of users) {
								if(user)
								if(user.avatarUu !== '' && user.avatarUu !== null) {
									const obj:string = await uploadDownload.getS3Object(user.avatarUu);
									let name = product.teamName+'/UserImages/'+product.location + "_" + product.teamName+'_profile_photo_'+user.firstName + "_" + user.lastName + '.png';
									if(obj !== "" && zip) {
										zip.file(name, obj, {base64:true});
									} else {
										console.error('No obj GETS3OBJ');
									}
								}
							}
						}
						if(links.length !== 0 && zip) {
							zip.folder(product.teamName);
							zip.folder(product.teamName + "/Videos");
							zip.folder(product.teamName + "/Images");
							zip.folder(product.teamName + "/PowerPoint");
							for(const link of links) {
								if(prId !== "" && product !== undefined) {
									const date = uploadDownload.formatDate(link.uploadTime);
									let name = "";

									if(link.fileType === "demoVid") {
										name = product.teamName+'/Videos/'+product.location + "_" + product.teamName + "_tehnic_demo_video_" + date + "." + link.extension;
									} else if(link.fileType ==="presVid") {
										name = product.teamName+'/Videos/'+product.location + "_" + product.teamName + "_products_presentation_video_" + date + "." + link.extension;
									} else if(link.fileType ==="pres") {
										name = product.teamName+'/PowerPoint/'+product.location + "_" + product.teamName + "_powerpoint_presentation_" + date + "."  + link.extension;
									} else if(link.fileType ==="image") {
										name = product.teamName+'/Images/'+product.location + "_" + product.teamName + "_products_image_"+ link.uuid[0] +link.uuid[1] + link.uuid[2] + "_" + date + "."  + link.extension;
									} else if(link.fileType ==="logo") {
										name = product.teamName+'/Images/'+product.location + "_" + product.teamName + "_logo_" + date + "."  + link.extension;
									} else {
										console.error('Unidentified link');
									}
									const obj:string = await uploadDownload.getS3Object(link.uuid);
									if(obj !== "") {
										zip.file(name, obj, {base64:true});
									} else {
										console.error('No obj GETS3OBJ')
									}
									
								} else {
									console.error('No Product');
								}
							}
						}
					}

				} else if (team && typeof team === "string") {
					let links = await uploadDownload.getLinksByProductId(team, date);
					const teamP = await teams.getTeamByProductId(team);
					let users;
					if(teamP)
						users = await teams.getUsersByTeamId(teamP.teamId);
					const d = await teams.isTeamInDate(date,team);
					if(users && teamP)
					if(users.length !== 0 && d) {
						for(const user of users) {
							if(user)
							if(user.avatarUu !== '' && user.avatarUu !== null) {
								const obj:string = await uploadDownload.getS3Object(user.avatarUu);
								let name = 'UserImages/'+teamP.location + "_" + teamP.teamName+'_profile_photo_'+user.firstName + "_" + user.lastName + '.png';
								if(obj !== "" && zip) {
									zip.file(name, obj, {base64:true});
								} else {
									console.error('No obj GETS3OBJ');

								}
							}
						}
					}
					if(links.length !== 0 && zip) {
						zip.folder("Videos");
						zip.folder("Images");
						zip.folder("PowerPoint");
						for(const link of links) {
							const product = await teams.getProductById(link.productId);
							if(product && teamP) {
								const date = uploadDownload.formatDate(link.uploadTime);
								let name = "";
								if(link.fileType === "demoVid") {
									name = "Videos/"+teamP.location + "_" + product.startupName + "_tehnic_demo_video_" + date + "." + link.extension;
								} else if(link.fileType ==="presVid") {
									name = "Videos/"+teamP.location + "_" + product.startupName + "_products_presentation_video_" + date + "." + link.extension;
								} else if(link.fileType ==="pres") {
									name = "PowerPoint/"+teamP.location + "_" + product.startupName + "_powerpoint_presentation_" + date + "."  + link.extension;
								} else if(link.fileType ==="image") {
									name = "Images/"+teamP.location + "_" + product.startupName + "_products_image_"+ link.uuid[0] +link.uuid[1] + link.uuid[2] + "_" + date + "."  + link.extension;
								} else if(link.fileType ==="logo") {
									name = "Images/"+teamP.location + "_" + product.startupName + "_logo_" + date + "."  + link.extension;
								} else {
									console.error('Unidentified link');
								}
								const obj:string = await uploadDownload.getS3Object(link.uuid);
								if(obj !== "") {
									zip.file(name, obj, {base64:true});
								} else {
									console.error('No obj GETS3OBJ')
								}
							} else {
								console.error('No Product');
							}
						}
					} else {
						console.error("No Files");
					}
				} else if (team && typeof team === "object" && typeof team[0] === "string") {
					const teamsArr = await teams.getTeamsByIdList(team);
					for(const teamP of teamsArr) {
						const prId = teamP.productId;
						const users = await teams.getUsersByTeamId(teamP.teamId);
						const d = await teams.isTeamInDate(date,prId);
						if(users.length !== 0 && d && option === "everything") {
							for(const user of users) {
								if(user)
								if(user.avatarUu !== '' && user.avatarUu !== null) {
									const obj:string = await uploadDownload.getS3Object(user.avatarUu);
									let name = teamP.teamName+'/UserImages/'+teamP.location + "_" + teamP.teamName+'_profile_photo_'+user.firstName + "_" + user.lastName + '.png';
									if(obj !== "" && zip) {
										zip.file(name, obj, {base64:true});
									} else {
										console.error('No obj GETS3OBJ');
									}
								}
							}
						}
						let links = [] as UploadDownloadLink[];
						if(option !== undefined)
							links = await uploadDownload.getLinksByProductIdAndFileType(prId,option);
						else
							links = await uploadDownload.getLinksByProductId(prId, 'none');
						if(links.length !== 0) {
							if(option === "everything" && zip) {
								zip.folder(teamP.teamName);
								zip.folder(teamP.teamName + "/Videos");
								zip.folder(teamP.teamName + "/Images");
								zip.folder(teamP.teamName + "/PowerPoint");
							}
							for(const link of links) {
								if(prId !== "" && teamP !== undefined) {
									const date = uploadDownload.formatDate(link.uploadTime);
									let name = "";
									
									if(option === "everything") {
										if(link.fileType === "demoVid") {
											name = teamP.teamName+'/Videos/'+teamP.location + "_" + teamP.teamName + "_tehnic_demo_video_" + date + "." + link.extension;
										} else if(link.fileType ==="presVid") {
											name = teamP.teamName+'/Videos/'+teamP.location + "_" + teamP.teamName + "_products_presentation_video_" + date + "." + link.extension;
										} else if(link.fileType ==="pres") {
											name = teamP.teamName+'/PowerPoint/'+teamP.location + "_" + teamP.teamName + "_powerpoint_presentation_" + date + "."  + link.extension;
										} else if(link.fileType ==="image") {
											name = teamP.teamName+'/Images/'+teamP.location + "_" + teamP.teamName + "_products_image_"+ link.uuid[0] +link.uuid[1] + link.uuid[2] + "_" + date + "."  + link.extension;
										} else if(link.fileType ==="logo") {
											name = teamP.teamName+'/Images/'+teamP.location + "_" + teamP.teamName + "_logo_" + date + "."  + link.extension;
										} else {
											console.error('Unidentified link');
										}
									} else {
										if(option === "demoVid") {
											name = teamP.location + "_" + teamP.teamName + "_tehnic_demo_video_" + date + "." + link.extension;
										} else if(option ==="presVid") {
											name = teamP.location + "_" + teamP.teamName + "_products_presentation_video_" + date + "." + link.extension;
										} else if(option ==="pres") {
											name = teamP.location + "_" + teamP.teamName + "_powerpoint_presentation_" + date + "."  + link.extension;
										} else if(option ==="image") {
											name = teamP.location + "_" + teamP.teamName + "_products_image_"+ link.uuid[0] +link.uuid[1] + link.uuid[2] + "_" + date + "."  + link.extension;
										} else if(option ==="logo") {
											name = teamP.location + "_" + teamP.teamName + "_logo_" + date + "."  + link.extension;
										} else {
											console.error('Unidentified link');
										}
									}
									
									const obj:string = await uploadDownload.getS3Object(link.uuid);
									if(obj !== "" && zip) {
										zip.file(name, obj, {base64:true});
									} else {
										console.error('No obj GETS3OBJ')
										}
									
									
								} else {
									console.error('No Product');
								}
							}
						}
					}
				}
			}
			const uuid= uiidv4();
			if(zip !== null) {
				if(Object.keys(zip.files).length === 0) {
					await fs.writeFile(path.join("/tmp","NO_FILE.txt"),"NO_FILE");
					const link:UploadDownloadLink = {
						uuid:linkUuid,
						productId:"7051998",
						fileType:linkUuid+"_zip",
						extension:".txt",
						uploadTime: new Date()
					};
					const tmpPath = path.join("/tmp","NO_FILE.txt");
					const upload = await uploadDownload.addS3File(link.uuid, tmpPath, "path");
					if(upload) {
						console.log('Uploaded file');
						await uploadDownload.addLink(link);
						await fs.remove(tmpPath);
					} else {
						await fs.remove(tmpPath);
						console.error('Didn\'t upload ADDS3File');
					}

				} else {
					zip.generateNodeStream({type:'nodebuffer',streamFiles:true}).pipe(fs.createWriteStream(path.join("/tmp",uuid+'.zip'))).on('finish', async () => {
						console.log("Finished writing zip");
						console.log("Trying to send zip");
						const link:UploadDownloadLink = {
							uuid:linkUuid,
							productId:"7051998",
							fileType:linkUuid+"_zip",
							extension:".zip",
							uploadTime: new Date()
						}
						if(link.uuid !== "") {
							let upload:Boolean = false;
							const tmpFile = path.join("/tmp",uuid + ".zip");
							upload = await uploadDownload.addS3File(link.uuid, tmpFile, "path");
							if(upload) {
								console.log('Uploaded file');
								await uploadDownload.addLink(link);
								await fs.remove(tmpFile);
							} else {
								await fs.remove(tmpFile);
								console.error('Didn\'t upload ADDS3File');
							}
						} else {
							console.error('Didn\'t create link ADDLINK');
						}
					});
				}
			} else {
				console.log("No archive");
			}
			zip = null;
		} catch (e) {
			console.error(e);
		}

	}
	async checkCustomZip(city:string, businessTrack:string, workshopNo:string, semifinals:boolean, finals:boolean):Promise<void> {
		try {
			let uuid = city+"_uploads_arhive_"+businessTrack +"_"+workshopNo;
			const tsf = semifinals? "t":"f";
			const tf = finals? "t":"f";
			uuid = uuid+"_"+tsf+tf; 

			
			let link:UploadDownloadLink | null = await uploadDownload.getLinkByUuid(uuid);
			let truthful = false;
			if(link) {
				const oldDate = new Date(link.uploadTime).getTime();
				const newDate = new Date().getTime();
				truthful = (newDate - oldDate >= 86400000);
			} else {
				truthful = true;
			}
			if(truthful) {
				if(UploadDownloadServer.zips[uuid] === null) {
					await uploadDownload.generateCustomZip(uuid, city, businessTrack, semifinals, finals);
					return;
				} else if(UploadDownloadServer.zips[uuid] === undefined) {
					UploadDownloadServer.zips[uuid] = null;
					await uploadDownload.generateCustomZip(uuid, city, businessTrack, semifinals, finals);
					return;
				}
			}
		} catch (e) {
			console.error(e);
			return;
		}
	}
	async checkZip(type:string, date:string, option?:string, city?:string,team?:string|string[]):Promise<void> {
		try {
			let link:UploadDownloadLink | null = null;
			let uuid = '';
			if(type === "all") {
				uuid = "all_uploads_arhive_" + date;
				link = await uploadDownload.getLinkByUuid(uuid);
				console.log(link);
			} else {
				if(city) {
					uuid = city + "_uploads_arhive_" + date;
					link = await uploadDownload.getLinkByUuid(uuid);
				} else if(typeof team === "string") {
					const product = await teams.getProductById(team);
					if(product)
						uuid = product.startupName + "_uploads_arhive";
					link = await uploadDownload.getLinkByUuid(uuid);
				} else if(typeof team === "object" && typeof team[0] === "string") {
					if(option !== undefined)
						uuid = "demoday_uploads_arhive_" + option;
					else 
						uuid = "demoday_uploads_arhive";
					link = await uploadDownload.getLinkByUuid(uuid);
				}
			}
			let truthful = false;
			if(link) {
				const oldDate = new Date(link.uploadTime).getTime();
				const newDate = new Date().getTime();
				truthful = (newDate - oldDate >= 86400000);
			} else {
				truthful = true;
			}
			if(truthful) {
				if(UploadDownloadServer.zips[uuid] === null) {
					await uploadDownload.generateZip(type,date,uuid,option,city,team);
					return;
				} else if(UploadDownloadServer.zips[uuid] === undefined) {
					UploadDownloadServer.zips[uuid] = null;
					await uploadDownload.generateZip(type,date,uuid,option,city,team);
					return;
				}
			}
		} catch (e) {
			console.error(e);
			return;
		}
	}

	async getZip(type:string, date:string,option?:string, city?:string, team?:string|string[]):Promise<string> {
		try {
			let link:UploadDownloadLink | null = null;
			let uuid = '';
			if(type === "all") {
				uuid = "all_uploads_arhive_" + date;
				link = await uploadDownload.getLinkByUuid(uuid);
			} else {
				if(city) {
					uuid = city + "_uploads_arhive_" + date;
					link = await uploadDownload.getLinkByUuid(uuid);
				} else if(team && typeof team === "string") {
					const product = await teams.getProductById(team);
					if(product)
						uuid = product.startupName + "_uploads_arhive";
					link = await uploadDownload.getLinkByUuid(uuid);
				} else if(typeof team === "object" && typeof team[0] === "string") {
					if(option !== undefined)
						uuid = "demoday_uploads_arhive_" + option;
					else 
						uuid = "demoday_uploads_arhive";
					link = await uploadDownload.getLinkByUuid(uuid);
				}
			}
			if(link) {
				const obj = await uploadDownload.getS3Object(link.uuid);
				const file = Buffer.from(obj.substring(0,12),"base64").toString();
				const ref = "NO_FILE";
				if(file === ref) {
					return "NO_FILES_TO_UPLOAD";
				} else {
					const url:string = await uploadDownload.getS3Url(link.uuid);
					if(url !== '')
						return url;
					else
						return "ERROR";
				}
			} else {
				console.log("else");
				return "NOT_DONE"
			}
		} catch (e) {
			console.error(e);
			return "ERROR"
		}
	}

	public static getInstance (): UploadDownloadServer
	{
		if (!this.INSTANCE)
		{
			this.INSTANCE = new UploadDownloadServer ();
		}
		return this.INSTANCE;
	}

}

const router = Router();
const uploadDownload = UploadDownloadServer.getInstance();
const users = UsersServer.getInstance();
const teams = TeamsServer.getInstance();
const authFunct = getAuthorizationFunction();
if(authFunct)
	router.use(authFunct);

router.get("/get/file/product/:fileType/:productId", async(req:ApiRequest<undefined>, res:ApiResponse<{data:string,type:string,ext:string,uuid:string}[] | null>) => {
	try {
		const type = req.params.fileType;
		const productId = req.params.productId;
		if(productId !== "" && productId !== undefined && type !== "" && type !== undefined) {
			let links = await uploadDownload.getLinksByProductIdAndFileType(productId,type);
			const results = [];
			for(const link of (links as UploadDownloadLink[])) {
				
				if((link as UploadDownloadLink).uuid !== "") {
					const url = await uploadDownload.getS3Url((link as UploadDownloadLink).uuid);
					results.push({
						data:url,
						type:(link as UploadDownloadLink).fileType,
						ext:(link as UploadDownloadLink).extension,
						uuid:(link as UploadDownloadLink).uuid
					})
				}
			}
			res.status(200).send(results);
		} else {
			res.status(204).send({err:204,data:null});
		}
	} catch (e) {
		console.error(e);
		res.status(500).send({err:500,data:null});

	}
});

router.post("/delete/file/", async(req:ApiRequest<{uuid:string}>, res:ApiResponse<boolean>) => {
	try {
		const uuid = req.body.uuid;
		if(uuid !== "") {
			const file = await uploadDownload.getS3Object(uuid);
			const rs = await uploadDownload.deleteS3File(uuid);
			if(rs && file !== undefined){
				const rss = await uploadDownload.deleteLink(uuid);
				if(rss) {
					res.status(200).send(true);
				} else {
					let name = uiidv4();
					const tmpFile = path.join("/tmp",name);
					await fs.writeFile(tmpFile,file);
					await uploadDownload.addS3File(uuid, tmpFile, "path");
					await fs.remove(tmpFile);
					res.status(500).send({err:500,data:false});
				}
			}
			else 
				res.status(500).send({err:500,data:false});
		}
			
	} catch (e) {
		console.error(e);
		res.status(500).send({err:500,data:false});
	}
});
router.get("/download/file/:uuid", async(req:ApiRequest<undefined>, res:ApiResponse<string | null>) => {
	try {
		const uuid = req.params.uuid;
		let url:string = "";
		if(uuid !== "")
			url = await uploadDownload.getS3Url(uuid);
		if(url !== "") {
			res.status(200).send(url);
		} else {
			res.status(404).send({err:404,data:null});
		}
	} catch (e) {
		console.error(e);
		res.status(500).send({err:500,data:null});
	}
});

router.get("/download/unbulkable/:city/:teamType/:exportType", async(req:ApiRequest<undefined>, res:ApiResponse<string[] | null>) => {
	try {
		const city = req.params.city
		const teamType = req.params.teamType;
		const exportType = req.params.exportType;
		let links = await uploadDownload.getLinks(city,exportType,teamType);
		if(links.length !== 0) {
			const prevZip = await uploadDownload.getLinkByUuid(`${city}_${teamType}_${exportType}`);
			if (prevZip && await uploadDownload.deleteS3File(prevZip.uuid)) {
				await uploadDownload.deleteLink(prevZip.uuid);
			}
			const urls:string[] = [];
			for(const link of links) {
				const url = await uploadDownload.getS3Url(link.uuid);
				urls.push(url);
			}
			res.status(200).send(urls);
		} else {
			res.status(204).send(null);
		}
	} catch (e) {
		console.error(e);
		res.status(500).send({err:500,data:null});
	}
});
router.get("/download/zip/:city/:teamType/:exportType", async(req:ApiRequest<undefined>, res:ApiResponse<string | null>) => {
	try {
		const city = req.params.city
		const teamType = req.params.teamType;
		const exportType = req.params.exportType;
		console.log(city);
		console.log(teamType);
		console.log(exportType);
		let links = await uploadDownload.getLinks(city,exportType,teamType);
		console.log(links);
		if(links.length !== 0) {
			const prevZip = await uploadDownload.getLinkByUuid(`${city}_${teamType}_${exportType}`);
			if (prevZip && await uploadDownload.deleteS3File(prevZip.uuid)) {
				await uploadDownload.deleteLink(prevZip.uuid);
			}
			let zip = new jszip();
			for(const link of links) {
				const product = await teams.getProductById(link.productId);
				if(product) {
					const date = uploadDownload.formatDate(link.uploadTime);
					let name = "";
					// if(exportType === "demoVid") {
					// 	name = `${product.startupName}_tehnic_demo_video_${date}.${link.extension}`;
					// } else if(exportType ==="presVid") {
					// 	name = `${product.startupName}_products_presentation_video_${date}.${link.extension}`;
					// } else 
					if(exportType ==="pres") {
						name = `${product.startupName}_powerpoint_presentation_${date}.${link.extension}`;
					} else if(exportType ==="image") {
						zip.folder(product.startupName);
						name = `${product.startupName}/${product.startupName}_products_image_${link.uuid[0]}${link.uuid[1]}${link.uuid[2]}_${date}.${link.extension}`;
					} else if(exportType ==="logo") {
						name = `${product.startupName}_logo_${date}.${link.extension}`;
					} else {
						name = exportType + link.extension;
					}
					const obj:string = await uploadDownload.getS3Object(link.uuid);
					if(obj !== "") {
						zip.file(name, obj, {base64:true});
					} else {
						res.status(404).send('No obj GETS3OBJ');
					}
				} else {
					res.status(500).send({err:500,data:null});
				}
			}
			const uuid= uiidv4();
			zip.generateNodeStream({type:'nodebuffer',streamFiles:true}).pipe(fs.createWriteStream(path.join("/tmp",uuid+'.zip'))).on('finish', async () => {
				console.log("Finished writing zip");

				const link:UploadDownloadLink = {
					uuid:`${city}_${teamType}_${exportType}`,
					productId:"7051998",
					fileType:`${exportType}_zip`,
					extension:".zip",
					uploadTime: new Date()
				}
				const newLink = await uploadDownload.addLink(link);
				if(newLink) {
					let upload:Boolean = false;
					const tmpFile = path.join("/tmp",uuid + ".zip");
					upload = await uploadDownload.addS3File(newLink.uuid, tmpFile, "path");
					if(upload) {
						let url:string = "";
						url = await uploadDownload.getS3Url(newLink.uuid);
						if(url !== "") {
							await fs.remove(tmpFile);
							res.status(200).send(url);
						} else {
							await uploadDownload.deleteLink(newLink.uuid);
							await fs.remove(tmpFile);
							res.status(404).send('No url GETS3URL');
						}
					} else {
						await uploadDownload.deleteLink(newLink.uuid);
						await fs.remove(tmpFile);
						res.status(404).send('Didn\'t upload ADDS3File');
					}
				} else {
					res.status(404).send('Didn\'t create link ADDLINK');
				}
			})
		} else {
			res.status(204).send(null);
		}
	} catch (e) {
		console.error(e);
		res.status(500).send({err:500,data:null});
	}
});
router.post("/download/zip/:city", async(req:ApiRequest<{businessTrack:string,workshopNo:string,semiFinals:boolean,finals:boolean}>, res:ApiResponse<string | null>) => {
	try {
		const city = req.params.city;
		const businessTrack = req.body.businessTrack;
		const workshopNo = req.body.workshopNo;
		/*either string (city) or number (productId) or nothing ('')*/
		const semiFinals = req.body.semiFinals;
		const finals = req.body.finals;
		res.status(200).send('OK');
		await uploadDownload.checkCustomZip(city, businessTrack, workshopNo, semiFinals, finals);
	} catch (e) {
		console.error(e);
		res.status(500).send({err:500,data:null});
	}
});
router.post("/download/zip/", async(req:ApiRequest<{type:string,date:string,city:string,team:string|string[],option:string}>, res:ApiResponse<string | null>) => {
	try {
		const type = req.body.type;
		const date = req.body.date;
		/*either string (city) or number (productId) or nothing ('')*/
		const team = req.body.team;
		const city = req.body.city;
		const option:string = req.body.option;
		res.status(200).send('OK');

		await uploadDownload.checkZip(type,date,option, city, team);
	} catch (e) {
		console.error(e);
		res.status(500).send({err:500,data:null});
	}
});

router.post("/check/zip/status/", async(req:ApiRequest<{type:string,date:string,city:string,team:string|string[],option:string}>, res:ApiResponse<string | null>) => {
	try {
		const type = req.body.type;
		const date = req.body.date;
		/*either string (city) or number (productId) or nothing ('')*/
		const city = req.body.city;
		const team = req.body.team;
		const option:string = req.body.option;
		const response = await uploadDownload.getZip(type,date,option,city,team);
		console.log(response);
		if(response === "NOT_DONE") {
			res.status(204).send(response);
		} else if(response === "ERROR") {
			res.status(500).send({err:500,data:null});
		} else {
			res.status(200).send(response);
		}
	} catch (e) {
		console.error(e);
		res.status(500).send({err:500,data:null});
	}
});


router.post("/download/team/zip/:type/:date", async(req:ApiRequest<{type:string,date:string,productId:string,city:string}>, res:ApiResponse<string | null>) => {
	try {
		const type = req.params.type;
		const date = req.params.date;
		let zip = new jszip();
		let exists = false;
		if(type === "team") {
			const productId = req.body.productId;
			const product = await teams.getProductById(productId);
			let uuid;
			if(product)
				uuid = product.startupName+"_uploads_arhive";
			let link
			if(uuid)
				link = await uploadDownload.getLinkByUuid(uuid);
			let oldDate:number = 0;
			if(link)
				oldDate = new Date(link.uploadTime).getTime();
			const newDate = new Date().getTime();
			if(link && newDate - oldDate <= 86400000) {
				exists = true;
			} else {
				let links = await uploadDownload.getLinksByProductId(productId, date);
				const team = await teams.getTeamByProductId(productId);
				let users;
				if(team)
					users = await teams.getUsersByTeamId(team.teamId);
				if(team && users && users.length !== 0) {
					for(const user of users) {
						if(user)
						if(user.avatarUu !== '' && user.avatarUu !== null) {
							const obj:string = await uploadDownload.getS3Object(user.avatarUu);
							let name = 'UserImages/'+team.location + "_" + team.teamName+'_profile_photo_'+user.firstName + "_" + user.lastName + '.png';
							if(obj !== "") {
								zip.file(name, obj, {base64:true});
							} else {
								res.status(404).send('No obj GETS3OBJ');

							}
						}
					}
				}
				if(links.length !== 0) {
					zip.folder("Videos");
					zip.folder("Images");
					zip.folder("PowerPoint");
					for(const link of links) {
						const product = await teams.getProductById(link.productId);
						if(product && team) {
							const date = uploadDownload.formatDate(link.uploadTime);
							let name = "";
							if(link.fileType === "demoVid") {
								name = "Videos/"+team.location + "_" + product.startupName + "_tehnic_demo_video_" + date + "." + link.extension;
							} else if(link.fileType ==="presVid") {
								name = "Videos/"+team.location + "_" + product.startupName + "_products_presentation_video_" + date + "." + link.extension;
							} else if(link.fileType ==="pres") {
								name = "PowerPoint/"+team.location + "_" + product.startupName + "_powerpoint_presentation_" + date + "."  + link.extension;
							} else if(link.fileType ==="image") {
								name = "Images/"+team.location + "_" + product.startupName + "_products_image_"+ link.uuid[0] +link.uuid[1] + link.uuid[2] + "_" + date + "."  + link.extension;
							} else if(link.fileType ==="logo") {
								name = "Images/"+team.location + "_" + product.startupName + "_logo_" + date + "."  + link.extension;
							} else {
								res.status(400).send('Unidentified link');
							}
							const obj:string = await uploadDownload.getS3Object(link.uuid);
							if(obj !== "") {
								zip.file(name, obj, {base64:true});
							} else {
								res.status(404).send('No obj GETS3OBJ');
							}
						} else {
							res.status(500).send({err:500});
						}
					}
				} else {
					res.status(204).send(null);
				}

			}
			
		} else if(type === "city") {
			const city = req.body.city;
			const uuid = city+"_uploads_arhive";
			const link = await uploadDownload.getLinkByUuid(uuid);
			let oldDate:number = 0;
			if(link)
				oldDate = new Date(link.uploadTime).getTime();
			const newDate = new Date().getTime();
			if(link && newDate - oldDate <= 86400000) {
				exists = true;
			} else {
				const products = await teams.getTeamsByLocation(city);
				for(const product of products) {
					const prId = product.productId;
					let links = await uploadDownload.getLinksByProductId(prId, date);
					const users = await teams.getUsersByTeamId(product.teamId);
					if(users.length !== 0) {
						for(const user of users) {
							if(user)
							if(user.avatarUu !== '' && user.avatarUu !== null) {
								const obj:string = await uploadDownload.getS3Object(user.avatarUu);
								let name = product.teamName+'/UserImages/'+product.location + "_" + product.teamName+'_profile_photo_'+user.firstName + "_" + user.lastName + '.png';
								if(obj !== "") {
									zip.file(name, obj, {base64:true});
								} else {
									res.status(404).send('No obj GETS3OBJ');
								}
							}
						}
					}
					if(links.length !== 0) {
						zip.folder(product.teamName);
						zip.folder(product.teamName + "/Videos");
						zip.folder(product.teamName + "/Images");
						zip.folder(product.teamName + "/PowerPoint");
						for(const link of links) {
							if(prId !== "" && product !== undefined) {
								const date = uploadDownload.formatDate(link.uploadTime);
								let name = "";
								console.log(name + " ");
								if(link.fileType === "demoVid") {
									name = product.teamName+'/Videos/'+product.location + "_" + product.teamName + "_tehnic_demo_video_" + date + "." + link.extension;
								} else if(link.fileType ==="presVid") {
									name = product.teamName+'/Videos/'+product.location + "_" + product.teamName + "_products_presentation_video_" + date + "." + link.extension;
								} else if(link.fileType ==="pres") {
									name = product.teamName+'/PowerPoint/'+product.location + "_" + product.teamName + "_powerpoint_presentation_" + date + "."  + link.extension;
								} else if(link.fileType ==="image") {
									name = product.teamName+'/Images/'+product.location + "_" + product.teamName + "_products_image_"+ link.uuid[0] +link.uuid[1] + link.uuid[2] + "_" + date + "."  + link.extension;
								} else if(link.fileType ==="logo") {
									name = product.teamName+'/Images/'+product.location + "_" + product.teamName + "_logo_" + date + "."  + link.extension;
								} else {
									res.status(400).send('Unidentified link');
								}
								await uploadDownload.getS3Object(link.uuid);
								
							} else {
								res.status(500).send({err:500});
							}
						}
					}
				}
			}
		} else if(type === "all") {
			const uuid = "all_uploads_arhive_" + date;
			const link = await uploadDownload.getLinkByUuid(uuid);
			let oldDate:number = 0;
			if(link)
				oldDate = new Date(link.uploadTime).getTime();
			const newDate = new Date().getTime();
			if(link && newDate - oldDate <= 86400000) {
				exists = true;
			} else {
				const products = await teams.getTeams();
				for(const product of products) {
					const prId = product.productId;
					let links = await uploadDownload.getLinksByProductId(prId, date);
					const users = await teams.getUsersByTeamId(product.teamId);
					const folder = product.location+'/'+product.teamName;
					if(users.length !== 0) {
						for(const user of users) {
							if(user)
							if(user.avatarUu !== '' && user.avatarUu !== null) {
								const obj:string = await uploadDownload.getS3Object(user.avatarUu);
								let name = folder+'/UserImages/'+product.location + "_" + product.teamName+'_profile_photo_'+user.firstName + "_" + user.lastName + '.png';
								if(obj !== "") {
									zip.file(name, obj, {base64:true});
								} else {
									res.status(404).send('No obj GETS3OBJ');
								}
							}
						}
					}
					if(links.length !== 0) {
						zip.folder(folder)
						zip.folder(folder + "/Videos");
						zip.folder(folder + "/Images");
						zip.folder(folder + "/PowerPoint");
						for(const link of links) {
							if(prId !== "" && product !== undefined) {
								const date = uploadDownload.formatDate(link.uploadTime);
								let name = "";
								if(link.fileType === "demoVid") {
									name = folder+'/Videos/'+product.location + "_" + product.teamName + "_tehnic_demo_video_" + date + "." + link.extension;
								} else if(link.fileType ==="presVid") {
									name = folder+'/Videos/'+product.location + "_" + product.teamName + "_products_presentation_video_" + date + "." + link.extension;
								} else if(link.fileType ==="pres") {
									name = folder+'/PowerPoint/'+product.location + "_" + product.teamName + "_powerpoint_presentation_" + date + "."  + link.extension;
								} else if(link.fileType ==="image") {
									name = folder+'/Images/'+product.location + "_" + product.teamName + "_products_image_"+ link.uuid[0] +link.uuid[1] + link.uuid[2] + "_" + date + "."  + link.extension;
								} else if(link.fileType ==="logo") {
									name = folder+'/Images/'+product.location + "_" + product.teamName + "_logo_" + date + "."  + link.extension;
								} else {
									res.status(400).send('Unidentified link');
								}
								const obj:string = await uploadDownload.getS3Object(link.uuid);
								if(obj !== "") {
									zip.file(name, obj, {base64:true});
								} else {
									res.status(404).send('No obj GETS3OBJ');
								}
							} else {
								res.status(500).send({err:500});
							}
						}
					}
				}
			}
		} else {
			res.status(400).send("Invalid type");
		}
		if(!exists) {
			const uuid= uiidv4();
			if(Object.keys(zip.files).length !== 0)
			zip.generateNodeStream({type:'nodebuffer',streamFiles:true}).pipe(fs.createWriteStream(path.join("/tmp",uuid+'.zip'))).on('finish', async () => {
				console.log("Finished writing zip");
				console.log("Trying to send zip");
				let linkUuid = '';
				if(type === "team") {
					const productId = req.body.productId;
					const product = await teams.getProductById(productId);
					if(product)
						linkUuid = (product).startupName+"_uploads_arhive";
				} else if (type === "city") {
					const city = req.body.city;
					linkUuid = city+"_uploads_arhive_" + date;
				} else if (type === "all") {
					linkUuid = "all_uploads_arhive_" + date;
				}
				const link:UploadDownloadLink = {
					uuid:linkUuid,
					productId:"7051998",
					fileType:linkUuid+"_zip",
					extension:".zip",
					uploadTime: new Date()
				}
				const newLink = await uploadDownload.addLink(link);
				if(newLink) {
					let upload:Boolean = false;
					const tmpFile = path.join("/tmp",uuid + ".zip");
					upload = await uploadDownload.addS3File(newLink.uuid, tmpFile, "path");
					if(upload) {
						let url:string = "";
						url = await uploadDownload.getS3Url(newLink.uuid);
						if(url !== "") {
							await fs.remove(tmpFile);
							res.status(200).send({url:url});
						} else {
							await uploadDownload.deleteLink(newLink.uuid);
							await fs.remove(tmpFile);
							res.status(404).send('No url GETS3URL');
						}
					} else {
						await uploadDownload.deleteLink(newLink.uuid);
						await fs.remove(tmpFile);
						res.status(404).send('Didn\'t upload ADDS3File');
					}
				} else {
					res.status(404).send('Didn\'t create link ADDLINK');
				}
			});
			else {
				res.status(204).send(null);
			}
		} else {
			let url:string = "";
			let uuid="";
			let newLink:UploadDownloadLink | null = null;

			if(type==="team") {
				const product = await teams.getProductById(req.body.productId);
				if(product)
					uuid = product.startupName+"_uploads_arhive";
			} else if(type==="city"){
				const city = req.body.city;
				uuid = city+"_uploads_arhive_" + date;
			} else if(type==="all"){
				uuid = "all_uploads_arhive_"+date
			}

			if(uuid !== '')
				newLink = await uploadDownload.getLinkByUuid(uuid);

			if(newLink)
				url = await uploadDownload.getS3Url(newLink.uuid);

			if(url !== "") {
				res.status(200).send(url);
			} else {
				if(newLink)
					await uploadDownload.deleteLink(newLink.uuid);
				res.status(404).send('No url GETS3URL');
			}
		}
		
		
	} catch (e) {
		console.error(e);
		res.status(500).send({err:500,data:null});
	}
});

router.post("/upload/file/chunk", async(req:ApiRequest<{finish:string,fileName:string,base64Encode:string,fileType:string,productId:string,ext:string}>, res:ApiResponse<boolean>) => {
	try{
		const end = req.body.finish;
		const fileName = req.body.fileName;
		if(!end) {
			const base64 = req.body.base64Encode;
			const data = Buffer.from(base64, "base64");
			const checkDir = await fs.pathExists('./tmp');
			if (!checkDir){
				await fs.mkdir('./tmp');
			}
			await fs.appendFile(path.join("./tmp",fileName), data);
			res.status(202).send(true);
		} else { 
			const fileType = req.body.fileType;
			const productId = req.body.productId;
			const filePath = path.join('./tmp', fileName);
			if(fileType !== 'pres') {
				let width:number;
				let height:number;
				const checkFile = await fs.pathExists(filePath);
				if(!checkFile) {
					console.error("No file");
					res.status(404).send({err:404,data:false});
				}
				try { 
					// as any because no ffmpeg types
					await ffmpeg(filePath).ffprobe(async function(err: any, metadata: any){
						width = await metadata.streams[0].width;
						height = await metadata.streams[0].height;
						if(width === undefined || height === undefined) {
							width = await metadata.streams[1].width;
							height = await metadata.streams[1].height;
							if(width === undefined || height === undefined) {
								width = await metadata.streams[2].width;
								height = await metadata.streams[2].height;
							}
						}
						console.log(width);
						console.log(height);
						if((width !== 0 && width >= 1280) && ( height !== 0 && height >= 720)) {
							const link:UploadDownloadLink = {
								uuid:"",
								productId:productId,
								fileType:fileType,
								extension:req.body.ext,
								uploadTime: new Date()
							}
							// replace existing demo video, presentation video, logo
							if(fileType === "demoVid" || fileType === "presVid" || fileType === "logo") {
								console.log(fileType);

								let links:UploadDownloadLink[] = await uploadDownload.getLinksByProductIdAndFileType(productId,fileType);
								if(links.length > 0) {
									const file = await uploadDownload.getS3Object(links[0].uuid);
									if(file !== "") {
										if(await uploadDownload.deleteS3File(links[0].uuid)) {
											if(!await uploadDownload.deleteLink(links[0].uuid)) {
												let name = uiidv4();
												const tmpFile = path.join("/tmp",name);
												await fs.writeFile(tmpFile,file);
												await uploadDownload.addS3File(links[0].uuid, tmpFile,"path");
												await fs.remove(filePath);
												await fs.remove(tmpFile);
												res.status(500).send({err:500,data:false});
											}
										} else {
											await fs.remove(filePath);
											res.status(500).send({err:500,data:false});
										}
									} else {
										if(!await uploadDownload.deleteLink(links[0].uuid)) {
											await fs.remove(filePath);
											res.status(500).send({err:500,data:false});
										}
									}
								}
								
							}
							const newLink = await uploadDownload.addLink(link);
							if(newLink) {
								const upload = await uploadDownload.addS3File(link.uuid, filePath, "path");
								if(upload) {
									await fs.remove(filePath);
									res.status(200).send();
								} else {
									await uploadDownload.deleteLink(newLink.uuid);
									await fs.remove(filePath);
									res.status(404).send({err:404,data:false});
								}
							} else {
								await fs.remove(filePath);
								res.status(404).send({err:404,data:false});
							}
						} else if(height === 0 || width === 0) {
							await fs.remove(filePath);
							res.status(405).send({err:405,data:false});
						} else {
							await fs.remove(filePath);
							res.status(406).send({err:406,data:false});
						}
				});
				} catch (e) {
					console.error(e);
					res.status(500).send({err:500,data:false});
				}
			} else {
				const link:UploadDownloadLink = {
					uuid:"",
					productId:productId,
					fileType:fileType,
					extension:req.body.ext,
					uploadTime: new Date()
				}
				let links:UploadDownloadLink[] = await uploadDownload.getLinksByProductIdAndFileType(productId,fileType);
				if(links.length > 0) {
					const file = await uploadDownload.getS3Object(links[0].uuid);
					if(file !== "") {
						if(await uploadDownload.deleteS3File(links[0].uuid)) {
							if(!await uploadDownload.deleteLink(links[0].uuid)) {
								let name = uiidv4();
								const tmpFile = path.join("/tmp",name);
								await fs.writeFile(tmpFile,file);
								await uploadDownload.addS3File(links[0].uuid, tmpFile,"path");
								await fs.remove(filePath);
								await fs.remove(tmpFile);
								res.status(500).send({err:500,data:false});
							}
						} else {
							await fs.remove(filePath);
							res.status(500).send({err:500,data:false});
						}
					} else {
						if(!await uploadDownload.deleteLink(links[0].uuid)) {
							await fs.remove(filePath);
							res.status(500).send({err:500,data:false});
						}
					}
				}
				const newLink = await uploadDownload.addLink(link);
				if(newLink) {
					let upload:Boolean = false;
					if(filePath !== "") {
						upload = await uploadDownload.addS3File(link.uuid, filePath, "path");
						if(upload) {
							await fs.remove(filePath);
							res.status(200).send();
						} else {
							await uploadDownload.deleteLink(newLink.uuid);
							await fs.remove(filePath);
							res.status(404).send({err:404,data:false});
						}
						
					}
					
				} else {
					await fs.remove(filePath);
					res.status(404).send({err:404,data:false});
				}
			
			}
		}
	} catch(e) {
		console.error(e);
		res.status(500).send({err:500,data:false});
	}
	
});


router.post("/upload/file/user/avatar", async(req:ApiRequest<{base64Encode:string,userId:string}>, res:ApiResponse<boolean>) => {
	try {
		const base64Encode = req.body.base64Encode;
		const userId = req.body.userId;
		if(base64Encode !== "" && base64Encode !== undefined && userId !== "" && userId !== undefined) {
			const uuid = uiidv4();
			if(uuid!== "") {
				const upload = await uploadDownload.addS3File(uuid, base64Encode, "base64");
				if(upload) {
					const user = await users.getUserById(userId);
					if(user){
						user.avatarUu = uuid;
						await users.modifyUser(user);
					}
					res.status(200).send(true);   
				} else {
					res.status(500).send({err:500,data:false});
				}
			} else {
				res.status(500).send({err:500,data:false});
			}
		} else {
			res.status(400).send({err:400,data:false});
		}
	} catch (e) {
		console.error(e);
		res.status(500).send({err:500,data:false});
	}
});
router.post("/get/file/user/avatar", async(req:ApiRequest<{userId:string}>, res:ApiResponse<string | null>) => {
	try {
		const userId = req.body.userId;
		if(userId !== "" && userId !== undefined) {
			const user = await users.getUserById(userId);
			let uuid;
			if(user)
				uuid = user.avatarUu;
			if(uuid !== "" && uuid !== null && uuid !== undefined) {
				const string = await uploadDownload.getS3Url(uuid, userId);
				if(string !== "") {
					res.status(200).send(string);
				} else 
					res.status(500).send({err:500,data:null});
			} else 
				res.status(204).send(null);
		} else            
			res.status(204).send(null);
	} catch (e) {
		console.error(e);
		res.status(500).send({err:500,data:null});
	}
});


const server = Server.getInstance ();
server.registerRouterAPI (1, router, "/uploadDownload");