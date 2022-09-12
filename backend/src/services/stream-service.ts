import { Stream } from "../models/stream";

export class StreamService {
    private static streams = new Map<string, Stream>();

    private constructor() {}

    static create(socketId: string, title: string): void {
        const stream: Stream = {
            socketId: socketId,
            title: title,
            creationTime: Date.now(),
        }
        this.streams.set(socketId, stream);
    }

    static getAll(): Stream[] {
        return Array.from(this.streams.values());
    }

    static deleteIfExists(socketId: string): void {
        this.streams.delete(socketId);
    }
}
