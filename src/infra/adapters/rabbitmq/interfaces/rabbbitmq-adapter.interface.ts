export interface RabbitMQAdapterInterface {
    sendToQueue(queue: string, message: string): Promise<void>;
    consume(queue: string, callback: (msg: string) => void): Promise<void>;
    close(): Promise<void>;
}