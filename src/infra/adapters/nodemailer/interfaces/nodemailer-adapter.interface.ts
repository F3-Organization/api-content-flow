import SMTPTransport from "nodemailer/lib/smtp-transport";
import { Options } from "nodemailer/lib/mailer";

export interface sendMailInput extends Options {}

export interface INodemailerAdapter {
  sendMail(options: sendMailInput): Promise<SMTPTransport.SentMessageInfo>;
}
