import prisma from "@repo/db/client";

export type MessagePayload = {
    roomId: number;
    userId: number;
    content: string;
    timestamp: string;
}

type Room = {
    id: string;
    members: Set<string>;
}

export class RoomManager {

    private static instance: RoomManager;
    private rooms: Map<string, Room>;

    private consturctor() {
        this.rooms = new Map();
    }

    public static getInstance(): RoomManager {
        if (!this.instance) {
            this.instance = new RoomManager();
        }
        return this.instance;
    }

    //complete the return statement
    public async loadExistingRoom(roomId: number) {
        try {
            const room = await prisma.room.findUnique({
                where: {
                    id: roomId,
                }
            })
        } catch (err) {
            console.log(`an error occured while loading room ${roomId}: `, err);
        }
    }

    public async createRoom(ownerId: number, roomName: string) {
        try {
            const owner = await prisma.user.findUnique({
                where: { id: ownerId },
            });

            if (!owner) {
                console.log(`owner does not exist`);
            }

            const newRoom = await prisma.room.create({
                data: {
                    name: roomName,
                    ownerId: ownerId,
                },
            });

            console.log("Room created successfully:", newRoom);
            return newRoom;
        } catch (err) {
            console.error(`error while creating room: ${roomName} for user: ${ownerId}: `, err);
        }
    }

    // public async sendMessage(roomId: number, userId: number, content:string){
    //     const room = this.rooms.get(rooId)
    // }
}