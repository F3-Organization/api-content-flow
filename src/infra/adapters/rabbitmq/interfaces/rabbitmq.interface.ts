import { Channel, ChannelModel } from "amqplib";

export interface RabbitMQInterface {
    connect(): Promise<{connection: ChannelModel, channel: Channel}>;
    close(args: {connection: ChannelModel, channel: Channel}): Promise<void>;
}