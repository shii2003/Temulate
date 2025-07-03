import { createClient, RedisClientOptions, RedisClientType } from "redis";
import { REDIS_CONNECTION_URL } from "./config";

export class RedisManager {

    private subscribeClient: RedisClientType;
    private publishClient: RedisClientType;
    private static instance: RedisManager;

    private constructor() {
        this.publishClient = createClient({ url: REDIS_CONNECTION_URL });
        this.subscribeClient = createClient({ url: REDIS_CONNECTION_URL });

        this.publishClient.connect().catch(console.error);
        this.subscribeClient.connect().catch(console.error);

        this.publishClient.on("error", (err) => console.error('Publisher Error: ', err));
        this.subscribeClient.on("error", (err) => console.log('Subscriber Error: ', err));
    }

    public static getInstance(): RedisManager {
        if (!this.instance) {
            this.instance = new RedisManager();
        }
        return this.instance;
    }

    public getPublishClient(): RedisClientType {
        return this.publishClient;
    }

    public getSubscribeClient(): RedisClientType {
        return this.subscribeClient;
    }

    public async setKeyWithExpiry(key: string, value: string, seconds: number) {
        await this.publishClient.set(key, value, { EX: seconds })
    }

    public async delKey(key: string) {
        await this.publishClient.del(key);
    }

    public async subscribeToKeyExpiry(onExpire: (key: string) => void) {
        await this.subscribeClient.subscribe("__keyevent@0__:expired", (key) => {
            onExpire(key);
        })
    }

}