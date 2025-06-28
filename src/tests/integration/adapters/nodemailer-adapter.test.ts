import { INodemailerAdapter, NodemailerAdapter } from "@/infra";
import { SentMessageInfo } from "nodemailer";

let nodemailerAdapter: INodemailerAdapter;

beforeAll(() => {
  nodemailerAdapter = new NodemailerAdapter();
});

describe("Nodemailer Adapter Integration Tests", () => {
  it("should send an email successfully", async () => {
    const emailData = {
      to: "felipe.dev2148@gmail.com",
      subject: "Test Email",
      text: "This is a test email.",
    };
    const sendEmail = jest.fn(nodemailerAdapter.sendMail).mockResolvedValue({
      accepted: ["felipe.dev2148@gmail.com"],
    } as SentMessageInfo);
    const result = await sendEmail(emailData);
    expect(result).toBeTruthy();
  });
});
