import { Channel, ChannelModel } from "amqplib";
import { RabbitMQAdapterInterface } from "./interfaces/rabbbitmq-adapter.interface";
import { RabbitMQInterface } from "./interfaces/rabbitmq.interface";
import { RabbitMQ } from "./rabbitmq";

export class RabbitMQAdapter implements RabbitMQAdapterInterface {
    private rabbitMQ: RabbitMQInterface;
    private connection: ChannelModel | null;
    private channel: Channel | null;
    constructor(private readonly url: string) {
        this.rabbitMQ = new RabbitMQ(this.url)
        this.connection = null
        this.channel = null
        this.init();
    }

    async init(): Promise<void> {
        const { connection, channel } = await this.rabbitMQ.connect();
        this.connection = connection;
        this.channel = channel;
    }

    async sendToQueue(queue: string, message: string): Promise<void> {
        await this.channel!.assertQueue(queue, { durable: true })
        await this.channel!.sendToQueue(queue, Buffer.from(message));
    }

    async consume(queue: string, callback: (msg: string) => void): Promise<void> {
        await this.channel?.consume(queue, (msg) => {
            if (msg !== null) {
                callback(msg.content.toString());
                this.channel?.ack(msg);
            }
        });
    }

    async close(): Promise<void> {
        await this.connection?.close()
    }
}