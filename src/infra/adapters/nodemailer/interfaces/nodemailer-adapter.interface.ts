export interface INodemailerAdapter {
  sendMail(options: {
    to: string;
    subject: string;
    text?: string;
    html?: string;
    from?: string;
  }): void;
}
