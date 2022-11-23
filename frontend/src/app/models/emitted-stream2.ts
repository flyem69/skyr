import Peer from 'peerjs';
import { EmittedStreamState } from './emitted-stream-state';

export class EmittedStream2 {
	private static connections = new Map<string, Peer.MediaConnection>();
	state: EmittedStreamState;
	stream?: MediaStream;

	constructor(state: EmittedStreamState, stream?: MediaStream) {
		this.state = state;
		this.stream = stream;
	}

	static addConnection(peerId: string, connection: Peer.MediaConnection): void {
		EmittedStream2.connections.set(peerId, connection);
	}

	static deleteConnection(peerId: string): void {
		this.connections.get(peerId)?.close();
		this.connections.delete(peerId);
	}

	static deleteAllConnections(): void {
		this.connections.forEach((connection, _) => {
			connection.close();
		});
		this.connections.clear();
	}
}
