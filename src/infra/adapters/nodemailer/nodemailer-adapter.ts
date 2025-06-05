import nodemailer from "nodemailer";
import { NodemailerAdapterInterface } from "./interfaces/nodemailer-adapter.interface";


export class NodemailerAdapter implements NodemailerAdapterInterface {
  private transporter;

  constructor(config: any) {
    this.transporter = nodemailer.createTransport(config);
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