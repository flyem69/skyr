export enum SocketEvent {
	START_STREAM = 'startStream',
	END_STREAM = 'endStream',
	JOIN_STREAM = 'joinStream',
	VIEWER_JOINED = 'viewerJoined',
	LEAVE_STREAM = 'leaveStream',
	VIEWER_LEFT = 'viewerLeft',
	REQUEST_PREVIEW = 'requestPreview',
	PREVIEW_REQUESTED = 'previewRequested',
	CLOSE_PREVIEW = 'closePreview',
	PREVIEW_CLOSED = 'previewClosed',
}
