import nodemailer from "nodemailer";
import { INodemailerAdapter } from "./interfaces/nodemailer-adapter.interface";
import { env } from "@/config/env";
import SMTPTransport from "nodemailer/lib/smtp-transport";
import Mail from "nodemailer/lib/mailer";

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

  async sendMail(
    options: Mail.Options,
  ): Promise<SMTPTransport.SentMessageInfo> {
    return await this.transporter.sendMail(options);
  }
}
