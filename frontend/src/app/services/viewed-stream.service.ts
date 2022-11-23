import { BehaviorSubject, Observable } from 'rxjs';

import { Injectable } from '@angular/core';
import { PeerEvent } from '../enums/peer-event';
import { SocketEvent } from '../enums/socket-event';
import { ViewedStreamState } from '../models/viewed-stream-state';
import { ViewedStream2 } from '../models/viewed-stream2';
import { EmittedStreamService } from './emitted-stream.service';
import { StreamService } from './stream.service';

@Injectable({
	providedIn: 'root',
})
export class ViewedStreamService {
	private stream$: BehaviorSubject<ViewedStream2>;

	constructor(
		private streamService: StreamService,
		private emittedStreamService: EmittedStreamService
	) {
		this.stream$ = new BehaviorSubject<ViewedStream2>({ state: ViewedStreamState.EMPTY });
	}

	preview(socketId: string): Observable<MediaStream> {
		return new Observable((subscriber) => {
			if (this.stream$.getValue().state !== ViewedStreamState.EMPTY) {
				// todo: toast
				console.log('viewed-stream service preview');
				this.resetStream();
				subscriber.complete();
				return;
			}
			this.stream$.next({ state: ViewedStreamState.INITIATED });
			if (this.streamService.socket.id === socketId) {
				const emittedStream = this.emittedStreamService.stream$.getValue().stream;
				this.stream$.next({ state: ViewedStreamState.PREVIEW, stream: emittedStream });
				subscriber.next(emittedStream);
				subscriber.complete();
				return;
			}
			this.streamService.peer.on(PeerEvent.CALL, (connection) => {
				connection.on(PeerEvent.STREAM, (stream) => {
					if (this.stream$.getValue().state === ViewedStreamState.INITIATED) {
						this.stream$.next({
							state: ViewedStreamState.PREVIEW,
							stream: stream,
							connection: connection,
						});
						subscriber.next(stream);
						subscriber.complete();
					} else {
						this.resetStream();
						subscriber.complete();
					}
				});
				connection.answer();
			});
			this.streamService.socket.emit(
				SocketEvent.REQUEST_PREVIEW,
				socketId,
				this.streamService.peer.id
			);
		});
	}

	closePreview(socketId: string): void {
		const currentState = this.stream$.getValue().state;
		if (currentState === ViewedStreamState.EMPTY) {
			// todo: toast
			console.log('viewed-stream service stop');
		} else if (currentState === ViewedStreamState.VIEW) {
			// todo: toast
			console.log('viewed-stream service stop');
		} else if (currentState === ViewedStreamState.PREVIEW) {
			this.streamService.socket.emit(
				SocketEvent.CLOSE_PREVIEW,
				socketId,
				this.streamService.peer.id
			);
		}
		this.resetStream();
	}

	private resetStream(): void {
		// @ts-expect-error
		this.streamService.peer.off(PeerEvent.CALL);
		this.stream$.getValue().connection?.close();
		this.stream$.next({ state: ViewedStreamState.EMPTY });
	}
}
