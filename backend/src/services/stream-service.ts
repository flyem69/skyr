import { Stream } from "../models/stream";

export class StreamService {
    private static streams = new Map<string, Stream>();

    private constructor() {}

    public static create(socketId: string, title: string): void {
        const stream: Stream = {
            socketId: socketId,
            title: title,
            creationTime: Date.now(),
        }
        this.streams.set(socketId, stream);
    }

    public static getAll(): Stream[] {
        return Array.from(this.streams.values());
    }

    public static deleteIfExists(socketId: string) {
        this.streams.delete(socketId);
    }
}
