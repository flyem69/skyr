import { Stream } from "../models/stream";

export class StreamsService {
    private static streams = new Map<string, Stream>();

    public static add(socketId: string, title: string): void {
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

    public static delete(socketId: string) {
        this.streams.delete(socketId);
    }
}
