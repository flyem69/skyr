import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { SocketEvent } from '../enums/socket-event';
import { EmittedStreamState } from '../models/emitted-stream-state';
import { EmittedStream2 } from '../models/emitted-stream2';
import { StreamService } from './stream.service';

@Injectable({
	providedIn: 'root',
})
export class EmittedStreamService {
	stream$: BehaviorSubject<EmittedStream2>;

	constructor(private streamService: StreamService) {
		this.stream$ = new BehaviorSubject<EmittedStream2>({ state: EmittedStreamState.EMPTY });
	}

	emit(title: string): void {
		if (this.stream$.getValue().state !== EmittedStreamState.EMPTY) {
			//todo: toast
			console.log('emitted-stream service start');
			this.resetStream();
			return;
		}
		this.stream$.next({ state: EmittedStreamState.INITIATED });
		this.chooseScreen()
			.then((stream) => {
				if (this.stream$.getValue().state !== EmittedStreamState.INITIATED) {
					const tracks = stream.getTracks();
					for (const track of tracks) {
						track.stop();
					}
					//todo: toast
					console.log('emitted-stream service start');
					this.resetStream();
				} else {
					this.stream$.next({
						state: EmittedStreamState.EMITTING,
						stream: stream,
					});
					this.setListeners(stream);
					this.streamService.socket.emit(SocketEvent.START_STREAM, title);
				}
			})
			.catch(() => {
				//todo: toast
				console.log('emitted-stream service start');
				this.resetStream();
			});
	}

	stop(): void {
		const currentState = this.stream$.getValue().state;
		if (currentState === EmittedStreamState.EMPTY) {
			//todo: toast
			console.log('emitted-stream service stop');
		} else if (currentState === EmittedStreamState.INITIATED) {
			//todo: toast
			console.log('emitted-stream service stop');
		} else if (currentState === EmittedStreamState.EMITTING) {
			this.streamService.socket.emit(SocketEvent.END_STREAM);
		}
		this.resetStream();
	}

	private setListeners(stream: MediaStream): void {
		const createConnection = (peerId: string) => {
			const connection = this.streamService.peer.call(peerId, stream);
			EmittedStream2.addConnection(peerId, connection);
		};
		const deleteConnection = (peerId: string) => {
			EmittedStream2.deleteConnection(peerId);
		};

		stream.getVideoTracks()[0].addEventListener('ended', () => this.stop());
		this.streamService.socket.on(SocketEvent.PREVIEW_REQUESTED, createConnection);
		this.streamService.socket.on(SocketEvent.PREVIEW_CLOSED, deleteConnection);
		this.streamService.socket.on(SocketEvent.VIEWER_JOINED, createConnection);
		this.streamService.socket.on(SocketEvent.VIEWER_LEFT, deleteConnection);
	}

	private unsetListeners(): void {
		this.streamService.socket.off(SocketEvent.PREVIEW_REQUESTED);
		this.streamService.socket.off(SocketEvent.PREVIEW_CLOSED);
		this.streamService.socket.off(SocketEvent.VIEWER_JOINED);
		this.streamService.socket.off(SocketEvent.VIEWER_LEFT);
	}

	private resetStream(): void {
		this.unsetListeners();
		EmittedStream2.deleteAllConnections();
		this.stream$.next({ state: EmittedStreamState.EMPTY });
	}

	private chooseScreen(): Promise<MediaStream> {
		return navigator.mediaDevices.getDisplayMedia({
			video: true,
			audio: true,
		});
	}
}
