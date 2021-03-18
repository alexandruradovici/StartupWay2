import { SWNotify } from "../common";
import { Transporter, SendMailOptions } from "nodemailer";
export declare class DaemonServer {
    private static INSTANCE?;
    /**
     * Function that creates an AWS.SES mail transport used to automatically send emails
     * @returns {Transporter} an AWS.SES transporter
     */
    createMailTransporter(): Transporter | null;
    /**
     * Function that sends a mail via the AWS.SES transporter
     * @param transporter the AWS.SES transporter object
     * @param mailOptions an instance of type SendMailOptions in which information about where to send the email is found
     * @returns {boolean} true if mail was sent, false otherwise
     */
    sendMail(transporter: Transporter, mailOptions: SendMailOptions): boolean;
    /**
     * Function that creates an object of type SendMailOptions for the AWS.SES transporter
     * @param from - sending email address
     * @param to - receiving email address
     * @param subject - subject of email
     * @param text - email text
     * @returns {SendMailOptions} - the mail options
     */
    createMailOptions(from: string, to: string, subject: string, text: string): SendMailOptions;
    deleteNotification(notification: SWNotify): Promise<boolean>;
    updateNotificationDate(notification: SWNotify): Promise<boolean>;
    addNotification(notification: SWNotify): Promise<SWNotify | null>;
    delay(time: number): Promise<void>;
    static getInstance(): DaemonServer;
}
//# sourceMappingURL=server.d.ts.map