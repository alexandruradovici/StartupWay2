import { getPool } from "@startupway/database/lib/server";
import { QueryOptions, PoolConnection } from "mariadb";
import { SWNotify } from "../common";
import { Transporter, createTransport, SendMailOptions} from "nodemailer";
import AWS from "aws-sdk";

export class DaemonServer {
	private static INSTANCE?: DaemonServer;
	
	/**
	 * Function that creates an AWS.SES mail transport used to automatically send emails
	 * @returns {Transporter} an AWS.SES transporter
	 */
	createMailTransporter():Transporter | null {
		try {
			AWS.config.update({
				region: process.env.REGION, 
				accessKeyId: process.env.AKEY, 
				secretAccessKey: process.env.ASECRETKEY
			});
			const transporter = createTransport({
				SES: new AWS.SES({
					apiVersion: '2010-12-01'
				}),
				sendingRate: 10
			});
			return transporter
		} catch (error) {
			console.log("Error in function \"createMailTransporter()\"|\"admin\"");
			console.error(error);
			return null;
		}
	}
	
	/**
	 * Function that sends a mail via the AWS.SES transporter 
	 * @param transporter the AWS.SES transporter object
	 * @param mailOptions an instance of type SendMailOptions in which information about where to send the email is found
	 * @returns {boolean} true if mail was sent, false otherwise
	 */
	sendMail(transporter:Transporter,mailOptions:SendMailOptions):boolean {
		try {
			let response = {};
			// Documented as any
			transporter.sendMail(mailOptions, function(error:Error | null, info:any){
				if (error) {
					console.log("Error in function \"sendMail(transporter, mailOptions)\"|\"admin\"");
					console.error(error);
				} else {
					console.log('Email sent to ' + mailOptions.to + ' : ' + info.response);
					response = info.response;
				}
			});
			if(response !== {})
				return true;
			else
				return false;
		} catch (error) {
			console.log("Error in function \"sendMail(transporter, mailOptions)\"|\"admin\"");
			console.error(error);
			return false;
		}
	}
	
	/**
	 * Function that creates an object of type SendMailOptions for the AWS.SES transporter
	 * @param from - sending email address
	 * @param to - receiving email address
	 * @param subject - subject of email
	 * @param text - email text
	 * @returns {SendMailOptions} - the mail options
	 */
	createMailOptions(from:string,to:string,subject:string,text:string):SendMailOptions {
		const mailOptions:SendMailOptions = {
			from:from,
			to:to,
			subject:subject,
			text:text
		}
		return mailOptions
	}

	async deleteNotification(notification:SWNotify):Promise<boolean> {
		let conn:PoolConnection | null = null;
		try {
			conn = await getPool().getConnection();
			if(conn) {
				await conn.beginTransaction()
				const queryOptions:QueryOptions = {
					namedPlaceholders:true,
					sql:"DELETE FROM notifications WHERE email=:email AND notifyType=:notifyType AND msgType=:msgType"
				}
				await conn.query(queryOptions, notification);
				queryOptions.sql = "SELECT * FROM notifications WHERE email=:email AND notifyType=:notifyType AND msgType=:msgType";
				const deletedNotifies:SWNotify[] = await conn.query(queryOptions,notification);
				if(deletedNotifies && deletedNotifies.length === 0) {
					await conn.commit();
					await conn.release();
					return true;
				} else {
					await conn.rollback();
					await conn.release();
					return false;
				}
			} else {
				return false;
			}
		} catch (e) {
			console.log("Error in function \"getTeamData()\"|\"admin\"")
			console.error(e);
			if(conn) {
				await conn.rollback();
				await conn.release();
			}
			return false;
		}
	}
	
