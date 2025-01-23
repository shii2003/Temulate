// import { createClient, RedisClientOptions, RedisClientType } from "redis";

// export class RedisManager {

//     private subscribeClient: RedisClientType;
//     private publishClient: RedisClientType;
//     private static instance: RedisManager;

//     private constructor() {
//         this.publishClient = createClient();
//         this.subscribeClient = createClient();

//         this.publishClient.connect().catch(console.error);
//         this.subscribeClient.connect().catch(console.error);

//         this.publishClient.on("error", (err) => console.error('Publisher Error: ', err));
//         this.subscribeClient.on("error", (err) => console.log('Subscriber Error: ', err));
//     }

//     public static getInstance() {
//         if (!this.getInstance) {
//             this.instance = new RedisManager();
//         }
//         return this.instance;
//     }

//     public async publish(channel: string, message: string) {
//         try {
//             await this.publishClient.publish(channel, message);
//         } catch (err) {
//             console.error('Publish Error: ', err);
//         }
//     }

//     public async subscribe(channel: string, callback: (message: string) => void): Promise<void> {
//         try {
//             await this.subscribeClient.subscribe(channel, (msg) => {
//                 callback(msg);
//             })
//         } catch (err) {
//             console.error('Subscribe Error: ', err);
//         }
//     }

// }