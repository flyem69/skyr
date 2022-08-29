import { Socket, io } from 'socket.io-client';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import Peer from 'peerjs';
import { SocketEvent } from 'src/app/enums/socket-event';
import { StreamData } from 'src/app/models/stream-data';

@Injectable({
	providedIn: 'root',
})
export class StreamService {
	private stream?: MediaStream;
	private socket: Socket;
	private peer: Peer;

	constructor(private httpClient: HttpClient) {
		this.socket = io({
			port: 443,
			path: '/socket',
		});
		this.peer = new Peer({
			host: '/',
			port: 443,
			path: '/peer',
			secure: true,
			debug: 3,
		});
	}

	start(stream: MediaStream): void {
		this.stream = stream;
		this.socket.on(SocketEvent.VIEWER_JOINING, (viewerId) => {
			this.peer.call(viewerId, stream);
			console.log(`User ${viewerId} joined`);
		});
		this.socket.on(SocketEvent.VIEWER_LEAVING, (viewerId) => {
			console.log(`User ${viewerId} left`);
		});
		this.socket.emit(SocketEvent.START_STREAM);
		this.stream.getVideoTracks()[0].addEventListener('ended', () => {
			this.endStream();
		});
	}

	join(streamId: string): void {}

	leave(streamId: string): void {}

	fetchAll(): Observable<StreamData[]> {
		return this.httpClient.get<StreamData[]>('/api/streams');
	}

	private endStream(): void {
		this.socket.emit(SocketEvent.END_STREAM);
		this.socket.off(SocketEvent.VIEWER_JOINING);
		this.socket.off(SocketEvent.VIEWER_LEAVING);
		this.stream = undefined;
	}
}
