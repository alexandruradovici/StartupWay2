export enum NotificationType {
	EMAIL = "EMAIL",
	SMS = "SMS",
	WHATSAPP = "WTS"
}
export enum MessageType {
	WELCOME = "WELCOME",
	RESETPASS = "RESETPASS",
	REQUESTUSER = "REQUESTUSER"
} 
export interface SWNotify {
	email:string,
	notifyType:NotificationType,
	msgType:MessageType,
	text:string
	date:Date,
}
