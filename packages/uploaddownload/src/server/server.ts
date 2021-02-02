// import { Team } from "./server_types";
import { Router } from "express";
import { UploadDownloadLink } from "../common";
import { v4 as uiidv4} from "uuid";
import { Readable } from "stream";
import AWS from "aws-sdk";
import ffmpeg from "fluent-ffmpeg";
import fs from "fs-extra";
import path from "path";
import jszip from "JSZip";
import { Server, ApiRequest, ApiResponse } from "@startupway/main/lib/server";
import { getPool } from "@startupway/database/lib/server";
import { QueryOptions, Connection } from "mariadb";
import { getAuthorizationFunction, UsersServer } from "@startupway/users/lib/server";
import { TeamsServer } from "@startupway/teams/lib/server";

export class UploadDownloadServer {

	private static INSTANCE?: UploadDownloadServer;
	private conn:Connection;
	

	constructor() {
		const that = this;
		getPool().getConnection()
		.then(conn => {
			console.log("Connected to database");
			that.conn = conn;
		})
		.catch(err => {
			console.log("Not connected due to error: " + err);
		})
	}

	private static zips:{[key:string]:jszip} = {
		"all_uploads_arhive_none":(null as any) as jszip,
		"all_uploads_arhive_may":(null as any) as jszip,
		"all_uploads_arhive_oct":(null as any) as jszip,
		"Bucharest_uploads_arhive_none":(null as any) as jszip,
		"Bucharest_uploads_arhive_may":(null as any) as jszip,
		"Bucharest_uploads_arhive_oct":(null as any) as jszip,
		"Sibiu_uploads_arhive_none":(null as any) as jszip,
		"Sibiu_uploads_arhive_may":(null as any) as jszip,
		"Sibiu_uploads_arhive_oct":(null as any) as jszip,
		"Iasi_uploads_arhive_none":(null as any) as jszip,
		"Iasi_uploads_arhive_may":(null as any) as jszip,
		"Iasi_uploads_arhive_oct":(null as any) as jszip,
		"Cluj_uploads_arhive_none":(null as any) as jszip,
		"Cluj_uploads_arhive_may":(null as any) as jszip,
		"Cluj_uploads_arhive_oct":(null as any) as jszip,
		"Timisoara_uploads_arhive_none":(null as any) as jszip,
		"Timisoara_uploads_arhive_may":(null as any) as jszip,
		"Timisoara_uploads_arhive_oct":(null as any) as jszip,
		"demoday_uploads_arhive":(null as any) as jszip
	};
	formatDate(date: Date):string {
		const year = date.getFullYear(); 
		const month = date.getMonth() + 1;
		const day = date.getDate()
		return year + "-" + month + "-" + day;
	}
	async checkZipsDB():Promise<boolean> {
		try {
			const queryOptions:QueryOptions = {
				sql: "SELECT uploadDownload.* FROM uploadDownload where uploadDownload.productId=:productId"
			}
			let links = await this.conn.query(queryOptions, {productId:7051998});
			if(links.length > 0) {
				for(const link of links) {
					if(link.uuid !== '') {
						if(UploadDownloadServer.zips[link.uuid] === undefined) {
							UploadDownloadServer.zips[link.uuid] = (null as any) as jszip;
						}
					}
				}
			}
			return true;
		} catch (e) {
			console.error(e);
			return false;
		}
	}
	async addLink(uploadDownloadLink:UploadDownloadLink): Promise<UploadDownloadLink | null> {
		try {
			if(uploadDownloadLink.uuid === "") {
				const uuid= uiidv4();
				uploadDownloadLink.uuid = uuid;
			}
			const queryOptions:QueryOptions = {
				namedPlaceholders:true,
				sql: `INSERT INTO uploadDownload (uuid,productId,fileType,extension,uploadTime) values(:uuid,:productId,:fileType,:extension,:uploadTime)`
			}
			await this.conn.query(queryOptions, uploadDownloadLink);
			queryOptions.sql = "SELECT * FROM uploadDownload where uuid=:uuid";
			const newLink = await this.conn.query(queryOptions,{uuid:uploadDownloadLink.uuid});
			if(newLink[0] !== undefined)
				return newLink;
			else 
				return null;
		} catch (e) {
			console.error(e);
			return null;
		}
	}
	async deleteLink(uuid:string): Promise<Boolean> {
		// Keeping to see how we can revert a delete using pure sql
		// await queryRunner.startTransaction();
		// try {
		// 	await queryRunner.manager.createQueryBuilder()
		// 		.delete()
		// 		.from("uploadDownload")
		// 		.where("uploadDownload.uuid=:id", {id: uuid})
		// 		.execute();
		// 	await queryRunner.commitTransaction();
		// } catch(err) {
		// 	err = 1;
		// 	await queryRunner.rollbackTransaction();
		// 	return false;
		// } finally {
		// 	await queryRunner.release();
		// 	if(err === 1) {
		// 		return false;
		// 	} else {
		// 		return true;
		// 	}
		// }
		try {
			const queryOptions:QueryOptions = {
				namedPlaceholders:true,
				sql: "DELETE FROM uploadDownload where uuid=:uuid"
			}
			await this.conn.query(queryOptions,uuid);
			return true;
		} catch (error) {
			// TODO add uploadDownload back if failed
			// await this.uploadDownload(user);
			console.error(error);
			return false;
		}
	}
	async getLinkByUuid(uuid:string): Promise<UploadDownloadLink | null> {
		try {
			const queryOptions:QueryOptions = {
				namedPlaceholders:true,
				sql: "SELECT * FROM uploadDownload WHERE uuid=:uuid"
			};
			const uploadDownloadLink:UploadDownloadLink[] = await this.conn.query(queryOptions,{uuid}) as UploadDownloadLink[];
			if(uploadDownloadLink.length > 0) {
				if (uploadDownloadLink[0] !== undefined)
					return uploadDownloadLink[0];
				else
					return null;
			} else {
				return null;
			}
		} catch (error) {
			console.error(error);
			return null;
		}
	}