	async updateNotificationDate(notification:SWNotify):Promise<boolean> {
		let conn:PoolConnection | null = null;
		try {
			conn = await getPool().getConnection();
			if(conn) {
				await conn.beginTransaction()
				const queryOptions:QueryOptions = {
					namedPlaceholders:true,
					sql:"UPDATE notifications SET date=:date WHERE email=:email AND notifyType=:notifyType AND msgType=:msgType"
				}
				await conn.query(queryOptions, notification);
				queryOptions.sql = "SELECT * FROM notifications WHERE email=:email AND notifyType=:notifyType AND msgType=:msgType";
				const updatedNotifications:SWNotify[] = await conn.query(queryOptions,notification);
				if(updatedNotifications && updatedNotifications.length > 0 && updatedNotifications[0]) {
					await conn.commit();
					await conn.release();
					return true;
				} else {
					await conn.rollback();
					await conn.release();
					return false;
				}
			} else {
				return false;
			}
		} catch (e) {
			console.log("Error in function \"getTeamData()\"|\"admin\"")
			console.error(e);
			if(conn) {
				await conn.rollback();
				await conn.release();
			}
			return false;
		}
	}

	async addNotification(notification:SWNotify):Promise<SWNotify | null> {
		let conn:PoolConnection | null = null;
		try {
			conn = await getPool().getConnection();
			if(conn) {
				await conn.beginTransaction()
				const queryOptions:QueryOptions = {
					namedPlaceholders:true,
					sql:"INSERT INTO notifications values(:email,:notifyType,:msgType,:text,:date)"
				}
				await conn.query(queryOptions, notification);
				queryOptions.sql = "SELECT * FROM notifications WHERE email=:email AND notifyType=:notifyType AND msgType=:msgType";
				const newNotifies:SWNotify[] = await conn.query(queryOptions,notification);
				if(newNotifies && newNotifies.length > 0 && newNotifies[0]) {
					await conn.commit();
					await conn.release();
					return newNotifies[0];
				} else {
					await conn.rollback();
					await conn.release();
					return null;
				}
			} else {
				return null;
			}
		} catch (e) {
			console.log("Error in function \"getTeamData()\"|\"admin\"")
			console.error(e);
			if(conn) {
				await conn.rollback();
				await conn.release();
			}
			return null;
		}
	}

	async delay(time:number):Promise<void> {
		return new Promise((resolve)=>{
			setTimeout(resolve,time);
		});
	}

	public static getInstance (): DaemonServer
	{
		if (!this.INSTANCE)
		{
			this.INSTANCE = new DaemonServer ();
		}
		return this.INSTANCE;
	}
}

const daemon = DaemonServer.getInstance();


async function emailDaemon():Promise<void> {
	let conn:PoolConnection | null = null;
		try {
			conn = await getPool().getConnection();
			if(conn) {
				while(true){
					await conn.beginTransaction();
					const queryOptions: QueryOptions = {
						namedPlaceholders: true,
						sql: "SELECT * FROM notifications ORDER BY date ASC LIMIT 0, 1"
					};
					const notify: SWNotify[] = await conn.query(queryOptions);
					if (notify && notify.length > 0 && notify[0]) {
						//LOGIC
						const notification:SWNotify = notify[0];
						const deleteResp = await daemon.deleteNotification(notification);
						if(deleteResp) {
							if(notification.notifyType === "EMAIL") {
								let from = (process.env.MAIL_USER as string);
								let to = notification.email;
								let text = notification.text;
								let subject = "";
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
								if(subject !== "") {
									const mailOptions = daemon.createMailOptions(from, to, subject, text);
									const transporter = daemon.createMailTransporter();
									if(mailOptions !== null && transporter !== null) {
										const resp = await daemon.sendMail(transporter,mailOptions);
										await daemon.delay(2000);
										if(resp) {
											await conn.commit();
											continue;
										} else {
											await conn.rollback();
											notification.date = new Date();
											await daemon.updateNotificationDate(notification);
										}
									} else {
										console.error("NO MAIL OPTIONS");		
										await conn.rollback();
									}
								}
							}
						} else {
							await conn.rollback();
							notification.date = new Date();
							await daemon.updateNotificationDate(notification);
						}
					}
				}
			} else {
				console.error("NO CONN");
			}
		} catch (error) {
			console.error(error);
			if(conn) {
				await conn.rollback();
				await conn.release();
			}
			console.error("Daemon Failed");
		}
}
emailDaemon();