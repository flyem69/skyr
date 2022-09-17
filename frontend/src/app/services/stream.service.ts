import { Socket, io } from 'socket.io-client';
import { ApiEndpoint } from 'src/app/enums/api-endpoint';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import Peer from 'peerjs';
import { PeerEvent } from '../enums/peer-event';
import { SocketEvent } from 'src/app/enums/socket-event';
import { StreamData } from 'src/app/models/stream-data';

@Injectable({
	providedIn: 'root',
})
export class StreamService {
	private stream: MediaStream | null;
	private socket: Socket;
	private peer: Peer;

	constructor(private httpClient: HttpClient) {
		this.stream = null;
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

	start(stream: MediaStream, title: string): void {
		this.stream = stream;
		this.socket.on(SocketEvent.VIEWER_JOINED, (peerId) => {
			this.peer.call(peerId, stream);
			console.log(`User ${peerId} joined`);
		});
		this.socket.on(SocketEvent.VIEWER_LEFT, (peerId) => {
			console.log(`User ${peerId} left`);
		});
		this.socket.emit(SocketEvent.START_STREAM, title);
		this.stream.getVideoTracks()[0].addEventListener('ended', () => {
			this.endStream();
		});
	}

	join(socketId: string): Observable<MediaStream | null> {
		return new Observable((joiner) => {
			if (this.socket.id === socketId) {
				joiner.next(this.stream);
				joiner.complete();
				return;
			}
			this.socket.on(SocketEvent.VIEWER_JOINED, (peerId) => {
				console.log(`Viewer ${peerId} joined`);
			});
			this.socket.on(SocketEvent.VIEWER_LEFT, (peerId) => {
				console.log(`Viewer ${peerId} left`);
			});
			this.peer.on(PeerEvent.CALL, (call) => {
				call.answer();
				call.on(PeerEvent.STREAM, (stream) => {
					joiner.next(stream);
					joiner.complete();
				});
			});
			this.socket.emit(SocketEvent.JOIN_STREAM, socketId, this.peer.id);
		});
	}

	leave(socketId: string): void {
		if (this.socket.id !== socketId) {
			this.socket.off(SocketEvent.VIEWER_JOINED);
			this.socket.off(SocketEvent.VIEWER_LEFT);
			// @ts-expect-error
			this.peer.off(PeerEvent.CALL);
		}
		this.socket.emit(SocketEvent.LEAVE_STREAM, socketId, this.peer.id);
	}

	fetchAll(): Observable<StreamData[]> {
		return this.httpClient.get<StreamData[]>(ApiEndpoint.GET_STREAMS);
	}

	private endStream(): void {
		this.socket.emit(SocketEvent.END_STREAM);
		this.socket.off(SocketEvent.VIEWER_JOINED);
		this.socket.off(SocketEvent.VIEWER_LEFT);
		this.stream = null;
	}
}
