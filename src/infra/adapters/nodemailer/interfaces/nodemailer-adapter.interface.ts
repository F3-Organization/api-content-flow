import SMTPTransport from "nodemailer/lib/smtp-transport";

export interface INodemailerAdapter {
  sendMail(options: {
    to: string;
    subject: string;
    text?: string;
    html?: string;
    from?: string;
  }): Promise<SMTPTransport.SentMessageInfo>;
}
