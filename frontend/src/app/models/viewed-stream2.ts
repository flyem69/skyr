import Peer from 'peerjs';
import { ViewedStreamState } from './viewed-stream-state';

export interface ViewedStream2 {
	state: ViewedStreamState;
	stream?: MediaStream;
	connection?: Peer.MediaConnection;
}