	async getLinksByProductIdAndFileType(productId:string, fileType:string): Promise<UploadDownloadLink[]> {
		try {
			const queryOptions:QueryOptions = {
				namedPlaceholders:true,
				sql: "SELECT * FROM uploadDownload WHERE productId=:productId AND fileType=:fileType"
			};
			const uploadDownloadLinks:UploadDownloadLink[] = await this.conn.query(queryOptions,{productId,fileType}) as UploadDownloadLink[];
			if(uploadDownloadLinks.length > 0) {
				return uploadDownloadLinks;
			} else {
				return [];
			}
		} catch (error) {
			console.error(error);
			return [];
		}
	}

	async getLinksByProductId(productId:string, date:string): Promise<UploadDownloadLink[]> {
		try {
			const queryOptions:QueryOptions = {
				namedPlaceholders:true,
				sql: ""
			};
			let links:UploadDownloadLink[] = [] as UploadDownloadLink[];

			if(date === "none") {
				queryOptions.sql = "SELECT * FROM uploadDownload WHERE productId=:productId";
				links = await this.conn.query(queryOptions,{productId}) as UploadDownloadLink[];
			} else if(date === "may") {
				queryOptions.nestTables="_";
				queryOptions.sql = "SELECT uploadDownload.* products.* FROM uploadDownload INNER JOIN products ON products.productId = uploadDownload.productId AND JSON_EXTRACT(productDetails,'$.assessment20May') = 'Yes' WHERE uploadDownload.productId=:productId ";
				links = await this.conn.query(queryOptions,{productId}) as UploadDownloadLink[];
			} else if(date === "oct") {
				queryOptions.nestTables="_";
				queryOptions.sql = "SELECT uploadDownload.* products.* FROM uploadDownload INNER JOIN products ON products.productId = uploadDownload.productId AND JSON_EXTRACT(productDetails,'$.assessment20May') = 'Yes' AND JSON_EXTRACT(productDetails,'$.assessment12Oct') = 'Yes' WHERE uploadDownload.productId=:productId ";
				links = await this.conn.query(queryOptions,{productId}) as UploadDownloadLink[];
			}
			
			if(links)
				return links;
			else 
				return [];
		} catch (e) {
			console.error(e);
			return [];
		}
	}

