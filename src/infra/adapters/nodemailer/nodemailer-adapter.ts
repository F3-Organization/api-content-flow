import nodemailer from "nodemailer";
import { INodemailerAdapter } from "./interfaces/nodemailer-adapter.interface";
import { env } from "@/config/env";
import SMTPTransport from "nodemailer/lib/smtp-transport";

export class NodemailerAdapter implements INodemailerAdapter {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: env.smtp.host,
      port: env.smtp.port,
      secure: true,
      auth: {
        user: env.smtp.user,
        pass: env.smtp.password,
      },
    });
  }

  async sendMail(options: {
    to: string;
    subject: string;
    text?: string;
    html?: string;
    from?: string;
  }): Promise<SMTPTransport.SentMessageInfo> {
    return await this.transporter.sendMail(options);
  }
}
