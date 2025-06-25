import nodemailer from "nodemailer";
import { INodemailerAdapter } from "./interfaces/nodemailer-adapter.interface";
import { env } from "@/config/env";

export class NodemailerAdapter implements INodemailerAdapter {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: env.smtp.host,
      port: env.smtp.port,
      secure: process.env.NODE_ENV === "production",
      auth: {
        user: env.smtp.user,
        pass: env.smtp.password,
      },
    });
  }

  sendMail(options: {
    to: string;
    subject: string;
    text?: string;
    html?: string;
    from?: string;
  }) {
    this.transporter.sendMail(options);
  }
}