	async getLinksByFileTypePass(fileType:string,date:string): Promise<UploadDownloadLink[]> {
		try {
			const queryOptions:QueryOptions = {
				namedPlaceholders:true,
				nestTables:"_",
				sql: ""
			};
			let links:UploadDownloadLink[] = [] as UploadDownloadLink[];

			if(date === "none") {
				queryOptions.sql = "SELECT uploadDownload.*, products.* FROM uploadDownload INNER JOIN products ON products.productId=uploadDownload.productId WHERE uploadDownload.fileType=:fileType";
				links = await this.conn.query(queryOptions,{fileType}) as UploadDownloadLink[];
			} else if(date === "may") {
				queryOptions.sql = "SELECT uploadDownload.*, products.* FROM uploadDownload INNER JOIN products ON products.productId=uploadDownload.productId AND JSON_EXTRACT(productDetails,'$.assessment20May') = 'Yes' WHERE uploadDownload.fileType=:fileType";
				links = await this.conn.query(queryOptions,{fileType}) as UploadDownloadLink[];
			} else if(date === "oct") {
				queryOptions.sql = "SELECT uploadDownload.*, products.* FROM uploadDownload INNER JOIN products ON products.productId=uploadDownload.productId AND JSON_EXTRACT(productDetails,'$.assessment20May') = 'Yes' AND JSON_EXTRACT(productDetails,'$.assessment12Oct') = 'Yes' WHERE uploadDownload.fileType=:fileType";
				links = await this.conn.query(queryOptions,{fileType}) as UploadDownloadLink[];
			}
		
			if(links)
				return links;
			else
				return [];
		} catch (e) {
			console.error(e);
			return [];
		}
	}

