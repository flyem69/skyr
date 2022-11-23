import { Observable, Subscriber } from 'rxjs';
import { io, Socket } from 'socket.io-client';

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import Peer from 'peerjs';
import { ApiEndpoint } from 'src/app/enums/api-endpoint';
import { SocketEvent } from 'src/app/enums/socket-event';
import { StreamData } from 'src/app/models/stream-data';
import { PeerEvent } from '../enums/peer-event';
import { EmittedStream } from '../models/emitted-stream';
import { ViewedStream } from '../models/viewed-stream';

@Injectable({
	providedIn: 'root',
})
export class StreamService {
	private emittedStream: EmittedStream;
	private viewedStream: ViewedStream;
	socket: Socket;
	peer: Peer;

	constructor(private httpClient: HttpClient) {
		this.emittedStream = new EmittedStream();
		this.viewedStream = new ViewedStream();
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

	enterStream(socketId: string): Observable<MediaStream> {
		return new Observable((subscriber) => {
			try {
				switch (this.viewedStream.getState()) {
					case ViewedStream.State.EMPTY:
						this.viewedStream.initiate();
						if (this.socket.id === socketId) {
							const emittedStream = this.emittedStream.getNonNull();
							this.viewedStream.setView(emittedStream);
							this.completeEnterStream(emittedStream, subscriber);
							return;
						}
						this.setEnterStreamListeners(subscriber);
						this.socket.emit(SocketEvent.JOIN_STREAM, socketId, this.peer.id);
						break;
					case ViewedStream.State.INITIATED:
						// todo: problem :D
						break;
					case ViewedStream.State.PREVIEW:
						break;
					default:
						throw 'bad state';
				}
			} catch (exception) {
				this.viewedStream.empty();
				this.completeEnterStreamWithFail(subscriber);
			}
		});
	}

	private completeEnterStream(stream: MediaStream, subscriber: Subscriber<MediaStream>): void {
		subscriber.next(stream);
		subscriber.complete();
	}

	private completeEnterStreamWithFail(subscriber: Subscriber<MediaStream>): void {
		// todo: error toast
		subscriber.complete();
	}

	private setEnterStreamListeners(subscriber: Subscriber<MediaStream>): void {
		this.socket.on(SocketEvent.VIEWER_JOINED, (peerId) => {});
		this.socket.on(SocketEvent.VIEWER_LEFT, (peerId) => {});
		this.peer.on(PeerEvent.CALL, (call) => {
			call.answer(); // todo: sprawdź czy można zmienić kolejność
			call.on(PeerEvent.STREAM, (stream) => {
				// todo: sprwadź czy try catch łapie
				this.viewedStream.setView(stream);
				this.completeEnterStream(stream, subscriber);
			});
		});
	}

	leaveStream(socketId: string): void {}

	join(socketId: string): Observable<MediaStream | null> {
		return new Observable((joiner) => {
			if (this.socket.id === socketId) {
				joiner.next(this.emittedStream.get());
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
}
