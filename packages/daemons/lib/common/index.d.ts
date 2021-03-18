export declare enum NotificationType {
    EMAIL = "EMAIL",
    SMS = "SMS",
    WHATSAPP = "WTS"
}
export declare enum MessageType {
    WELCOME = "WELCOME",
    RESETPASS = "RESETPASS",
    REQUESTUSER = "REQUESTUSER"
}
export interface SWNotify {
    email: string;
    notifyType: NotificationType;
    msgType: MessageType;
    text: string;
    date: Date;
}
//# sourceMappingURL=index.d.ts.map