	async addS3File(uuid:string,fileData:string, fileType:string): Promise<Boolean> {
		try {
			await AWS.config.update({region: process.env.REGION, accessKeyId: process.env.AKEY, secretAccessKey: process.env.ASECRETKEY});
			const s3 = new AWS.S3();
			if(uuid !== "" && uuid !== undefined) {
				const uploadParams:any = {
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
						(uploadParams.Body as any) = buffer;
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
						(uploadParams.Body as any) = fileBuffer;
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
					utf8Data = (response.Body as any).toString("base64");
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
	async getS3Url(uuid:string, userId?:number): Promise<string> {
		try {
			AWS.config.update({region: process.env.REGION, accessKeyId: process.env.AKEY, secretAccessKey: process.env.ASECRETKEY});
			const s3 = new AWS.S3({
				signatureVersion: 'v4',
			});
			let name = "";
			if(userId !== undefined && userId !==0) {
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
			if(uuid !== undefined && uuid !== "") {
				const deleteParams:any = {
					Bucket: process.env.BUCKET, 
					Key: uuid
				};
				if(s3.deleteObject (deleteParams, (err:any, data:any) => {
					if (err) {
						console.error("Error", err);
						return false;
					} if (data) {
						console.log("Upload Success", data);
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

	async generateZip(type:string,date:string,linkUuid:string,param?:string | number | number[], option?:string) {
		try {
			(uploadDownload as any).zips[linkUuid] = new jszip;
			let zip = (uploadDownload as any).zips[linkUuid];
			if(type === "all") {
				const products = await teams.getTeams();
				for(const product of products) {
					const prId = product.productId;
					const links = await uploadDownload.getLinksByProductId(prId.toString(), date);
					const usersArr = await teams.getUsersByTeamId(product.teamId);
					const folder = product.location+'/'+product.teamName;
					const d = await teams.isTeamInDate(date,prId);
					if(usersArr.length !== 0 && d) {
						for(const user of usersArr) {
							if(user)
							if(user.avatarUu !== '' && user.avatarUu !== null) {
								const obj:string = await uploadDownload.getS3Object(user.avatarUu);
								let name = folder+'/UserImages/'+product.location + "_" + product.teamName+'_profile_photo_'+user.firstName + "_" + user.lastName + '.png';
								if(obj !== "") {
									zip.file(name, obj, {base64:true});
								} else {
									console.error("No such object");
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
							if(prId !== 0 && product !== undefined) {
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
				if(typeof param === "string") {
					const products = await teams.getTeamsByLocation(param);
					for(const product of products) {
						const prId = product.productId;
						const links = await uploadDownload.getLinksByProductId(prId.toString(), date);
						const users = await teams.getUsersByTeamId(product.teamId);
						const d = await teams.isTeamInDate(date,prId);
						if(users.length !== 0 && d) {
							for(const user of users) {
								if(user)
								if(user.avatarUu !== '' && user.avatarUu !== null) {
									const obj:string = await uploadDownload.getS3Object(user.avatarUu);
									let name = product.teamName+'/UserImages/'+product.location + "_" + product.teamName+'_profile_photo_'+user.firstName + "_" + user.lastName + '.png';
									if(obj !== "") {
										zip.file(name, obj, {base64:true});
									} else {
										console.error('No obj GETS3OBJ');
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
								if(prId !== 0 && product !== undefined) {
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

				} else if (typeof param === "number") {
					// let links = await uploadDownload.getLinksByProductId(param.toString(), date);
					const team = await teams.getTeamByProductId(param);
					let users;
					if(team)
						users = await teams.getUsersByTeamId(team.teamId);
					const d = await teams.isTeamInDate(date,param);
					const links:any[] = [];
					if(users && team)
					if(users.length !== 0 && d) {
						for(const user of users) {
							if(user)
							if(user.avatarUu !== '' && user.avatarUu !== null) {
								const obj:string = await uploadDownload.getS3Object(user.avatarUu);
								let name = 'UserImages/'+team.location + "_" + team.teamName+'_profile_photo_'+user.firstName + "_" + user.lastName + '.png';
								if(obj !== "") {
									zip.file(name, obj, {base64:true});
								} else {
									console.error('No obj GETS3OBJ');

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
				} else if (typeof param === "object" && typeof param[0] === "number") {
					const teamsArr = await teams.getTeamsByIdList(param);
					for(const team of teamsArr) {
						const prId = team.productId;
						const users = await teams.getUsersByTeamId((team as any).teamId);
						const d = await teams.isTeamInDate(date,prId);
						if(users.length !== 0 && d && option === "everything") {
							for(const user of users) {
								if(user)
								if(user.avatarUu !== '' && user.avatarUu !== null) {
									const obj:string = await uploadDownload.getS3Object(user.avatarUu);
									let name = team.teamName+'/UserImages/'+team.location + "_" + team.teamName+'_profile_photo_'+user.firstName + "_" + user.lastName + '.png';
									if(obj !== "") {
										zip.file(name, obj, {base64:true});
									} else {
										console.error('No obj GETS3OBJ');
									}
								}
							}
						}
						let links = [] as any[];
						if(option !== undefined)
							links = await uploadDownload.getLinksByProductIdAndFileType(prId.toString(),option);
						else
							links = await uploadDownload.getLinksByProductId(prId.toString(), 'none');
						if(links.length !== 0) {
							if(option === "everything") {
								zip.folder(team.teamName);
								zip.folder(team.teamName + "/Videos");
								zip.folder(team.teamName + "/Images");
								zip.folder(team.teamName + "/PowerPoint");
							}
							for(const link of links) {
								if(prId !== 0 && team !== undefined) {
									const date = uploadDownload.formatDate(link.uploadTime);
									let name = "";
									
									if(option === "everything") {
										if(link.fileType === "demoVid") {
											name = team.teamName+'/Videos/'+team.location + "_" + team.teamName + "_tehnic_demo_video_" + date + "." + link.extension;
										} else if(link.fileType ==="presVid") {
											name = team.teamName+'/Videos/'+team.location + "_" + team.teamName + "_products_presentation_video_" + date + "." + link.extension;
										} else if(link.fileType ==="pres") {
											name = team.teamName+'/PowerPoint/'+team.location + "_" + team.teamName + "_powerpoint_presentation_" + date + "."  + link.extension;
										} else if(link.fileType ==="image") {
											name = team.teamName+'/Images/'+team.location + "_" + team.teamName + "_products_image_"+ link.uuid[0] +link.uuid[1] + link.uuid[2] + "_" + date + "."  + link.extension;
										} else if(link.fileType ==="logo") {
											name = team.teamName+'/Images/'+team.location + "_" + team.teamName + "_logo_" + date + "."  + link.extension;
										} else {
											console.error('Unidentified link');
										}
									} else {
										if(option === "demoVid") {
											name = team.location + "_" + team.teamName + "_tehnic_demo_video_" + date + "." + link.extension;
										} else if(option ==="presVid") {
											name = team.location + "_" + team.teamName + "_products_presentation_video_" + date + "." + link.extension;
										} else if(option ==="pres") {
											name = team.location + "_" + team.teamName + "_powerpoint_presentation_" + date + "."  + link.extension;
										} else if(option ==="image") {
											name = team.location + "_" + team.teamName + "_products_image_"+ link.uuid[0] +link.uuid[1] + link.uuid[2] + "_" + date + "."  + link.extension;
										} else if(option ==="logo") {
											name = team.location + "_" + team.teamName + "_logo_" + date + "."  + link.extension;
										} else {
											console.error('Unidentified link');
										}
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
				}
			}
			const uuid= uiidv4();
			if(zip !== null) {
				if(Object.keys(zip.files).length === 0) {
					await fs.writeFile(path.join("/tmp","NO_FILE.txt"),"NO_FILE");
					const link:UploadDownloadLink = {
						uuid:linkUuid,
						productId:7051998,
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
							productId:7051998,
							fileType:linkUuid+"_zip",
							extension:".zip",
							uploadTime: new Date()
						}
						if(link.uuid !== "") {
							let upload:Boolean | any = false;
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
	async checkZip(type:string, date:string, param?:string|number|number[], option?:string):Promise<void> {
		try {
			let link:UploadDownloadLink | null = null;
			if(link) null
			let uuid = '';
			if(type === "all") {
				uuid = "all_uploads_arhive_" + date;
				link = await uploadDownload.getLinkByUuid(uuid);
			} else {
				if(typeof param === "string") {
					uuid = param + "_uploads_arhive_" + date;
					link = await uploadDownload.getLinkByUuid(uuid);
				} else if(typeof param === "number") {
					const product = await teams.getProductById(param);
					if(product)
						uuid = product.startupName + "_uploads_arhive";
					link = await uploadDownload.getLinkByUuid(uuid);
				} else if(typeof param === "object" && typeof param[0] === "number") {
					if(option !== undefined)
						uuid = "demoday_uploads_arhive_" + option;
					else 
						uuid = "demoday_uploads_arhive";
					link = await uploadDownload.getLinkByUuid(uuid);
				}
			}
			if(link) {
				const oldDate = new Date(link.uploadTime).getTime();
				const newDate = new Date().getTime();
				if(link.uuid === '' || newDate - oldDate >= 86400000) {
					if((uploadDownload as any).zips[uuid] === null) {
						await uploadDownload.generateZip(type,date,uuid,param, option);
						return;
					} else if((uploadDownload as any).zips[uuid] === undefined) {
						(uploadDownload as any).zips[uuid] = null;
						await uploadDownload.generateZip(type,date,uuid,param, option);
						return;
					}
				}
			}
		} catch (e) {
			console.error(e);
			return;
		}
	}

	async getZip(type:string, date:string, param?:string|number, option?:string):Promise<string> {
		try {
			let link:UploadDownloadLink | null = null;
			let uuid = '';
			if(type === "all") {
				uuid = "all_uploads_arhive_" + date;
				link = await uploadDownload.getLinkByUuid(uuid);

			} else {
				if(typeof param === "string") {
					uuid = param + "_uploads_arhive_" + date;
					link = await uploadDownload.getLinkByUuid(uuid);
				} else if(typeof param === "number") {
					const product = await teams.getProductById(param);
					if(product)
						uuid = product.startupName + "_uploads_arhive";
					link = await uploadDownload.getLinkByUuid(uuid);
				} else if(typeof param === "object" ) {
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
	router.use((authFunct as any));

router.get("/get/file/product/:fileType/:productId", async(req:ApiRequest<undefined>, res:ApiResponse<{data:string,type:string,ext:string,uuid:string}[] | null>) => {
	try {
		const type = req.params.fileType;
		const productId = parseInt(req.params.productId);
		if(productId !== 0 && productId !== undefined && type !== "" && type !== undefined) {
			let links = await uploadDownload.getLinksByProductIdAndFileType(productId.toString(),type);
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
router.get("/download/zip/:type/:date", async(req:ApiRequest<undefined>, res:ApiResponse<string | null>) => {
	try {
		const type = req.params.type;
		const date = req.params.date;
		let links = await uploadDownload.getLinksByFileTypePass(type,date);
		if(links.length !== 0) {
			let zip = new jszip();
			for(const link of links) {
				const product = await teams.getProductById(link.productId);
				if(product) {
					const date = uploadDownload.formatDate(link.uploadTime);
					let name = "";
					if(type === "demoVid") {
						name = product.startupName + "_tehnic_demo_video_" + date + "." + link.extension;
					} else if(type ==="presVid") {
						name = product.startupName + "_products_presentation_video_" + date + "." + link.extension;
					} else if(type ==="pres") {
						name = product.startupName + "_powerpoint_presentation_" + date + "."  + link.extension;
					} else if(type ==="image") {
						zip.folder(product.startupName);
						name = product.startupName + "/" + product.startupName + "_products_image_"+ link.uuid[0] +link.uuid[1] + link.uuid[2] + "_" + date + "."  + link.extension;
					} else if(type ==="logo") {
						name = product.startupName + "_logo_" + date + "."  + link.extension;
					} else {
						name = type + link.extension;
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
					uuid:type,
					productId:7051998,
					fileType:type+"_zip",
					extension:".zip",
					uploadTime: new Date()
				}
				const newLink = await uploadDownload.addLink(link);
				if(newLink) {
					let upload:Boolean | any = false;
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

router.post("/download/zip/", async(req:ApiRequest<{type:string,date:string,cityOrTeam:string|number,option:string}>, res:ApiResponse<string | null>) => {
	try {
		const type = req.body.type;
		const date = req.body.date;
		/*either string (city) or number (productId) or nothing ('')*/
		const cityOrTeam:string|number = req.body.cityOrTeam;
		const option:string = req.body.option;
		res.status(200).send('OK');
		await uploadDownload.checkZip(type,date,cityOrTeam, option);
	} catch (e) {
		console.error(e);
		res.status(500).send({err:500,data:null});
	}
});

router.post("/check/zip/status/", async(req:ApiRequest<{type:string,date:string,cityOrTeam:string|number,option:string}>, res:ApiResponse<string | null>) => {
	try {
		const type = req.body.type;
		const date = req.body.date;
		/*either string (city) or number (productId) or nothing ('')*/
		const cityOrTeam:string|number = req.body.cityOrTeam; 
		const option:string = req.body.option;
		const response = await uploadDownload.getZip(type,date,cityOrTeam, option);
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


router.post("/download/team/zip/:type/:date", async(req:ApiRequest<{type:string,date:string,productId:number,city:string}>, res:ApiResponse<string | null>) => {
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
				let links = await uploadDownload.getLinksByProductId(productId.toString(), date);
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
					let links = await uploadDownload.getLinksByProductId(prId.toString(), date);
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
							if(prId !== 0 && product !== undefined) {
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
									res.status(400).send('Unidentified link');
								}
								console.log(name);
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
					let links = await uploadDownload.getLinksByProductId(prId.toString(), date);
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
							if(prId !== 0 && product !== undefined) {
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
					productId:7051998,
					fileType:linkUuid+"_zip",
					extension:".zip",
					uploadTime: new Date()
				}
				const newLink = await uploadDownload.addLink(link);
				if(newLink) {
					let upload:Boolean | any = false;
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

router.post("/upload/file/chunk", async(req:ApiRequest<{finish:string,fileName:string,base64Encode:string,fileType:string,productId:number,ext:string}>, res:ApiResponse<boolean>) => {
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
			await fs.appendFile(path.join("./tmp",fileName + "." + req.body.ext), data);
			res.status(202).send(true);
		} else { 
			const fileType = req.body.fileType;
			const productId = req.body.productId;
			const filePath = path.join('./tmp', fileName + "." + req.body.ext);
			if(fileType !== 'pres') {
				let width;
				let height;
				const checkFile = await fs.pathExists(filePath);
				if(!checkFile) {
					console.error("No file");
					res.status(404).send({err:404,data:false});
				}
				try { 
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
						if((width as any) >= 1920 && (height as any) >= 1080) {
							const link:UploadDownloadLink = {
								uuid:"",
								productId:productId,
								fileType:fileType,
								extension:req.body.ext,
								uploadTime: new Date()
							}
							if(fileType === "demoVid" || fileType === "presVid" || fileType === "pres" || fileType === "logo") {
								let links:UploadDownloadLink[] = await uploadDownload.getLinksByProductIdAndFileType(productId.toString(),fileType);
								if(links.length > 0) {
									const file = await uploadDownload.getS3Object(links[0].uuid);
									
									if(file !== undefined) {
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
										}
										else {
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
				let links:UploadDownloadLink[] = await uploadDownload.getLinksByProductIdAndFileType(productId.toString(),fileType);
				if(links.length > 0) {
					const file = await uploadDownload.getS3Object(links[0].uuid);
				
					if(file !== undefined) {
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
						}
						else {
							await fs.remove(filePath);
							res.status(500).send({err:500,data:false});
						}
					}
				}
				const newLink = await uploadDownload.addLink(link);
				if(newLink) {
					let upload:Boolean | any = false;
					if(filePath !== "")
					{
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


router.post("/upload/file/user/avatar", async(req:ApiRequest<{base64Encode:string,userId:number}>, res:ApiResponse<boolean>) => {
	try {
		const base64Encode = req.body.base64Encode;
		const userId = req.body.userId;
		if(base64Encode !== "" && base64Encode !== undefined && userId !== 0 && userId !== undefined) {
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
router.post("/get/file/user/avatar/", async(req:ApiRequest<{userId:number}>, res:ApiResponse<string | null>) => {
	try {
		const userId = req.body.userId;
		if(userId !== 0 && userId !== undefined) {
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